const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

const evaluateProfile = async (username) => {
  const [userRes, reposRes] = await Promise.all([
    axios.get(`${GITHUB_API}/users/${username}`, { headers }),
    axios.get(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, { headers })
  ]);

  const user = userRes.data;
  const repos = reposRes.data;

  const languages = {};
  let totalStars = 0;
  let hasReadme = 0;

  for (const repo of repos) {
    if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    totalStars += repo.stargazers_count;
    if (repo.description) hasReadme++;
  }

  const uniqueLangs = Object.keys(languages).length;
  const activityScore = Math.min(100, (user.public_repos * 3) + (user.followers * 2));
  const codeQualityScore = Math.min(100, (totalStars * 5) + (hasReadme * 2));
  const diversityScore = Math.min(100, uniqueLangs * 15);
  const hiringReadiness = Math.min(100,
    (user.bio ? 20 : 0) +
    (user.location ? 10 : 0) +
    (user.blog ? 15 : 0) +
    (user.public_repos > 5 ? 20 : 0) +
    (uniqueLangs > 2 ? 20 : 0) +
    (user.followers > 5 ? 15 : 0)
  );

  const overall = Math.round((activityScore + codeQualityScore + diversityScore + hiringReadiness) / 4);

  return {
    scores: { activity: activityScore, codeQuality: codeQualityScore, diversity: diversityScore, hiringReadiness, overall },
    profile: {
      name: user.name,
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      location: user.location,
      blog: user.blog,
      followers: user.followers,
      publicRepos: user.public_repos,
      languages,
      totalStars
    }
  };
};

module.exports = { evaluateProfile };