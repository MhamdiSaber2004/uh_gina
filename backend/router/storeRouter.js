const express = require('express');
const {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
    addItemToStore,
    deleteItemFromStore,
    recordStorePayment
} = require('../controller/storeControler');
const { verifyAdmin } = require('../middleware/protected');

const router = express.Router();

// Public / Authenticated read routes
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Admin-only management routes
router.post('/', verifyAdmin, createStore);
router.put('/:id', verifyAdmin, updateStore);
router.delete('/:id', verifyAdmin, deleteStore);

// Store items management (Admin)
router.post('/:id/items', verifyAdmin, addItemToStore);
router.delete('/:id/items/:itemId', verifyAdmin, deleteItemFromStore);

// Store payment / debt settlement (Admin)
router.post('/:id/payment', verifyAdmin, recordStorePayment);

module.exports = router;
