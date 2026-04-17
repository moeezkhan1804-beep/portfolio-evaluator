const Report = require('../models/Report');

const checkCache = async (req, res, next) => {
  try {
    const username = req.body.username || req.params.username;
    if (!username) return next();
    const cached = await Report.findOne({
      username: username.toLowerCase(),
      expiresAt: { $gt: new Date() }
    });
    if (cached) req.cachedReport = cached;
    next();
  } catch (error) {
    next();
  }
};

module.exports = { checkCache };