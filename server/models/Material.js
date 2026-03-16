const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  googleDriveLink: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['PDF', 'DOC', 'SPREADSHEET', 'VIDEO', 'FOLDER'],
    required: true,
  },
  instructor: {
    type: String,
    default: 'General',
    trim: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', materialSchema);
