const express = require('express');
const router = express.Router();
const { evaluateProfile } = require('../services/githubService');
const Report = require('../models/Report');
const { v4: uuidv4 } = require('uuid');

router.post('/evaluate', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const data = await evaluateProfile(username);
    const shareId = uuidv4();

    const report = await Report.create({
      username,
      shareId,
      scores: data.scores,
      data: data.profile
    });

    res.json({ shareId, scores: data.scores, profile: data.profile });
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