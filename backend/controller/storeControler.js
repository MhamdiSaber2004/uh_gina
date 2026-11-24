const Store = require('../model/storeModel');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            stores: stores
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
    const { name, price, description, available } = req.body;
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
