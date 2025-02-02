// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const leadRoutes = require('./routes/leads');
const technicianRoutes = require('./routes/technicians');
const paymentMethodRoutes = require('./routes/paymentMethods');
const reportRoutes = require('./routes/reports');
const jobTypeRoutes = require('./routes/jobTypes'); // חדש

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/job-types', jobTypeRoutes); // חדש

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
