const mongoose = require('mongoose');

const commandeItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    }
});

const commandeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    livreur : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
    },
    items: [commandeItemSchema],
    prixItems: {
        type: Number,
        default: 0
    },
    fraisLivraison: {
        type: Number,
        default: 0
    },
    prixTotal: {
        type: Number,
        default: 0
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    storeName: {
        type: String,
        default: ''
    },
    etat: {
        type: String,
        enum: ['encours', 'enlivraison' ,'livree', 'annulee'],
        default: 'encours',
        required: true
    },
    livreurName: {
        type: String,
    },
    clientName  : {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    adress: {
        type: String,
        required: true
    },
    annulerPar : {
        type :  mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Commande', commandeSchema);
