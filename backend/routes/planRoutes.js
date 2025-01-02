
const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
router.post('/', async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/:id/addon', async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const addon = { title, price, description };
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      { addon: addon }, 
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(200).json(updatedPlan); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
