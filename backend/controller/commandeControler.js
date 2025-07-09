const Commande = require('../model/commandeModel');
const User = require('../model/userModel');
const  getIDFromToken  = require('../utils/getIDFromToken');

exports.getAllCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find();
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
        });        
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
        const commandes = await Commande.find({ user : clientId });
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
    const {adress , phone ,description } = req.body;
    if (!adress || !phone || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        user = await User.findById(clientId);
        if (!user) {
            return res.status(404).json({ message: "Client not found" });
        }
        const newCommande = new Commande({
            user: clientId,
            adress: adress,
            phone: phone,
            description: description,
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
    const { userId, adress, phone, description } = req.body;
    if (!userId || !adress || !phone || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newCommande = new Commande({
            user: userId,
            adress: adress,
            phone: phone,
            description: description,
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

exports.modifyEtatCommande = async (req,res) =>{
    const commandeId = req.params.id;
    const { etat } = req.body;
    const livreurId = getIDFromToken(req.headers.token);
    if (!etat) {
        return res.status(400).json({ message: "Etat is required" });
    }
    try {
        livreur = await User.findById(livreurId);
        if (!livreur) {
            return res.status(404).json({ message: "Livreur not found" });
        }
        const commande = await Commande.findByIdAndUpdate(commandeId, { etat: etat , livreur : livreurId , livreurName : livreur.name}, { new: true });
        if (!commande) {
            return res.status(404).json({ message: "Commande not found" });
        }
        res.status(200).json({
            success: true,
            message: "Commande updated successfully",
            commande: commande
        });
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.annulerCommande = async (req, res) => {
    const commandeId = req.params.id;
    const annulerParId = getIDFromToken(req.headers.token);
    try {
        const commande = await Commande.findByIdAndUpdate(commandeId, { etat: 'annulee' , annulerPar : annulerParId}, { new: true });
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