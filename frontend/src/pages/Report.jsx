import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ScoreCard from '../components/ScoreCard'
import ProfileCard from '../components/ProfileCard'

function Report() {
  const { shareId } = useParams()
  const location = useLocation()
  const [data, setData] = useState(location.state || null)
  const [loading, setLoading] = useState(!location.state)

  useEffect(() => {
    if (!data) {
      axios.get(`http://localhost:5000/api/github/report/${shareId}`)
        .then(res => setData({ scores: res.data.scores, profile: res.data.data }))
        .catch(() => setLoading(false))
        .finally(() => setLoading(false))
    }
  }, [])

  const shareUrl = `${window.location.origin}/report/${shareId}`

  if (loading) return <div style={styles.center}><p style={styles.text}>Loading report...</p></div>
  if (!data) return <div style={styles.center}><p style={styles.text}>Report not found.</p></div>

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Portfolio Report</h1>
      <ProfileCard profile={data.profile} />
      <ScoreCard scores={data.scores} />
      <div style={styles.shareBox}>
        <p style={styles.shareLabel}>Shareable Link</p>
        <div style={styles.shareRow}>
          <input style={styles.shareInput} value={shareUrl} readOnly />
          <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
        </div>
      </div>
      <button style={styles.backBtn} onClick={() => window.location.href='/'}>Evaluate Another</button>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { color: '#f1f5f9', fontSize: '2rem', fontWeight: '700', marginBottom: '30px' },
  shareBox: { background: '#1e293b', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '600px', marginTop: '30px' },
  shareLabel: { color: '#94a3b8', marginBottom: '10px', fontSize: '0.9rem' },
  shareRow: { display: 'flex', gap: '10px' },
  shareInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' },
  copyBtn: { padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  backBtn: { marginTop: '20px', padding: '12px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  text: { color: '#f1f5f9' }
}

export default Report