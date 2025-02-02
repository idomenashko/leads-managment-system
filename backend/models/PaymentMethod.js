// backend/models/PaymentMethod.js
const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: String,
  feePercentage: Number,
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
