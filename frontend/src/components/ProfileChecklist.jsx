function ProfileChecklist({ profile }) {
  if (!profile) return null

  const checks = [
    { label: 'Profile photo set',       done: !!profile.avatar,      tip: 'Add a profile picture to look professional' },
    { label: 'Bio filled in',           done: !!profile.bio,         tip: 'Add a bio describing what you do' },
    { label: 'Location added',          done: !!profile.location,    tip: 'Add your city or country' },
    { label: 'Website/portfolio link',  done: !!profile.blog,        tip: 'Link your portfolio or LinkedIn' },
    { label: 'Public email set',        done: !!profile.email,       tip: 'Add a public email for recruiters' },
    { label: 'Has public repos',        done: (profile.publicRepos || 0) > 0,   tip: 'Create and publish your projects' },
    { label: '5+ public repos',         done: (profile.publicRepos || 0) >= 5,  tip: 'Aim for at least 5 public projects' },
    { label: 'Uses multiple languages', done: Object.keys(profile.languages || {}).length >= 2, tip: 'Learn more than one language' },
    { label: 'Has followers',           done: (profile.followers || 0) > 0,     tip: 'Engage with the community to get followers' },
    { label: '10+ followers',           done: (profile.followers || 0) >= 10,   tip: 'Build your network on GitHub' },
  ]

  const completed = checks.filter(c => c.done).length
  const pct = Math.round((completed / checks.length) * 100)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Profile Completion</h3>
        <span style={{ ...styles.pct, color: pct >= 80 ? '#34d399' : pct >= 50 ? '#fb923c' : '#f87171' }}>
          {pct}%
        </span>
      </div>
      <div style={styles.barBg}>
        <div style={{
          ...styles.barFill,
          width: `${pct}%`,
          background: pct >= 80 ? '#34d399' : pct >= 50 ? '#fb923c' : '#f87171'
        }} />
      </div>
      <div style={styles.list}>
        {checks.map((c, i) => (
          <div key={i} style={styles.item}>
            <span style={{ ...styles.icon, color: c.done ? '#34d399' : '#f87171' }}>
              {c.done ? '✅' : '❌'}
            </span>
            <div style={styles.itemInfo}>
              <span style={{ ...styles.label, color: c.done ? '#f1f5f9' : '#94a3b8', textDecoration: c.done ? 'none' : 'none' }}>
                {c.label}
              </span>
              {!c.done && <span style={styles.tip}>{c.tip}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: 0 },
  pct: { fontSize: '1.8rem', fontWeight: '800' },
  barBg: { background: '#0f172a', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '20px' },
  barFill: { height: '100%', borderRadius: '999px', transition: 'width 1s ease' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  icon: { fontSize: '1rem', flexShrink: 0, marginTop: '2px' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  label: { fontSize: '0.9rem' },
  tip: { fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }
}

export default ProfileChecklist