// backend/routes/leads.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// ...optional authMiddleware

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.json([]);
    }
    const regex = new RegExp(query.trim(), 'i');
    const leads = await Lead.find({
      $or: [
        { address: { $regex: regex } },
        { phone: { $regex: regex } },
        { jobRef: { $regex: regex } },
      ]
    })
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const leads = await Lead.find(filter)
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return res.status(404).json({ error: 'Lead not found' });

    if (req.body.status === 'completed' && !oldLead.completedAt) {
      req.body.completedAt = new Date();
    }
    const oldData = oldLead.toObject();
    delete oldData.history;

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');

    const newData = updated.toObject();
    delete newData.history;

    updated.history.push({ oldData, newData });
    await updated.save();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
