const { Octokit } = require('@octokit/rest');
const { calculateScores } = require('./scoringService');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const evaluateProfile = async (username) => {
  const [userRes, reposRes, eventsRes] = await Promise.all([
    octokit.users.getByUsername({ username }),
    octokit.repos.listForUser({ username, per_page: 100, sort: 'updated' }),
    octokit.activity.listPublicEventsForUser({ username, per_page: 100 })
  ]);

  const user = userRes.data;
  const repos = reposRes.data;
  const events = eventsRes.data;

  const languages = {};
  let totalStars = 0;
  let totalForks = 0;
  let reposWithReadme = 0;
  let reposWithLicense = 0;
  let reposWithTopics = 0;

  for (const repo of repos) {
    if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.description) reposWithReadme++;
    if (repo.license) reposWithLicense++;
    if (repo.topics && repo.topics.length > 0) reposWithTopics++;
  }

  // Heatmap data
  const now = new Date();
  const days365 = new Date(now - 365 * 24 * 60 * 60 * 1000);
  const heatmapMap = {};
  events.forEach(e => {
    if (new Date(e.created_at) > days365) {
      const day = e.created_at.slice(0, 10);
      heatmapMap[day] = (heatmapMap[day] || 0) + 1;
    }
  });
  const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

  // Top repos
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map(r => ({
      name: r.name,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      description: r.description,
      url: r.html_url
    }));

  // Language distribution
  const totalLangCount = Object.values(languages).reduce((a, b) => a + b, 0);
  const languageDistribution = Object.entries(languages).map(([name, count]) => ({
    name,
    percent: Math.round((count / totalLangCount) * 100)
  }));

  // Calculate scores via scoringService
  const scores = calculateScores({ user, repos, events, languages, totalStars, totalForks, reposWithReadme, reposWithLicense, reposWithTopics });

  return {
    scores,
    profile: {
      name: user.name,
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      location: user.location,
      blog: user.blog,
      email: user.email,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      joinedAt: user.created_at,
      languages,
      languageDistribution,
      totalStars,
      totalForks,
      topRepos,
      heatmapData
    }
  };
};

module.exports = { evaluateProfile };