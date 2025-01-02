const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
  dependencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',  
    },
  ],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started',
  },
  priority: {
    type: Number,  
    default: 3,
  },
  progress: {
    type: Number,  
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
  },
  permissions: {
    canEdit: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
      },
    ],
    canView: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);


