import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function ProfileCard({ profile }) {
  if (!profile) return null

  const langData = {
    labels: (profile.languageDistribution || []).slice(0, 8).map(l => l.name),
    datasets: [{
      label: 'Usage %',
      data: (profile.languageDistribution || []).slice(0, 8).map(l => l.percent),
      backgroundColor: ['#6366f1','#22d3ee','#34d399','#fb923c','#f472b6','#a78bfa','#facc15','#f87171'],
      borderRadius: 6
    }]
  }

  const langOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' }, max: 100 }
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Profile Info */}
      <div style={styles.card}>
        <img src={profile.avatar} alt={profile.username} style={styles.avatar} />
        <div style={styles.info}>
          <h2 style={styles.name}>{profile.name || profile.username}</h2>
          <p style={styles.username}>@{profile.username}</p>
          {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
          <div style={styles.stats}>
            <span style={styles.stat}>📦 {profile.publicRepos} Repos</span>
            <span style={styles.stat}>👥 {profile.followers} Followers</span>
            {profile.location && <span style={styles.stat}>📍 {profile.location}</span>}
            <span style={styles.stat}>⭐ {profile.totalStars || 0} Stars</span>
            <span style={styles.stat}>🍴 {profile.totalForks || 0} Forks</span>
            {profile.blog && <a href={profile.blog} style={styles.stat} target="_blank" rel="noreferrer">🔗 Website</a>}
          </div>
        </div>
      </div>

      {/* Language Bar Chart */}
      {profile.languageDistribution && profile.languageDistribution.length > 0 && (
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Language Distribution</h3>
          <Bar data={langData} options={langOptions} />
        </div>
      )}

      {/* Top Repos */}
      {profile.topRepos && profile.topRepos.length > 0 && (
        <div style={styles.reposCard}>
          <h3 style={styles.chartTitle}>Top Repositories</h3>
          <div style={styles.repoGrid}>
            {profile.topRepos.map(repo => (
              <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" style={styles.repoCard}>
                <p style={styles.repoName}>{repo.name}</p>
                {repo.description && <p style={styles.repoDesc}>{repo.description.slice(0, 60)}...</p>}
                <div style={styles.repoStats}>
                  {repo.language && <span style={styles.langPill}>{repo.language}</span>}
                  <span style={styles.repoStat}>⭐ {repo.stars}</span>
                  <span style={styles.repoStat}>🍴 {repo.forks}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { display: 'flex', gap: '24px', background: '#1e293b', borderRadius: '16px', padding: '24px', alignItems: 'flex-start' },
  avatar: { width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #6366f1' },
  info: { flex: 1 },
  name: { color: '#f1f5f9', fontSize: '1.4rem', fontWeight: '700', margin: '0 0 4px' },
  username: { color: '#6366f1', margin: '0 0 8px', fontSize: '0.95rem' },
  bio: { color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 12px' },
  stats: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  stat: { color: '#cbd5e1', fontSize: '0.82rem', background: '#0f172a', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' },
  chartCard: { background: '#1e293b', borderRadius: '16px', padding: '24px' },
  chartTitle: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: '0 0 16px' },
  reposCard: { background: '#1e293b', borderRadius: '16px', padding: '24px' },
  repoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  repoCard: { background: '#0f172a', borderRadius: '10px', padding: '14px', textDecoration: 'none', display: 'block', border: '1px solid #1e293b' },
  repoName: { color: '#6366f1', fontWeight: '600', fontSize: '0.9rem', margin: '0 0 6px' },
  repoDesc: { color: '#94a3b8', fontSize: '0.78rem', margin: '0 0 10px' },
  repoStats: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  langPill: { background: '#312e81', color: '#a5b4fc', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem' },
  repoStat: { color: '#64748b', fontSize: '0.78rem' }
}

export default ProfileCard