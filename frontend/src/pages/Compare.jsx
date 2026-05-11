import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateProfile } from '../utils/api'
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

function Compare() {
  const [u1, setU1] = useState('')
  const [u2, setU2] = useState('')
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!u1.trim() || !u2.trim()) return
    setLoading(true)
    setError('')
    setData1(null)
    setData2(null)
    try {
      const [r1, r2] = await Promise.all([
        evaluateProfile(u1.trim()),
        evaluateProfile(u2.trim())
      ])
      setData1(r1.data)
      setData2(r2.data)
    } catch {
      setError('One or both usernames not found. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['activity', 'codeQuality', 'diversity', 'community', 'hiringReady']
  const labels = ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready']

  const radarData = data1 && data2 ? {
    labels,
    datasets: [
      {
        label: data1.profile.username,
        data: categories.map(c => data1.scores[c] || 0),
        backgroundColor: 'rgba(99,102,241,0.2)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1'
      },
      {
        label: data2.profile.username,
        data: categories.map(c => data2.scores[c] || 0),
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        borderWidth: 2,
        pointBackgroundColor: '#22d3ee'
      }
    ]
  } : null

  const winner = (key) => {
    if (!data1 || !data2) return null
    return (data1.scores[key] || 0) >= (data2.scores[key] || 0) ? 'left' : 'right'
  }

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
      <h1 style={styles.title}>Compare Profiles</h1>
      <p style={styles.subtitle}>Enter two GitHub usernames to compare side by side</p>

      <form onSubmit={handleCompare} style={styles.form}>
        <input
          style={styles.input}
          placeholder="First GitHub username"
          value={u1}
          onChange={e => setU1(e.target.value)}
        />
        <span style={styles.vsLabel}>VS</span>
        <input
          style={styles.input}
          placeholder="Second GitHub username"
          value={u2}
          onChange={e => setU2(e.target.value)}
        />
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Fetching both profiles...</p>
        </div>
      )}

      {data1 && data2 && (
        <div style={styles.results} className="fade-in">

          {/* Profile headers */}
          <div style={styles.profilesRow}>
            <div style={styles.profileCard}>
              <img src={data1.profile.avatar} style={styles.avatar} alt={data1.profile.username} />
              <p style={styles.profileName}>{data1.profile.username}</p>
              <p style={styles.overallScore}>{data1.scores.overall}</p>
              <p style={styles.overallLabel}>Overall</p>
            </div>
            <div style={styles.vsCircle}><span style={styles.vsCircleText}>VS</span></div>
            <div style={styles.profileCard}>
              <img src={data2.profile.avatar} style={styles.avatar} alt={data2.profile.username} />
              <p style={styles.profileName}>{data2.profile.username}</p>
              <p style={styles.overallScore}>{data2.scores.overall}</p>
              <p style={styles.overallLabel}>Overall</p>
            </div>
          </div>

          {/* Radar chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Score Comparison</h3>
            <Radar
              data={radarData}
              options={{
                scales: {
                  r: {
                    min: 0, max: 100,
                    ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 20 },
                    grid: { color: '#334155' },
                    pointLabels: { color: '#cbd5e1', font: { size: 12 } }
                  }
                },
                plugins: {
                  legend: { labels: { color: '#f1f5f9', padding: 20 } }
                }
              }}
            />
          </div>

          {/* Category by category */}
          <div style={styles.categoryCard}>
            <h3 style={styles.chartTitle}>Category Breakdown</h3>
            {labels.map((label, i) => {
              const key = categories[i]
              const s1 = Math.round(data1.scores[key] || 0)
              const s2 = Math.round(data2.scores[key] || 0)
              const w = winner(key)
              return (
                <div key={key} style={styles.categoryRow}>
                  <span style={{ ...styles.scoreLeft, color: w === 'left' ? '#6366f1' : '#64748b', fontWeight: w === 'left' ? '700' : '400' }}>
                    {s1} {w === 'left' && '🏆'}
                  </span>
                  <div style={styles.categoryMid}>
                    <span style={styles.categoryLabel}>{label}</span>
                    <div style={styles.barsWrap}>
                      <div style={{ ...styles.barLeft, width: `${s1}%` }} />
                      <div style={{ ...styles.barRight, width: `${s2}%` }} />
                    </div>
                  </div>
                  <span style={{ ...styles.scoreRight, color: w === 'right' ? '#22d3ee' : '#64748b', fontWeight: w === 'right' ? '700' : '400' }}>
                    {w === 'right' && '🏆'} {s2}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Winner banner */}
          <div style={styles.winnerBanner}>
            🏆 Overall Winner:
            <span style={styles.winnerName}>
              {data1.scores.overall >= data2.scores.overall
                ? data1.profile.username
                : data2.profile.username}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  backBtn: { alignSelf: 'flex-start', background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  title: { color: '#f1f5f9', fontSize: '2rem', fontWeight: '700', margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '1rem', margin: 0 },
  form: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '700px' },
  input: { flex: 1, minWidth: '180px', padding: '14px 18px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: '1rem', outline: 'none' },
  vsLabel: { color: '#6366f1', fontWeight: '800', fontSize: '1.1rem' },
  btn: { padding: '14px 28px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  error: { color: '#f87171' },
  loadingBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #1e293b', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { color: '#94a3b8' },
  results: { width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '20px' },
  profilesRow: { display: 'flex', alignItems: 'center', gap: '16px', background: '#1e293b', borderRadius: '16px', padding: '24px' },
  profileCard: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #6366f1' },
  profileName: { color: '#f1f5f9', fontWeight: '600', margin: 0, fontSize: '0.95rem' },
  overallScore: { color: '#6366f1', fontSize: '2.4rem', fontWeight: '800', margin: 0, lineHeight: 1 },
  overallLabel: { color: '#64748b', fontSize: '0.78rem', margin: 0 },
  vsCircle: { background: '#0f172a', borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  vsCircleText: { color: '#64748b', fontWeight: '800', fontSize: '0.9rem' },
  chartCard: { background: '#1e293b', borderRadius: '16px', padding: '24px' },
  chartTitle: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: '0 0 16px' },
  categoryCard: { background: '#1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  categoryRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  scoreLeft: { width: '52px', textAlign: 'right', fontSize: '0.9rem' },
  scoreRight: { width: '52px', textAlign: 'left', fontSize: '0.9rem' },
  categoryMid: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  categoryLabel: { color: '#94a3b8', fontSize: '0.78rem', textAlign: 'center' },
  barsWrap: { display: 'flex', flexDirection: 'column', gap: '3px' },
  barLeft: { height: '6px', background: '#6366f1', borderRadius: '999px', transition: 'width 0.6s ease' },
  barRight: { height: '6px', background: '#22d3ee', borderRadius: '999px', transition: 'width 0.6s ease' },
  winnerBanner: { background: '#1e293b', borderRadius: '12px', padding: '16px 24px', color: '#94a3b8', fontSize: '1rem', textAlign: 'center', border: '1px solid #6366f1' },
  winnerName: { color: '#6366f1', fontWeight: '700', marginLeft: '8px', fontSize: '1.1rem' }
}

export default Compare