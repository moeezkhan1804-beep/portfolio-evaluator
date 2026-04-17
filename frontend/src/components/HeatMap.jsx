function HeatMap({ data = [] }) {
  const map = {};
  data.forEach(({ date, count }) => { map[date] = count; });

  const weeks = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  let current = new Date(start);
  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().slice(0, 10);
      week.push({ date: dateStr, count: map[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return '#0f172a';
    if (count <= 2) return '#1e3a5f';
    if (count <= 5) return '#1d4ed8';
    if (count <= 9) return '#3b82f6';
    return '#93c5fd';
  };

  return (
    <div style={styles.card}>
      <p style={styles.title}>Contribution Activity</p>
      <div style={styles.grid}>
        {weeks.map((week, wi) => (
          <div key={wi} style={styles.week}>
            {week.map(({ date, count }) => (
              <div
                key={date}
                title={`${date}: ${count} events`}
                style={{ ...styles.cell, background: getColor(count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={styles.legend}>
        <span style={styles.legendText}>Less</span>
        {['#0f172a', '#1e3a5f', '#1d4ed8', '#3b82f6', '#93c5fd'].map(c => (
          <div key={c} style={{ ...styles.cell, background: c }} />
        ))}
        <span style={styles.legendText}>More</span>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px' },
  title: { color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 16px' },
  grid: { display: 'flex', gap: '3px', overflowX: 'auto' },
  week: { display: 'flex', flexDirection: 'column', gap: '3px' },
  cell: { width: '11px', height: '11px', borderRadius: '2px' },
  legend: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', justifyContent: 'flex-end' },
  legendText: { color: '#475569', fontSize: '0.75rem' }
}

export default HeatMap