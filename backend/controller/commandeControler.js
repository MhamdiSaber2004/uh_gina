const Commande = require('../model/commandeModel');
const User = require('../model/userModel');
const getIDFromToken = require('../utils/getIDFromToken');

exports.getAllCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            commandes : commandes
        });
    } catch (error) {
        console.error("Error fetching commandes:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getLivreurCommandes = async (req, res) => {
    const livreurId = getIDFromToken(req.headers.token);
    try {
        const commandes = await Commande.find({
            $or: [
                { livreur: livreurId },
                { livreur: null }
            ]
        }).sort({ createdAt: -1 });        
        if (!commandes) {
            return res.status(404).json({ message: "No commandes found for this livreur" });
        }
        res.status(200).json({
            success: true,
            commandes : commandes
        });
    } catch (error) {
        console.error("Error fetching livreur commandes:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getClientCommandes = async (req, res) => {
    const clientId = getIDFromToken(req.headers.token);
    try {
        const commandes = await Commande.find({ user : clientId }).sort({ createdAt: -1 });
        if (!commandes) {
            return res.status(404).json({ message: "No commandes found for this client" });
        }
        res.status(200).json({
            success: true,
            commandes : commandes
        });
    } catch (error) {
        console.error("Error fetching client commandes:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.createCommandeByClient = async (req, res) => {
    const clientId = getIDFromToken(req.headers.token);
    const { adress, phone, description, items, store, storeName } = req.body;
    
    // Either description or items should be provided
    if (!adress || !phone || (!description && (!items || items.length === 0))) {
        return res.status(400).json({ message: "Address, phone, and order details or items are required" });
    }

    try {
        const user = await User.findById(clientId);
        if (!user) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Calculate items total price
        let prixItems = 0;
        const formattedItems = Array.isArray(items) ? items.map(item => {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            prixItems += qty * price;
            return {
                name: item.name,
                details: item.details || '',
                quantity: qty,
                price: price,
                image: item.image || ''
            };
        }) : [];

        // Build summary description if items are provided
        let orderDesc = description || '';
        if (formattedItems.length > 0 && !orderDesc) {
            orderDesc = formattedItems.map(it => `${it.quantity}x ${it.name} (${it.price} DT)`).join(' + ');
        }

        const newCommande = new Commande({
            user: clientId,
            adress: adress,
            phone: phone,
            description: orderDesc,
            items: formattedItems,
            prixItems: prixItems,
            fraisLivraison: 0,
            prixTotal: prixItems,
            store: store || null,
            storeName: storeName || '',
            clientName: user.name,
            etat: "encours"
        });

        await newCommande.save();
        res.status(201).json({
            success: true,
            message: "Commande created successfully",
            commande: newCommande
        });
    } catch (error) {
        console.error("Error creating commande:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.createCommandeByAdmin = async (req, res) => {
    const { userId, adress, phone, description, items, fraisLivraison, store, storeName } = req.body;
    if (!userId || !adress || !phone || (!description && (!items || items.length === 0))) {
        return res.status(400).json({ message: "User, address, phone, and description or items are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let prixItems = 0;
        const formattedItems = Array.isArray(items) ? items.map(item => {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            prixItems += qty * price;
            return {
                name: item.name,
                details: item.details || '',
                quantity: qty,
                price: price,
                image: item.image || ''
            };
        }) : [];

        let orderDesc = description || '';
        if (formattedItems.length > 0 && !orderDesc) {
            orderDesc = formattedItems.map(it => `${it.quantity}x ${it.name} (${it.price} DT)`).join(' + ');
        }

        const deliveryFee = Number(fraisLivraison) || 0;

        const newCommande = new Commande({
            user: userId,
            adress: adress,
            phone: phone,
            description: orderDesc,
            items: formattedItems,
            prixItems: prixItems,
            fraisLivraison: deliveryFee,
            prixTotal: prixItems + deliveryFee,
            store: store || null,
            storeName: storeName || '',
            clientName: user.name,
            etat: "encours"
        });

        await newCommande.save();
        res.status(201).json({
            success: true,
            message: "Commande created successfully",
            commande: newCommande
        });
    } catch (error) {
        console.error("Error creating commande by admin:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.modifyEtatCommande = async (req, res) => {
    const commandeId = req.params.id;
    const { etat, fraisLivraison } = req.body;
    const livreurId = getIDFromToken(req.headers.token);

    if (!etat) {
        return res.status(400).json({ message: "Etat is required" });
    }

    try {
        const livreur = await User.findById(livreurId);
        if (!livreur) {
            return res.status(404).json({ message: "Livreur not found" });
        }

        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "Commande not found" });
        }

        commande.etat = etat;
        commande.livreur = livreurId;
        commande.livreurName = livreur.name;

        // If driver provided delivery fee
        if (fraisLivraison !== undefined && fraisLivraison !== null && fraisLivraison !== '') {
            commande.fraisLivraison = Number(fraisLivraison) || 0;
            commande.prixTotal = (commande.prixItems || 0) + commande.fraisLivraison;
        }

        await commande.save();

        res.status(200).json({
            success: true,
            message: "Commande updated successfully",
            commande: commande
        });
    } catch (error) {
        console.error("Error modifying etat:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Dedicated endpoint for driver or admin to set delivery fee
exports.setFraisLivraison = async (req, res) => {
    const commandeId = req.params.id;
    const { fraisLivraison } = req.body;

    if (fraisLivraison === undefined || fraisLivraison === null) {
        return res.status(400).json({ message: "Frais de livraison is required" });
    }

    try {
        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "Commande not found" });
        }

        commande.fraisLivraison = Number(fraisLivraison) || 0;
        commande.prixTotal = (commande.prixItems || 0) + commande.fraisLivraison;
        await commande.save();

        res.status(200).json({
            success: true,
            message: "Frais de livraison updated successfully",
            commande: commande
        });
    } catch (error) {
        console.error("Error setting frais:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Client Cancellation with rule: CANNOT cancel after driver picked it up (enlivraison or livree)
exports.annulerCommandeByClient = async (req, res) => {
    const commandeId = req.params.id;
    const clientId = getIDFromToken(req.headers.token);

    try {
        const commande = await Commande.findById(commandeId);
        if (!commande) {
            return res.status(404).json({ message: "الطلب غير موجود" });
        }

        // Check ownership
        if (String(commande.user) !== String(clientId)) {
            return res.status(403).json({ message: "غير مصرح لك بإلغاء هذا الطلب" });
        }

        // Rule: Only allow cancellation if order is still 'encours'
        if (commande.etat !== 'encours') {
            return res.status(400).json({ 
                message: "عذراً، لا يمكن إلغاء الطلب بعد أن استلمه السائق وهو في طريقه إليك!" 
            });
        }

        commande.etat = 'annulee';
        commande.annulerPar = clientId;
        await commande.save();

        res.status(200).json({
            success: true,
            message: "تم إلغاء الطلب بنجاح",
            commande: commande
        });
    } catch (error) {
        console.error("Error cancelling by client:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Admin cancellation at any stage
exports.annulerCommande = async (req, res) => {
    const commandeId = req.params.id;
    const annulerParId = getIDFromToken(req.headers.token);
    try {
        const commande = await Commande.findByIdAndUpdate(
            commandeId, 
            { etat: 'annulee', annulerPar: annulerParId }, 
            { new: true }
        );
        if (!commande) {
            return res.status(404).json({ message: "Commande not found" });
        }
        res.status(200).json({
            success: true,
            message: "Commande cancelled successfully",
            commande: commande
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
