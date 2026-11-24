const express = require('express');
const {
    getAllCommandes, 
    getLivreurCommandes, 
    getClientCommandes, 
    createCommandeByClient, 
    createCommandeByAdmin, 
    modifyEtatCommande,
    setFraisLivraison,
    annulerCommandeByClient,
    annulerCommande
} = require('../controller/commandeControler');
const { verifyAdmin, verifyLivreur, verifyclient } = require('../middleware/protected');
const router = express.Router();

// Get all commandes (Admin)
router.get('/', verifyAdmin, getAllCommandes);

// Get livreur commandes
router.get('/livreur', verifyLivreur, getLivreurCommandes);

// Get client commandes
router.get('/client', verifyclient, getClientCommandes);

// Create commande by client
router.post('/create', verifyclient, createCommandeByClient);

// Create commande by admin
router.post('/admin/create', verifyAdmin, createCommandeByAdmin);

// Modify etat commande by livreur
router.put('/modify/:id', verifyLivreur, modifyEtatCommande);

// Set delivery fee by livreur
router.put('/frais/:id', verifyLivreur, setFraisLivraison);

// Client cancel order (strictly allowed ONLY when status is 'encours')
router.put('/client/annuler/:id', verifyclient, annulerCommandeByClient);

// Admin cancel order (at any stage)
router.put('/annuler/:id', verifyAdmin, annulerCommande);

module.exports = router;
