// backend/routes/technicians.js
const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// const { authMiddleware } = require('../middleware/authMiddleware');
// router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const techs = await Technician.find();
    res.json(techs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTech = new Technician(req.body);
    await newTech.save();
    res.status(201).json(newTech);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Technician.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Technician.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
