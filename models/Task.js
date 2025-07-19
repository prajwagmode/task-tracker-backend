const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
  type: String,
  enum: ['To Do', 'In Progress', 'Done'],
  default: 'To Do'
},
  dueDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
