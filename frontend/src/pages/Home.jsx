import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SearchBar from '../components/SearchBar'

function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async (username) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/github/evaluate', { username })
      navigate(`/report/${res.data.shareId}`, { state: res.data })
    } catch (err) {
      setError('GitHub user not found. Please check the username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Developer Portfolio Evaluator</h1>
      <p style={styles.subtitle}>Enter a GitHub username to get a detailed score card</p>
      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '20px' },
  title: { color: '#f1f5f9', fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px', textAlign: 'center' },
  subtitle: { color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', textAlign: 'center' },
  error: { color: '#f87171', marginTop: '20px' }
}

export default Home