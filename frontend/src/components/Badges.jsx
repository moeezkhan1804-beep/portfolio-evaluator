const BADGES = [
  { id: 'polyglot',  icon: '🌐', label: 'Polyglot',      desc: '5+ languages',        check: (s, p) => Object.keys(p.languages || {}).length >= 5 },
  { id: 'popular',   icon: '⭐', label: 'Popular',        desc: '50+ total stars',     check: (s, p) => (p.totalStars || 0) >= 50 },
  { id: 'active',    icon: '🔥', label: 'Active Coder',   desc: 'Activity score 80+',  check: (s) => s.activity >= 80 },
  { id: 'hireable',  icon: '💼', label: 'Hire Me Ready',  desc: 'Hiring score 70+',    check: (s) => s.hiringReady >= 70 },
  { id: 'community', icon: '👥', label: 'Community Star', desc: 'Community score 70+', check: (s) => s.community >= 70 },
  { id: 'quality',   icon: '💎', label: 'Quality Code',   desc: 'Code quality 80+',    check: (s) => s.codeQuality >= 80 },
  { id: 'prolific',  icon: '📦', label: 'Prolific',       desc: '20+ public repos',    check: (s, p) => (p.publicRepos || 0) >= 20 },
  { id: 'diverse',   icon: '🎨', label: 'Diverse',        desc: 'Diversity score 60+', check: (s) => s.diversity >= 60 },
  { id: 'topscorer', icon: '🏆', label: 'Top Scorer',     desc: 'Overall score 80+',   check: (s) => s.overall >= 80 },
]

function Badges({ scores, profile }) {
  const earned = BADGES.filter(b => b.check(scores, profile))
  const locked = BADGES.filter(b => !b.check(scores, profile))

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        Achievements
        <span style={styles.count}>{earned.length}/{BADGES.length}</span>
      </h3>
      <div style={styles.grid}>
        {earned.map(b => (
          <div key={b.id} style={styles.badge}>
            <span style={styles.icon}>{b.icon}</span>
            <span style={styles.label}>{b.label}</span>
            <span style={styles.desc}>{b.desc}</span>
          </div>
        ))}
        {locked.map(b => (
          <div key={b.id} style={{ ...styles.badge, ...styles.locked }}>
            <span style={styles.icon}>🔒</span>
            <span style={styles.label}>{b.label}</span>
            <span style={styles.desc}>{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' },
  count: { background: '#6366f1', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  badge: { background: '#0f172a', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: '1px solid #334155' },
  locked: { opacity: 0.35, filter: 'grayscale(1)' },
  icon: { fontSize: '1.6rem' },
  label: { color: '#f1f5f9', fontSize: '0.78rem', fontWeight: '600', textAlign: 'center' },
  desc: { color: '#64748b', fontSize: '0.70rem', textAlign: 'center' }
}

export default Badges