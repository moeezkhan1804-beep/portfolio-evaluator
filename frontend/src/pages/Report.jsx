import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getReport } from '../utils/api'
import ScoreCard from '../components/ScoreCard'
import ProfileCard from '../components/ProfileCard'
import Badges from '../components/Badges'
import DownloadPDF from '../components/DownloadPDF'
import Skeleton from '../components/Skeleton'

function Report() {
  const { shareId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState(location.state || null)
  const [loading, setLoading] = useState(!location.state)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!data) {
      getReport(shareId)
        .then(res => setData({ scores: res.data.scores, profile: res.data.data }))
        .catch(() => setLoading(false))
        .finally(() => setLoading(false))
    }
  }, [])

  const shareUrl = `${window.location.origin}/report/${shareId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analysing profile...</h1>
      <Skeleton />
      <Skeleton />
    </div>
  )

  if (!data) return (
    <div style={styles.center}>
      <p style={styles.text}>Report not found.</p>
      <button style={styles.backBtn} onClick={() => navigate('/')}>Go Back</button>
    </div>
  )

  return (
    <div id="report-content" style={styles.container} className="fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>Portfolio Report</h1>
        {data.fromCache && <span style={styles.cacheBadge}>Cached Report</span>}
      </div>

      <ProfileCard profile={data.profile} />
      <Badges scores={data.scores} profile={data.profile} />
      <ScoreCard scores={data.scores} />

      <div style={styles.shareBox}>
        <p style={styles.shareLabel}>Shareable Link</p>
        <div style={styles.shareRow}>
          <input style={styles.shareInput} value={shareUrl} readOnly />
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✅ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div style={styles.actions}>
        <DownloadPDF username={data.profile?.username} />
        <button style={styles.compareBtn} onClick={() => navigate('/compare')}>
          ⚔️ Compare Profiles
        </button>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          Evaluate Another
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px' },
  title: { color: '#f1f5f9', fontSize: '2rem', fontWeight: '700', margin: 0 },
  cacheBadge: { background: '#1e293b', color: '#22d3ee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #22d3ee' },
  shareBox: { background: '#1e293b', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '600px' },
  shareLabel: { color: '#94a3b8', marginBottom: '10px', fontSize: '0.9rem' },
  shareRow: { display: 'flex', gap: '10px' },
  shareInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' },
  copyBtn: { padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  backBtn: { padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  compareBtn: { padding: '12px 24px', background: '#0f172a', color: '#f1f5f9', border: '1px solid #6366f1', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  center: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', gap: '20px' },
  text: { color: '#f1f5f9', fontSize: '1.1rem' }
}

export default Report