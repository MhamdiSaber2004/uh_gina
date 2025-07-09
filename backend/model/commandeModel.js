const mongoose = require('mongoose');

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
    etat: {
        type: String,
        enum: ['encours', 'enlivraison' ,'livree', 'annulee'], // Add more states if needed
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