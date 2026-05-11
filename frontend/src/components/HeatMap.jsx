function HeatMap({ events }) {
  if (!events || events.length === 0) return null

  const weeks = 26
  const days = weeks * 7
  const grid = {}

  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    grid[key] = 0
  }

  events
    .filter(e => e.type === 'PushEvent')
    .forEach(e => {
      const day = e.created_at?.split('T')[0]
      if (day && grid[day] !== undefined) {
        grid[day] += e.payload?.commits?.length || 1
      }
    })

  const cells = Object.entries(grid)
  const maxVal = Math.max(...Object.values(grid), 1)

  const getColor = (val) => {
    if (val === 0) return '#0f172a'
    const intensity = val / maxVal
    if (intensity < 0.25) return '#1e3a5f'
    if (intensity < 0.5) return '#1d4ed8'
    if (intensity < 0.75) return '#3b82f6'
    return '#6366f1'
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const grouped = []
  for (let i = 0; i < cells.length; i += 7) {
    grouped.push(cells.slice(i, i + 7))
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Contribution Heatmap (Last 6 Months)</h3>
      <div style={styles.wrapper}>
        <div style={styles.dayLabels}>
          {dayLabels.map(d => (
            <span key={d} style={styles.dayLabel}>{d}</span>
          ))}
        </div>
        <div style={styles.grid}>
          {grouped.map((week, wi) => (
            <div key={wi} style={styles.week}>
              {week.map(([date, val]) => (
                <div
                  key={date}
                  title={`${date}: ${val} commit${val !== 1 ? 's' : ''}`}
                  style={{ ...styles.cell, background: getColor(val) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={styles.legend}>
        <span style={styles.legendLabel}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <div key={i} style={{ ...styles.legendCell, background: getColor(v * maxVal) }} />
        ))}
        <span style={styles.legendLabel}>More</span>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  title: { color: '#f1f5f9', fontSize: '1rem', fontWeight: '600', margin: '0 0 16px' },
  wrapper: { display: 'flex', gap: '8px', overflowX: 'auto' },
  dayLabels: { display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '2px' },
  dayLabel: { color: '#64748b', fontSize: '0.65rem', height: '12px', lineHeight: '12px' },
  grid: { display: 'flex', gap: '3px' },
  week: { display: 'flex', flexDirection: 'column', gap: '3px' },
  cell: { width: '12px', height: '12px', borderRadius: '2px', cursor: 'default', transition: 'transform 0.1s' },
  legend: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', justifyContent: 'flex-end' },
  legendLabel: { color: '#64748b', fontSize: '0.72rem' },
  legendCell: { width: '12px', height: '12px', borderRadius: '2px' }
}

export default HeatMap