import { useRef, useState } from 'react'

function ShareCard({ profile, scores }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true
      })
      const link = document.createElement('a')
      link.download = `${profile.username}-share-card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'S', color: '#fbbf24' }
    if (score >= 80) return { grade: 'A', color: '#34d399' }
    if (score >= 70) return { grade: 'B', color: '#6366f1' }
    if (score >= 60) return { grade: 'C', color: '#fb923c' }
    return { grade: 'D', color: '#f87171' }
  }

  const { grade, color } = getGrade(scores.overall)

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.sectionTitle}>Share Card</h3>
      <div ref={cardRef} style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.brand}>Developer Portfolio Evaluator</div>
          <div style={{ ...styles.grade, color, borderColor: color }}>{grade}</div>
        </div>
        <div style={styles.cardProfile}>
          <img src={profile.avatar} alt={profile.username} style={styles.avatar} crossOrigin="anonymous" />
          <div>
            <p style={styles.cardName}>{profile.name || profile.username}</p>
            <p style={styles.cardUsername}>@{profile.username}</p>
            {profile.bio && <p style={styles.cardBio}>{profile.bio?.slice(0, 80)}</p>}
          </div>
        </div>
        <div style={styles.scoreRow}>
          <div style={styles.overallBox}>
            <span style={{ ...styles.overallNum, color }}>{scores.overall}</span>
            <span style={styles.overallLabel}>Overall Score</span>
          </div>
          <div style={styles.miniScores}>
            {[
              { label: 'Activity', val: scores.activity, color: '#22d3ee' },
              { label: 'Quality', val: scores.codeQuality, color: '#a78bfa' },
              { label: 'Diversity', val: scores.diversity, color: '#34d399' },
              { label: 'Community', val: scores.community, color: '#fb923c' },
              { label: 'Hiring', val: scores.hiringReady, color: '#f472b6' },
            ].map(s => (
              <div key={s.label} style={styles.miniScore}>
                <div style={styles.miniBarBg}>
                  <div style={{ ...styles.miniBarFill, width: `${s.val || 0}%`, background: s.color }} />
                </div>
                <span style={{ ...styles.miniLabel, color: s.color }}>{Math.round(s.val || 0)}</span>
                <span style={styles.miniLabelText}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.cardFooter}>
          <span style={styles.footerText}>github.com/{profile.username}</span>
          <span style={styles.footerText}>portfolio-evaluator.vercel.app</span>
        </div>
      </div>
      <button
        style={{ ...styles.downloadBtn, opacity: downloading ? 0.7 : 1 }}
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? '⏳ Generating...' : '🖼️ Download Share Card'}
      </button>
    </div>
  )
}

const styles = {
  wrapper: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '12px' },
  sectionTitle: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: 0 },
  card: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: '16px', padding: '24px', border: '1px solid #334155', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  brand: { color: '#6366f1', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' },
  grade: { width: '44px', height: '44px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' },
  cardProfile: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #6366f1' },
  cardName: { color: '#f1f5f9', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 4px' },
  cardUsername: { color: '#6366f1', fontSize: '0.85rem', margin: '0 0 6px' },
  cardBio: { color: '#94a3b8', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 },
  scoreRow: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' },
  overallBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px 20px' },
  overallNum: { fontSize: '3rem', fontWeight: '800', lineHeight: 1 },
  overallLabel: { color: '#64748b', fontSize: '0.72rem', marginTop: '4px' },
  miniScores: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  miniScore: { display: 'flex', alignItems: 'center', gap: '8px' },
  miniBarBg: { flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: '999px' },
  miniLabel: { fontSize: '0.78rem', fontWeight: '700', minWidth: '28px', textAlign: 'right' },
  miniLabelText: { color: '#64748b', fontSize: '0.72rem', minWidth: '52px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '12px' },
  footerText: { color: '#475569', fontSize: '0.72rem' },
  downloadBtn: { padding: '12px 24px', background: '#1e293b', color: '#f1f5f9', border: '1px solid #6366f1', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', alignSelf: 'flex-start' }
}

export default ShareCard