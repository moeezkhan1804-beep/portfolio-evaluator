import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: API_URL })

export const evaluateProfile = (username) => api.post('/github/evaluate', { username })
export const getReport = (shareId) => api.get(`/github/report/${shareId}`)

export default api