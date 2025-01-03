const express = require('express');
const Task = require('../models/Task');

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post('/', async (req, res) => {
    const { name, start, end, progress = 0, steps = [], styles = {} } = req.body;
    if (!name || !start || !end) {
      return res.status(400).json({ error: 'Name, start, and end are required fields.' });
    }
  
    try {
      const newTask = new Task({
        name,
        start: new Date(start), 
        end: new Date(end),
        progress,
        steps,
        styles,
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
router.put('/:id', async (req, res) => {
    const { progress } = req.body;
    if (progress < 0 || progress > 100 || isNaN(progress)) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 100' });
    }
  
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, { progress }, { new: true });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      console.error(err); 
      res.status(500).send({ message: 'Server error while updating task' });
    }
  });
  
module.exports = router;
