// backend/routes/paymentMethods.js
const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');

// const { authMiddleware } = require('../middleware/authMiddleware');
// router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newMethod = new PaymentMethod(req.body);
    await newMethod.save();
    res.status(201).json(newMethod);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await PaymentMethod.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
