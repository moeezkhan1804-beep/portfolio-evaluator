import { useState, useEffect } from 'react'

function SearchBar({ onSearch, loading }) {
  const [username, setUsername] = useState('')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setHistory(saved)
  }, [])

  const saveToHistory = (name) => {
    const updated = [name, ...history.filter(h => h !== name)].slice(0, 5)
    setHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      saveToHistory(username.trim())
      setShowHistory(false)
      onSearch(username.trim())
    }
  }

  const handleHistoryClick = (name) => {
    setUsername(name)
    setShowHistory(false)
    saveToHistory(name)
    onSearch(name)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('searchHistory')
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 150)}
          autoComplete="off"
        />
        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </form>
      {showHistory && history.length > 0 && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownLabel}>Recent searches</span>
            <button style={styles.clearBtn} onClick={clearHistory}>Clear</button>
          </div>
          {history.map(name => (
            <div
              key={name}
              style={styles.historyItem}
              onMouseDown={() => handleHistoryClick(name)}
            >
              <span style={styles.historyIcon}>🕐</span>
              <span style={styles.historyName}>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { position: 'relative', width: '100%', maxWidth: '500px' },
  form: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: '1rem', outline: 'none' },
  button: { padding: '14px 28px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', transition: 'opacity 0.2s' },
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
  dropdownHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #334155' },
  dropdownLabel: { color: '#64748b', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  clearBtn: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.82rem' },
  historyItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer' },
  historyIcon: { fontSize: '0.9rem' },
  historyName: { color: '#cbd5e1', fontSize: '0.95rem' }
}

export default SearchBar