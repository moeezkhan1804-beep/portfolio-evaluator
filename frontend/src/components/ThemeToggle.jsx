import { useState, useEffect } from 'react'

function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setDark(false)
      document.body.classList.add('light')
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.body.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button style={styles.btn} onClick={toggle} title="Toggle theme">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

const styles = {
  btn: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    border: '1px solid #334155',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1e293b'
  }
}

export default ThemeToggle