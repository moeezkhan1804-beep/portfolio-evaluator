import { useState } from 'react'

function SearchBar({ onSearch, loading }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) onSearch(username.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        type="text"
        placeholder="Enter GitHub username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button style={styles.button} type="submit" disabled={loading}>
        {loading ? 'Evaluating...' : 'Evaluate'}
      </button>
    </form>
  )
}

const styles = {
  form: { display: 'flex', gap: '12px', width: '100%', maxWidth: '500px' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: '1rem', outline: 'none' },
  button: { padding: '14px 28px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }
}

export default SearchBar