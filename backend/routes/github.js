const express = require('express');
const router = express.Router();
const { evaluateProfile } = require('../services/githubService');
const Report = require('../models/Report');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/evaluate', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const cached = await Report.findOne({
      username: username.toLowerCase(),
      expiresAt: { $gt: new Date() }
    });
    if (cached) {
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
          totalStars: cached.totalStars,
          totalForks: cached.totalForks,
          location: cached.location,
          blog: cached.blog,
          email: cached.email
        },
        events: cached.events || [],
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
        location: data.profile.location,
        blog: data.profile.blog,
        email: data.profile.email,
        scores: data.scores,
        topRepos: data.profile.topRepos,
        languages: data.profile.languages,
        languageDistribution: data.profile.languageDistribution,
        totalStars: data.profile.totalStars,
        totalForks: data.profile.totalForks,
        events: data.events,
        cachedAt: new Date(),
        expiresAt
      },
      { upsert: true, new: true }
    );

    res.json({ shareId, scores: data.scores, profile: data.profile, events: data.events });
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ error: 'GitHub user not found' });
    res.status(500).json({ error: error.message });
  }
});

router.post('/insights', async (req, res) => {
  try {
    const { profile, scores, mode } = req.body;

    const prompt = mode === 'roast'
      ? `You are a funny but kind tech roaster. Roast this GitHub profile in 3-4 sentences. Be witty and humorous but not mean. 
         Profile: ${profile.username}, Bio: ${profile.bio || 'none'}, Repos: ${profile.publicRepos}, Stars: ${profile.totalStars}, 
         Languages: ${Object.keys(profile.languages || {}).join(', ')}, Overall score: ${scores.overall}/100.
         Keep it fun and end with one genuine compliment.`
      : `You are a senior software engineer giving career advice. Give 4 specific, actionable tips to improve this GitHub profile for job hunting.
         Profile: ${profile.username}, Bio: ${profile.bio || 'none'}, Repos: ${profile.publicRepos}, Stars: ${profile.totalStars},
         Languages: ${Object.keys(profile.languages || {}).join(', ')}, 
         Scores: Activity ${scores.activity}, Code Quality ${scores.codeQuality}, Diversity ${scores.diversity}, Community ${scores.community}, Hiring ${scores.hiringReady}.
         Format as numbered list. Be specific and practical.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ insights: message.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const reports = await Report.find({})
      .sort({ 'scores.overall': -1 })
      .limit(20)
      .select('username name avatarUrl scores shareId')
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/report/:shareId', async (req, res) => {
  try {
    const report = await Report.findOne({ shareId: req.params.shareId });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;