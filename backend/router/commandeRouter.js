const express = require('express');
const {
    getAllCommandes , 
    getLivreurCommandes , 
    getClientCommandes , 
    createCommandeByClient , 
    createCommandeByAdmin , 
    modifyEtatCommande,
    annulerCommande
} = require('../controller/commandeControler');
const { verifyAdmin , verifyLivreur , verifyclient} = require('../middleware/protected');
const router = express.Router();

//get all commandes
router.get('/', verifyAdmin , getAllCommandes);

//get livreur commandes
router.get('/livreur', verifyLivreur, getLivreurCommandes);

//get client commandes
router.get('/client', verifyclient, getClientCommandes);

//create commande
router.post('/create', verifyclient, createCommandeByClient);

//create commande by admin
router.post('/admin/create', verifyAdmin, createCommandeByAdmin);

//modify etat commande
router.put('/modify/:id', verifyLivreur, modifyEtatCommande);

//anuller commande
router.put('/annuler/:id', verifyAdmin, annulerCommande);

module.exports = router;