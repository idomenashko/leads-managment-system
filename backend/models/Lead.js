// backend/models/Lead.js
const mongoose = require('mongoose');

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const paymentSchema = new mongoose.Schema({
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  amount: Number,
  overrideFee: Number,
});

const historySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  oldData: Object,
  newData: Object,
});

const leadSchema = new mongoose.Schema({
  jobRef: {
    type: String,
    default: generateRandomString,
    unique: true
  },
  name: String,
  phone: String,
  address: String,
  notes: String,
  parts: { type: Number, default: 0 },
  technicianPercentage: Number,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  payments: [paymentSchema],
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  scheduledDate: Date,

  jobType: { // סוג העבודה
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobType',
    required: false,
  },

  history: [historySchema],
});

module.exports = mongoose.model('Lead', leadSchema);
