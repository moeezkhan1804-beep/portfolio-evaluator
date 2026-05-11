import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import Compare from './pages/Compare'
import ThemeToggle from './components/ThemeToggle'
import ToastProvider from './components/Toast'

function App() {
  return (
    <>
      <ToastProvider />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:shareId" element={<Report />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </>
  )
}

export default App