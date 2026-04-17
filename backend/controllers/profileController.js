const { evaluateProfile } = require('../services/githubService');
const Report = require('../models/Report');
const { v4: uuidv4 } = require('uuid');

const evaluate = async (req, res) => {
  try {
    const username = req.body.username || req.params.username;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    if (req.cachedReport) {
      const cached = req.cachedReport;
      return res.json({
        shareId: cached.shareId,
        scores: cached.scores,
        profile: {
          name: cached.name,
          username: cached.username,
          avatar: cached.avatarUrl,
          bio: cached.bio,
          followers: cached.followers,
          publicRepos: cached.publicRepos,
          languages: cached.languages,
          languageDistribution: cached.languageDistribution,
          topRepos: cached.topRepos,
          heatmapData: cached.heatmapData
        },
        fromCache: true
      });
    }

    const data = await evaluateProfile(username);
    const shareId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Report.findOneAndUpdate(
      { username: username.toLowerCase() },
      {
        username: username.toLowerCase(),
        shareId,
        name: data.profile.name,
        avatarUrl: data.profile.avatar,
        bio: data.profile.bio,
        followers: data.profile.followers,
        publicRepos: data.profile.publicRepos,
        scores: data.scores,
        topRepos: data.profile.topRepos,
        languages: data.profile.languages,
        languageDistribution: data.profile.languageDistribution,
        heatmapData: data.profile.heatmapData,
        cachedAt: new Date(),
        expiresAt
      },
      { upsert: true, new: true }
    );

    res.json({ shareId, scores: data.scores, profile: data.profile });
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ error: 'GitHub user not found' });
    res.status(500).json({ error: error.message });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ shareId: req.params.shareId });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCached = async (req, res) => {
  try {
    const { username } = req.params;
    const cached = await Report.findOne({
      username: username.toLowerCase(),
      expiresAt: { $gt: new Date() }
    });
    if (!cached) return res.status(404).json({ error: 'No cached report found' });
    res.json({
      shareId: cached.shareId,
      scores: cached.scores,
      profile: {
        name: cached.name,
        username: cached.username,
        avatar: cached.avatarUrl,
        bio: cached.bio,
        followers: cached.followers,
        publicRepos: cached.publicRepos,
        languages: cached.languages,
        languageDistribution: cached.languageDistribution,
        topRepos: cached.topRepos,
        heatmapData: cached.heatmapData
      },
      fromCache: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const compareProfiles = async (req, res) => {
  try {
    const { u1, u2 } = req.query;
    if (!u1 || !u2) return res.status(400).json({ error: 'Two usernames required: u1 and u2' });

    const [data1, data2] = await Promise.all([
      evaluateProfile(u1),
      evaluateProfile(u2)
    ]);

    res.json({
      user1: { username: u1, scores: data1.scores, profile: data1.profile },
      user2: { username: u2, scores: data2.scores, profile: data2.profile }
    });
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ error: 'GitHub user not found' });
    res.status(500).json({ error: error.message });
  }
};

const healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

module.exports = { evaluate, getReport, getCached, compareProfiles, healthCheck };