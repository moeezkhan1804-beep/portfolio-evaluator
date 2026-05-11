import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateProfile } from '../utils/api'
import SearchBar from '../components/SearchBar'
import { showError, showLoading, dismissToast } from '../components/Toast'

function Home() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (username) => {
    setLoading(true)
    const toastId = showLoading(`Evaluating ${username}...`)
    try {
      const res = await evaluateProfile(username)
      dismissToast(toastId)
      navigate(`/report/${res.data.shareId}`, { state: res.data })
    } catch (err) {
      dismissToast(toastId)
      if (err.response?.status === 404) {
        showError('GitHub user not found. Check the username.')
      } else {
        showError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.badge}>🚀 Developer Portfolio Evaluator</div>
        <h1 style={styles.title}>Evaluate Any GitHub Profile</h1>
        <p style={styles.subtitle}>
          Get a detailed score card covering activity, code quality, project diversity,
          community impact and hiring readiness — all in seconds.
        </p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>
      <div style={styles.cards}>
        {[
          { icon: '⚡', label: 'Activity', desc: 'Commit frequency & streaks' },
          { icon: '💎', label: 'Code Quality', desc: 'READMEs, licenses, topics' },
          { icon: '🎨', label: 'Diversity', desc: 'Languages & project variety' },
          { icon: '👥', label: 'Community', desc: 'Stars, forks & followers' },
          { icon: '💼', label: 'Hiring Ready', desc: 'Profile completeness' },
        ].map(c => (
          <div key={c.label} style={styles.featureCard}>
            <span style={styles.featureIcon}>{c.icon}</span>
            <p style={styles.featureTitle}>{c.label}</p>
            <p style={styles.featureDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '40px 20px', gap: '60px' },
  hero: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  badge: { background: '#1e293b', color: '#6366f1', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #334155' },
  title: { color: '#f1f5f9', fontSize: '3rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.2, maxWidth: '600px' },
  subtitle: { color: '#94a3b8', fontSize: '1.1rem', textAlign: 'center', maxWidth: '520px', lineHeight: 1.7 },
  cards: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' },
  featureCard: { background: '#1e293b', borderRadius: '14px', padding: '20px', border: '1px solid #334155', width: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  featureIcon: { fontSize: '1.8rem' },
  featureTitle: { color: '#f1f5f9', fontWeight: '600', fontSize: '0.85rem', margin: 0, textAlign: 'center' },
  featureDesc: { color: '#64748b', fontSize: '0.72rem', margin: 0, textAlign: 'center', lineHeight: 1.4 }
}

export default Home