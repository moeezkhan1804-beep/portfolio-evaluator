import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Leaderboard() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/github/leaderboard`)
      .then(res => setProfiles(res.data))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false))
  }, [])

  const getMedal = (i) => {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return `#${i + 1}`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#34d399'
    if (score >= 60) return '#fb923c'
    return '#f87171'
  }

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Leaderboard</h1>
        <p style={styles.subtitle}>Top evaluated GitHub profiles</p>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading leaderboard...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No profiles evaluated yet.</p>
          <button style={styles.evalBtn} onClick={() => navigate('/')}>Evaluate First Profile</button>
        </div>
      ) : (
        <div style={styles.list}>
          {profiles.map((p, i) => (
            <div
              key={p.username}
              style={{ ...styles.row, background: i < 3 ? '#1e293b' : '#161e2e', borderColor: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#334155' }}
              onClick={() => navigate(`/report/${p.shareId}`)}
            >
              <span style={{ ...styles.rank, color: i < 3 ? '#fbbf24' : '#64748b' }}>
                {getMedal(i)}
              </span>
              <img src={p.avatarUrl} alt={p.username} style={styles.avatar} />
              <div style={styles.info}>
                <p style={styles.name}>{p.name || p.username}</p>
                <p style={styles.username}>@{p.username}</p>
              </div>
              <div style={styles.scores}>
                <span style={{ ...styles.overall, color: getScoreColor(p.scores?.overall || 0) }}>
                  {p.scores?.overall || 0}
                </span>
                <span style={styles.overallLabel}>score</span>
              </div>
              <div style={styles.categories}>
                {['activity', 'codeQuality', 'diversity', 'community', 'hiringReady'].map(k => (
                  <div key={k} style={styles.catBar}>
                    <div style={{ ...styles.catFill, width: `${p.scores?.[k] || 0}%`, background: getScoreColor(p.scores?.[k] || 0) }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
  backBtn: { alignSelf: 'flex-start', background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  header: { textAlign: 'center' },
  title: { color: '#f1f5f9', fontSize: '2rem', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { color: '#64748b', margin: 0 },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #1e293b', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { color: '#94a3b8' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  emptyText: { color: '#94a3b8' },
  evalBtn: { padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  list: { width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', border: '1px solid', cursor: 'pointer', transition: 'transform 0.2s' },
  rank: { fontSize: '1.2rem', fontWeight: '700', minWidth: '36px', textAlign: 'center' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #334155', flexShrink: 0 },
  info: { flex: 1 },
  name: { color: '#f1f5f9', fontWeight: '600', margin: '0 0 2px', fontSize: '0.95rem' },
  username: { color: '#64748b', margin: 0, fontSize: '0.8rem' },
  scores: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  overall: { fontSize: '1.6rem', fontWeight: '800', lineHeight: 1 },
  overallLabel: { color: '#64748b', fontSize: '0.72rem' },
  categories: { display: 'flex', flexDirection: 'column', gap: '3px', width: '80px' },
  catBar: { background: '#0f172a', borderRadius: '999px', height: '4px', overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: '999px' }
}

export default Leaderboard