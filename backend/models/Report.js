const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  shareId: { type: String, required: true, unique: true },
  avatarUrl: String,
  name: String,
  bio: String,
  followers: Number,
  publicRepos: Number,
  location: String,
  blog: String,
  email: String,
  totalStars: Number,
  totalForks: Number,
  scores: {
    activity: Number,
    codeQuality: Number,
    diversity: Number,
    community: Number,
    hiringReady: Number,
    overall: Number
  },
  topRepos: [{
    name: String,
    stars: Number,
    forks: Number,
    language: String,
    description: String,
    url: String
  }],
  languages: { type: mongoose.Schema.Types.Mixed },
  languageDistribution: [{ name: String, percent: Number }],
  events: { type: mongoose.Schema.Types.Mixed },
  cachedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);