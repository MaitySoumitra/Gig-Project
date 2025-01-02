const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',  
  },
  sender: {
    type: String, 
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
