import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import Compare from './pages/Compare'
import Leaderboard from './pages/Leaderboard'
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
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  )
}

export default App