const calculateScores = ({ user, repos, events, languages, totalStars, totalForks, reposWithReadme, reposWithLicense, reposWithTopics }) => {
  const now = new Date();
  const days90 = new Date(now - 90 * 24 * 60 * 60 * 1000);

  const recentCommits = events.filter(e =>
    e.type === 'PushEvent' && new Date(e.created_at) > days90
  ).length;

  const uniqueLangs = Object.keys(languages).length;

  const activity = Math.min(100, recentCommits * 4 + (user.public_repos * 2));

  const codeQuality = Math.min(100,
    (reposWithReadme * 2) + (reposWithLicense * 3) + (reposWithTopics * 2) + (totalStars * 2)
  );

  const diversity = Math.min(100, uniqueLangs * 10 + repos.length * 2);

  const community = Math.min(100,
    Math.log1p(totalStars) * 15 +
    Math.log1p(totalForks) * 10 +
    Math.log1p(user.followers) * 10
  );

  const hiringReady = Math.min(100,
    (user.bio ? 20 : 0) +
    (user.blog ? 20 : 0) +
    (user.email ? 20 : 0) +
    (user.location ? 10 : 0) +
    (user.public_repos > 5 ? 15 : 0) +
    (uniqueLangs > 2 ? 15 : 0)
  );

  const overall = Math.round(
    activity * 0.25 +
    codeQuality * 0.20 +
    diversity * 0.20 +
    community * 0.20 +
    hiringReady * 0.15
  );

  return { activity, codeQuality, diversity, community, hiringReady, overall };
};

module.exports = { calculateScores };