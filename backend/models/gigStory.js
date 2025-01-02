const mongoose = require('mongoose');
const { Schema } = mongoose;

// Reference to the 'Member' model for assignedBy
const GigStorySchema = new Schema({
  title: String,
  description: String,
  status: String,
  startDate: String,
  endDate: String,
  designation: String,
  attachment: String,
  createdBy: String, 
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true }, // Reference to 'Member' model
});

const columnSchema = new mongoose.Schema({
  title: String,
  tasks: [GigStorySchema],
});

module.exports  = mongoose.model('GigStory', columnSchema);
