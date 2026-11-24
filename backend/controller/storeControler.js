const Store = require('../model/storeModel');
const Commande = require('../model/commandeModel');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 }).lean();

        // Compute financial metrics for each store (Total sales & Debt owed)
        const storesWithFinancials = await Promise.all(stores.map(async (store) => {
            const deliveredOrders = await Commande.find({
                store: store._id,
                etat: 'livree'
            });

            const totalDeliveredOrders = deliveredOrders.length;
            const totalSales = deliveredOrders.reduce((sum, c) => sum + (Number(c.prixItems) || 0), 0);
            const totalPaidToStore = Number(store.totalPaidToStore) || 0;
            const totalOwed = Math.max(0, totalSales - totalPaidToStore); // كم تدين له

            return {
                ...store,
                totalDeliveredOrders,
                totalSales,
                totalPaidToStore,
                totalOwed
            };
        }));

        res.status(200).json({
            success: true,
            stores: storesWithFinancials
        });
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({
            success: true,
            store: store
        });
    } catch (error) {
        console.error("Error fetching store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createStore = async (req, res) => {
    const { name, category, phone, adress, address, description, image } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Store name is required" });
    }

    const storeLocation = adress || address || '';

    try {
        const newStore = new Store({
            name: name.trim(),
            category: category || 'مطعم',
            phone: phone || '',
            address: storeLocation,
            adress: storeLocation,
            description: description || '',
            image: image || '',
            totalPaidToStore: 0,
            items: []
        });

        await newStore.save();
        res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: newStore
        });
    } catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.address && !updateData.adress) updateData.adress = updateData.address;
        if (updateData.adress && !updateData.address) updateData.address = updateData.adress;

        const store = await Store.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({
            success: true,
            message: "Store updated successfully",
            store: store
        });
    } catch (error) {
        console.error("Error updating store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({
            success: true,
            message: "Store deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.addItemToStore = async (req, res) => {
    const { name, price, description, image, available } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ message: "Item name and price are required" });
    }

    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        store.items.push({
            name: name.trim(),
            price: Number(price),
            description: description || '',
            image: image || '',
            available: available !== undefined ? available : true
        });

        await store.save();
        res.status(201).json({
            success: true,
            message: "Item added successfully",
            store: store
        });
    } catch (error) {
        console.error("Error adding item to store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteItemFromStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        store.items = store.items.filter(item => item._id.toString() !== req.params.itemId);
        await store.save();

        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            store: store
        });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Record a payment / debt settlement to the store (Admin)
exports.recordStorePayment = async (req, res) => {
    const { amount } = req.body;
    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        return res.status(400).json({ message: "Valid payment amount is required" });
    }

    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        store.totalPaidToStore = (Number(store.totalPaidToStore) || 0) + paymentAmount;
        await store.save();

        res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            store: store
        });
    } catch (error) {
        console.error("Error recording payment to store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
