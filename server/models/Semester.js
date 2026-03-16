const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    enum: ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'],
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Semester', semesterSchema);
