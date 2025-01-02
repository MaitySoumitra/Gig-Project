const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gig_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  addons: [{
    addon_name: { type: String },
    addon_price: { type: Number }
  }],
  status: { type: String, default: 'in-progress' },
  milestones: [{
    milestone_name: { type: String },
    due_date: { type: Date },
    completion_status: { type: String, default: 'pending' }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
