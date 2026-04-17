const express = require('express');
const router = express.Router();
const { evaluate, getReport, getCached, compareProfiles, healthCheck } = require('../controllers/profileController');
const { checkCache } = require('../middleware/cacheMiddleware');

router.post('/evaluate', checkCache, evaluate);
router.get('/report/:shareId', getReport);
router.get('/profile/:username', checkCache, evaluate);
router.get('/profile/:username/cached', getCached);
router.get('/compare', compareProfiles);
router.get('/health', healthCheck);

module.exports = router;