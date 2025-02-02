// backend/models/JobType.js
const mongoose = require('mongoose');

const jobTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('JobType', jobTypeSchema);
