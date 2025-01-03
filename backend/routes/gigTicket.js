const express = require("express");
const GigStory = require("../models/gigStory");  
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('./authMiddleware');
const Member=require('../models/Member');
const gigStory = require("../models/gigStory");

function authenticateUser2(req, res, next) {
  // Make sure req.user exists (i.e., the user is authenticated)
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  next();
}

router.get("/", async (req, res) => {
  try {
    // Find GigStories and populate assignedBy in the tasks array
    const columns = await GigStory.find()
      .populate({
        path: 'tasks.assignedBy',  // Populate the assignedBy field inside each task
        select: 'name email role'  // Select the fields you want to return
      });

    res.json(columns);  // Send the populated columns with tasks and their assignedBy details
  } catch (error) {
    console.error('Error fetching GigStories:', error.message);
    res.status(500).json({ message: error.message });
  }
});



router.post("/", async (req, res) => {
  const { title } = req.body;
  const newColumn = new GigStory({ title, tasks: [] });
  try {
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:columnId/tasks", async (req, res) => {
  const { columnId } = req.params;
  const { title, description, status, startDate, endDate, designation, attachment, assignedBy } = req.body;

  // Validate incoming data
  if (!title || !description || !assignedBy) {
      return res.status(400).json({ message: 'Title, description, and assignedBy are required.' });
  }

  // Ensure assignedBy is a valid ObjectId referring to a Member
  const member = await Member.findById(assignedBy);
  if (!member) {
      return res.status(400).json({ message: 'Invalid assignedBy ID.' });
  }

  // Create new task object
  const newTask = {
      title,
      description,
      status,
      startDate: new Date(startDate),  // Convert to Date object
      endDate: new Date(endDate),      // Convert to Date object
      designation,
      attachment,
      assignedBy: new mongoose.Types.ObjectId(assignedBy),  // Ensure assignedBy is a valid ObjectId
  };

  try {
      // Find the column where the task should be added
      const column = await GigStory.findById(columnId);
      if (!column) {
          return res.status(404).json({ message: 'Column not found.' });
      }

      // Add the new task to the column's tasks array
      column.tasks.push(newTask);

      // Save the updated column
      await column.save();

      // Return the new task in the response
      return res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

router.delete("/:columnId", async (req, res) => {
  const { columnId } = req.params;

  try {
    const deletedColumn = await GigStory.findByIdAndDelete(columnId);
    if (!deletedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:columnId/tasks/:taskId/status', async (req, res) => {
  const { columnId, taskId } = req.params;
  const { status } = req.body; // New status for the task

  try {
    // Find the current column where the task is located
    const column = await GigStory.findOne({ _id: columnId });

    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Find the task by ID within the column's tasks
    const task = column.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Save the previous status before updating
    const prevStatus = task.status;

    // Update the task's status
    task.status = status;

    // Save the column with updated task status
    await column.save();

    // Find the target column based on the new status
    const targetColumn = await GigStory.findOne({ title: status });

    if (!targetColumn) {
      return res.status(404).json({ message: 'Target column not found' });
    }

    // Remove the task from the current column and add it to the new column
    column.tasks.pull(taskId); // Remove from current column
    targetColumn.tasks.push(task); // Add to new column

    // Save both columns to persist the task movement
    await column.save();
    await targetColumn.save();

    // Optionally update the title of the target column (if needed)
    targetColumn.title = status;
    await targetColumn.save();

    // Fetch updated columns after successful operation
    const updatedColumns = await GigStory.find();
    res.status(200).json(updatedColumns); // Return the updated columns

  } catch (error) {
    console.error('Error updating task status and moving task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/roles", async (req, res) => {
  try {
    const members = await Member.distinct("role");  // Get distinct roles
    res.json(members);  // Send roles as a response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
