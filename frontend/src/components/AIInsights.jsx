import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AIInsights({ profile, scores }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('tips')

  const fetchInsights = async (selectedMode) => {
    setLoading(true)
    setMode(selectedMode)
    try {
      const res = await axios.post(`${API_URL}/github/insights`, {
        profile,
        scores,
        mode: selectedMode
      })
      setInsights(res.data.insights)
    } catch {
      setInsights('Could not generate insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>🤖 AI Insights</h3>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'tips' && !insights ? {} : {}), background: mode === 'tips' && insights ? '#6366f1' : '#0f172a' }}
            onClick={() => fetchInsights('tips')}
          >
            💡 Career Tips
          </button>
          <button
            style={{ ...styles.tab, background: mode === 'roast' && insights ? '#ef4444' : '#0f172a' }}
            onClick={() => fetchInsights('roast')}
          >
            🔥 Roast Me
          </button>
        </div>
      </div>

      {!insights && !loading && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>Get AI-powered career tips or a fun profile roast!</p>
        </div>
      )}

      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>
            {mode === 'roast' ? '🔥 Preparing your roast...' : '💡 Analysing your profile...'}
          </p>
        </div>
      )}

      {insights && !loading && (
        <div style={{ ...styles.insightBox, borderColor: mode === 'roast' ? '#ef4444' : '#6366f1' }}>
          <p style={styles.insightText}>{insights}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: 0 },
  tabs: { display: 'flex', gap: '8px' },
  tab: { padding: '8px 16px', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', color: '#f1f5f9', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' },
  empty: { textAlign: 'center', padding: '20px 0' },
  emptyText: { color: '#64748b', fontSize: '0.9rem' },
  loadingBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0' },
  spinner: { width: '24px', height: '24px', border: '3px solid #1e293b', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 },
  loadingText: { color: '#94a3b8', fontSize: '0.9rem' },
  insightBox: { background: '#0f172a', borderRadius: '10px', padding: '16px', border: '1px solid', marginTop: '4px' },
  insightText: { color: '#f1f5f9', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }
}

export default AIInsights