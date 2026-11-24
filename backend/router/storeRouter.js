const express = require('express');
const {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
    addItemToStore,
    deleteItemFromStore
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

module.exports = router;
