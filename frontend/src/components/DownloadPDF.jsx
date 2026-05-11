import { useState } from 'react'

function DownloadPDF({ username }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')
      const element = document.getElementById('report-content')
      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`${username}-portfolio-report.pdf`)
    } catch (err) {
      console.error('PDF error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? '⏳ Generating PDF...' : '⬇️ Download PDF'}
    </button>
  )
}

const styles = {
  btn: {
    padding: '12px 24px',
    background: '#0f172a',
    color: '#f1f5f9',
    border: '1px solid #334155',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  }
}

export default DownloadPDF