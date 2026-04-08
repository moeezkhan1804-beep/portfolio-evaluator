import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function ScoreCard({ scores }) {
  if (!scores) return null

  const items = [
    { label: 'Activity', key: 'activity', color: '#22d3ee' },
    { label: 'Code Quality', key: 'codeQuality', color: '#a78bfa' },
    { label: 'Diversity', key: 'diversity', color: '#34d399' },
    { label: 'Community', key: 'community', color: '#fb923c' },
    { label: 'Hiring Ready', key: 'hiringReady', color: '#f472b6' },
  ]

  const radarData = {
    labels: items.map(i => i.label),
    datasets: [{
      label: 'Score',
      data: items.map(i => scores[i.key] || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4
    }]
  }

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { color: '#94a3b8', stepSize: 20, backdropColor: 'transparent' },
        grid: { color: '#1e293b' },
        pointLabels: { color: '#cbd5e1', font: { size: 12 } }
      }
    },
    plugins: { legend: { display: false } }
  }

  return (
    <div style={styles.card}>
      {/* Overall Score */}
      <div style={styles.overall}>
        <p style={styles.overallLabel}>Overall Score</p>
        <p style={styles.overallScore}>{scores.overall}</p>
        <p style={styles.outOf}>/100</p>
      </div>

      {/* Radar Chart */}
      <div style={styles.chartBox}>
        <Radar data={radarData} options={radarOptions} />
      </div>

      {/* Score Bars */}
      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.key} style={styles.item}>
            <div style={styles.labelRow}>
              <span style={styles.label}>{item.label}</span>
              <span style={{ ...styles.score, color: item.color }}>{Math.round(scores[item.key] || 0)}</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${scores[item.key] || 0}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px', marginTop: '20px' },
  overall: { textAlign: 'center', marginBottom: '16px' },
  overallLabel: { color: '#94a3b8', fontSize: '0.9rem', margin: '0' },
  overallScore: { color: '#f1f5f9', fontSize: '4rem', fontWeight: '800', margin: '0', lineHeight: '1' },
  outOf: { color: '#475569', fontSize: '1rem', margin: '0' },
  chartBox: { width: '100%', maxWidth: '320px', margin: '0 auto 24px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelRow: { display: 'flex', justifyContent: 'space-between' },
  label: { color: '#cbd5e1', fontSize: '0.9rem' },
  score: { fontWeight: '700', fontSize: '0.9rem' },
  barBg: { background: '#0f172a', borderRadius: '999px', height: '8px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }
}

export default ScoreCard