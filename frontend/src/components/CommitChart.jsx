import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

function CommitChart({ events }) {
  if (!events || events.length === 0) return null

  const last30 = {}
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    last30[key] = 0
  }

  events
    .filter(e => e.type === 'PushEvent')
    .forEach(e => {
      const day = e.created_at?.split('T')[0]
      if (day && last30[day] !== undefined) {
        last30[day] += e.payload?.commits?.length || 1
      }
    })

  const labels = Object.keys(last30).map(d => {
    const date = new Date(d)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  const data = Object.values(last30)

  const chartData = {
    labels,
    datasets: [{
      label: 'Commits',
      data,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#6366f1',
      tension: 0.4,
      fill: true
    }]
  }

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#64748b', maxTicksLimit: 10, font: { size: 10 } },
        grid: { color: '#1e293b' }
      },
      y: {
        ticks: { color: '#64748b', stepSize: 1 },
        grid: { color: '#1e293b' },
        beginAtZero: true
      }
    }
  }

  const total = data.reduce((a, b) => a + b, 0)
  const peak = Math.max(...data)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Commit Activity (Last 30 Days)</h3>
        <div style={styles.stats}>
          <span style={styles.stat}><span style={styles.statVal}>{total}</span> commits</span>
          <span style={styles.stat}><span style={styles.statVal}>{peak}</span> peak/day</span>
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: 0 },
  stats: { display: 'flex', gap: '16px' },
  stat: { color: '#64748b', fontSize: '0.82rem' },
  statVal: { color: '#6366f1', fontWeight: '700' }
}

export default CommitChart