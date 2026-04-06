function ScoreCard({ scores }) {
  if (!scores) return null

  const items = [
    { label: 'Activity', key: 'activity', color: '#22d3ee' },
    { label: 'Code Quality', key: 'codeQuality', color: '#a78bfa' },
    { label: 'Diversity', key: 'diversity', color: '#34d399' },
    { label: 'Hiring Readiness', key: 'hiringReadiness', color: '#fb923c' },
  ]

  return (
    <div style={styles.card}>
      <div style={styles.overall}>
        <p style={styles.overallLabel}>Overall Score</p>
        <p style={styles.overallScore}>{scores.overall}</p>
        <p style={styles.outOf}>/100</p>
      </div>
      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.key} style={styles.item}>
            <div style={styles.labelRow}>
              <span style={styles.label}>{item.label}</span>
              <span style={{ ...styles.score, color: item.color }}>{scores[item.key]}</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${scores[item.key]}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px', marginTop: '20px' },
  overall: { textAlign: 'center', marginBottom: '24px' },
  overallLabel: { color: '#94a3b8', fontSize: '0.9rem', margin: '0' },
  overallScore: { color: '#f1f5f9', fontSize: '4rem', fontWeight: '800', margin: '0', lineHeight: '1' },
  outOf: { color: '#475569', fontSize: '1rem', margin: '0' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelRow: { display: 'flex', justifyContent: 'space-between' },
  label: { color: '#cbd5e1', fontSize: '0.9rem' },
  score: { fontWeight: '700', fontSize: '0.9rem' },
  barBg: { background: '#0f172a', borderRadius: '999px', height: '8px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }
}

export default ScoreCard