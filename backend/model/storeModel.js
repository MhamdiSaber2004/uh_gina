const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  }
});

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required']
  },
  category: {
    type: String,
    default: 'مطعم'
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  adress: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  items: [itemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
