const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true },
  shareId: { type: String, required: true, unique: true },
  scores: {
    activity: { type: Number },
    codeQuality: { type: Number },
    diversity: { type: Number },
    hiringReadiness: { type: Number },
    overall: { type: Number }
  },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);