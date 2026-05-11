import { useEffect, useState, useRef } from 'react'

function AnimatedCounter({ value, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = 0
        const end = parseInt(value)
        const increment = end / (duration / 16)
        let current = start
        const timer = setInterval(() => {
          current += increment
          if (current >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, 16)
      }
    }, { threshold: 0.1 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} style={styles.counter}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const styles = {
  counter: { fontVariantNumeric: 'tabular-nums' }
}

export default AnimatedCounter