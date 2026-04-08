import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateProfile } from '../utils/api'
import SearchBar from '../components/SearchBar'

function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async (username) => {
    setLoading(true)
    setError('')
    try {
      const res = await evaluateProfile(username)
      navigate(`/report/${res.data.shareId}`, { state: res.data })
    } catch (err) {
      if (err.response?.status === 404) {
        setError('GitHub user not found. Please check the username.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Developer Portfolio Evaluator</h1>
        <p style={styles.subtitle}>Enter any GitHub username and get a detailed score card covering activity, code quality, project diversity, community impact and hiring readiness.</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error && <p style={styles.error}>{error}</p>}
      </div>
      <div style={styles.cards}>
        {['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready'].map(c => (
          <div key={c} style={styles.featureCard}>
            <p style={styles.featureTitle}>{c}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '40px 20px' },
  hero: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' },
  title: { color: '#f1f5f9', fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' },
  subtitle: { color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', textAlign: 'center', maxWidth: '560px', lineHeight: '1.7' },
  error: { color: '#f87171', marginTop: '20px' },
  cards: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  featureCard: { background: '#1e293b', borderRadius: '10px', padding: '14px 24px', border: '1px solid #334155' },
  featureTitle: { color: '#6366f1', fontWeight: '600', margin: 0, fontSize: '0.9rem' }
}

export default Home