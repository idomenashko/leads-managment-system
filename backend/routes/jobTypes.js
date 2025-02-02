// backend/routes/jobTypes.js
const express = require('express');
const router = express.Router();
const JobType = require('../models/JobType');

// אם תרצה הגנה ב-Backend:
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
// router.use(authMiddleware);

// GET /api/job-types
router.get('/', async (req, res) => {
  try {
    const types = await JobType.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/job-types (adminOnly?)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    const newType = new JobType({ name });
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/job-types/:id
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await JobType.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/job-types/:id
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await JobType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
