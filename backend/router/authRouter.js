const express = require('express');
const router = express.Router();

const {login , register , modifyUser , AddLivreur ,getUser, getAllClients , getAllLivreurs , getAllAdmins} = require('../controller/authControler');
const {verifyclient, verifyLivreur, verifyAdmin } = require('../middleware/protected');

// User registration route
router.post('/register', register);

// User login route
router.post('/login', login);

// User modification route
router.put('/client/modify/:id', verifyclient, modifyUser);
router.put('/livreur/modify/:id', verifyLivreur, modifyUser);
router.put('/admin/modify/:id', verifyAdmin, modifyUser);

// Get user details route
router.get('/client/:id', verifyclient, getUser);
router.get('/livreur/:id', verifyLivreur, getUser);
router.get('/admin/:id', verifyAdmin, getUser);

//add livreur 
router.post('/addlivreur' , verifyAdmin , AddLivreur)

//get all users
router.get('/clients', verifyAdmin, getAllClients);
router.get('/livreurs', verifyAdmin, getAllLivreurs);
router.get('/admins', verifyAdmin, getAllAdmins);


// Export the router
module.exports = router;



