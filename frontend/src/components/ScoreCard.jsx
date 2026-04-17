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

function CircularProgress({ score }) {
  const radius = 54
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const progress = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return '#34d399'
    if (s >= 50) return '#6366f1'
    if (s >= 25) return '#fb923c'
    return '#f87171'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 12px' }}>Overall Score</p>
      <svg width={radius * 2} height={radius * 2}>
        {/* Background ring */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#0f172a"
          strokeWidth={stroke}
        />
        {/* Progress ring */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f1f5f9"
          fontSize="22"
          fontWeight="800"
        >
          {score}
        </text>
      </svg>
    </div>
  )
}

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
      {/* Circular Progress Ring */}
      <CircularProgress score={scores.overall || 0} />

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