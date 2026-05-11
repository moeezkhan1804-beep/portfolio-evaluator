const TECH_MAP = {
  JavaScript: { icon: '🟨', color: '#f7df1e', bg: '#1a1a00' },
  TypeScript: { icon: '🔷', color: '#3178c6', bg: '#001a33' },
  Python:     { icon: '🐍', color: '#3776ab', bg: '#001122' },
  Rust:       { icon: '🦀', color: '#ce4a00', bg: '#1a0a00' },
  Go:         { icon: '🐹', color: '#00add8', bg: '#001a1f' },
  Java:       { icon: '☕', color: '#ed8b00', bg: '#1a0e00' },
  'C++':      { icon: '⚙️', color: '#00599c', bg: '#001122' },
  C:          { icon: '🔧', color: '#555555', bg: '#111111' },
  Ruby:       { icon: '💎', color: '#cc342d', bg: '#1a0000' },
  PHP:        { icon: '🐘', color: '#777bb4', bg: '#0d0d1a' },
  Swift:      { icon: '🍎', color: '#fa7343', bg: '#1a0a00' },
  Kotlin:     { icon: '🎯', color: '#7f52ff', bg: '#0d001a' },
  Dart:       { icon: '🎯', color: '#0175c2', bg: '#001122' },
  HTML:       { icon: '🌐', color: '#e34f26', bg: '#1a0500' },
  CSS:        { icon: '🎨', color: '#1572b6', bg: '#001122' },
  Shell:      { icon: '💻', color: '#89e051', bg: '#0a1a00' },
  Vue:        { icon: '💚', color: '#4fc08d', bg: '#001a0d' },
  Svelte:     { icon: '🔥', color: '#ff3e00', bg: '#1a0500' },
  Dockerfile: { icon: '🐳', color: '#2496ed', bg: '#001122' },
  Jupyter:    { icon: '📓', color: '#f37626', bg: '#1a0a00' },
}

function TechStack({ languages }) {
  if (!languages || Object.keys(languages).length === 0) return null

  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tech Stack</h3>
      <div style={styles.grid}>
        {sorted.map(([lang, count]) => {
          const tech = TECH_MAP[lang] || { icon: '📄', color: '#94a3b8', bg: '#1e293b' }
          return (
            <div key={lang} style={{ ...styles.techCard, borderColor: tech.color + '44', background: tech.bg }}>
              <span style={styles.techIcon}>{tech.icon}</span>
              <div style={styles.techInfo}>
                <span style={{ ...styles.techName, color: tech.color }}>{lang}</span>
                <span style={styles.techCount}>{count} repo{count > 1 ? 's' : ''}</span>
              </div>
              <div style={{ ...styles.techDot, background: tech.color }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: '0 0 16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  techCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: '1px solid', transition: 'transform 0.2s', cursor: 'default' },
  techIcon: { fontSize: '1.4rem', flexShrink: 0 },
  techInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  techName: { fontSize: '0.88rem', fontWeight: '600' },
  techCount: { fontSize: '0.72rem', color: '#64748b' },
  techDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 }
}

export default TechStack