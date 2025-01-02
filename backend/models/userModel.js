const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  last_login_at: { type: Date },
  is_dashboard_open: { type: Boolean, default: false },  
  current_session_token: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model('newUser', userSchema);
