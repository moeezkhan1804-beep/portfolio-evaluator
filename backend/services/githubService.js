const { Octokit } = require('@octokit/rest');

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

  // Languages
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

  // Activity Score — commits in last 90 days
  const now = new Date();
  const days90 = new Date(now - 90 * 24 * 60 * 60 * 1000);
  const recentCommits = events.filter(e =>
    e.type === 'PushEvent' && new Date(e.created_at) > days90
  ).length;
  const activityScore = Math.min(100, recentCommits * 4 + (user.public_repos * 2));

  // Code Quality Score
  const codeQualityScore = Math.min(100,
    (reposWithReadme * 2) + (reposWithLicense * 3) + (reposWithTopics * 2) + (totalStars * 2)
  );

  // Diversity Score
  const uniqueLangs = Object.keys(languages).length;
  const diversityScore = Math.min(100, uniqueLangs * 10 + repos.length * 2);

  // Community Impact Score
  const communityScore = Math.min(100,
    Math.log1p(totalStars) * 15 +
    Math.log1p(totalForks) * 10 +
    Math.log1p(user.followers) * 10
  );

  // Hiring Readiness Score
  const hiringReadiness = Math.min(100,
    (user.bio ? 20 : 0) +
    (user.blog ? 20 : 0) +
    (user.email ? 20 : 0) +
    (user.location ? 10 : 0) +
    (user.public_repos > 5 ? 15 : 0) +
    (uniqueLangs > 2 ? 15 : 0)
  );

  // Overall weighted score
  const overall = Math.round(
    activityScore * 0.25 +
    codeQualityScore * 0.20 +
    diversityScore * 0.20 +
    communityScore * 0.20 +
    hiringReadiness * 0.15
  );

  // Top 6 repos
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

  // Language distribution percentages
  const totalLangCount = Object.values(languages).reduce((a, b) => a + b, 0);
  const languageDistribution = Object.entries(languages).map(([name, count]) => ({
    name,
    percent: Math.round((count / totalLangCount) * 100)
  }));

  return {
    scores: { activity: activityScore, codeQuality: codeQualityScore, diversity: diversityScore, community: communityScore, hiringReady: hiringReadiness, overall },
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
      topRepos
    }
  };
};

module.exports = { evaluateProfile };