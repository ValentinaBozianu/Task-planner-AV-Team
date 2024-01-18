// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'PENDING', 'COMPLETED', 'CLOSED'], default: 'OPEN' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);

