function Skeleton() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={{ ...styles.circle, ...styles.pulse }} />
        <div style={styles.lines}>
          <div style={{ ...styles.line, width: '60%', ...styles.pulse }} />
          <div style={{ ...styles.line, width: '40%', ...styles.pulse }} />
          <div style={{ ...styles.line, width: '80%', ...styles.pulse }} />
        </div>
      </div>
      <div style={{ ...styles.block, ...styles.pulse }} />
      <div style={{ ...styles.block, height: '200px', ...styles.pulse }} />
    </div>
  )
}

const styles = {
  wrapper: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' },
  circle: { width: '90px', height: '90px', borderRadius: '50%', flexShrink: 0 },
  lines: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  line: { height: '16px', borderRadius: '8px' },
  block: { background: '#1e293b', borderRadius: '16px', height: '120px' },
  pulse: {
    background: 'linear-gradient(90deg, #1e293b 25%, #2d3f55 50%, #1e293b 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  }
}

export default Skeleton