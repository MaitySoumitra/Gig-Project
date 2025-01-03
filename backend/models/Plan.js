const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true }, 
  description: { type: String, required: true }
});

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true }, 
  description: { type: String, required: true },
  features: { type: [String], required: true },
  addon: { type: [addonSchema], required: false } 
});

module.exports  = mongoose.model('Plan', planSchema);


