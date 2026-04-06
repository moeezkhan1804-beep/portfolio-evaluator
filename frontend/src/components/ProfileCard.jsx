function ProfileCard({ profile }) {
  if (!profile) return null
  return (
    <div style={styles.card}>
      <img src={profile.avatar} alt={profile.username} style={styles.avatar} />
      <div>
        <h2 style={styles.name}>{profile.name || profile.username}</h2>
        <p style={styles.username}>@{profile.username}</p>
        {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
        <div style={styles.stats}>
          <span style={styles.stat}>📦 {profile.publicRepos} Repos</span>
          <span style={styles.stat}>👥 {profile.followers} Followers</span>
          {profile.location && <span style={styles.stat}>📍 {profile.location}</span>}
          <span style={styles.stat}>⭐ {profile.totalStars} Stars</span>
        </div>
        <div style={styles.langs}>
          {Object.entries(profile.languages || {}).slice(0, 6).map(([lang, count]) => (
            <span key={lang} style={styles.langBadge}>{lang} ({count})</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { display: 'flex', gap: '24px', background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px', alignItems: 'flex-start' },
  avatar: { width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #6366f1' },
  name: { color: '#f1f5f9', fontSize: '1.4rem', fontWeight: '700', margin: '0 0 4px' },
  username: { color: '#6366f1', margin: '0 0 8px', fontSize: '0.95rem' },
  bio: { color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 12px' },
  stats: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' },
  stat: { color: '#cbd5e1', fontSize: '0.85rem', background: '#0f172a', padding: '4px 10px', borderRadius: '6px' },
  langs: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  langBadge: { background: '#312e81', color: '#a5b4fc', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem' }
}

export default ProfileCard