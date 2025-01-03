const mongoose = require('mongoose');
const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  addons: {
    type: [String],
    default: [],
  },
});

module.exports= mongoose.model('Gig', gigSchema);

