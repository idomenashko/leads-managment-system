// backend/models/Technician.js
const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  basePercentage: { type: Number, default: 35 },
  color: { type: String, default: '#ffffff' },
});

module.exports = mongoose.model('Technician', technicianSchema);
