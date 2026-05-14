import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

// Initialize token from localStorage on app load
const initToken = localStorage.getItem('token')
if (initToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initToken}`
  console.log('[API] Token initialized from localStorage:', initToken.substring(0, 20) + '...')
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('[API Interceptor] Token attached to request:', token.substring(0, 20) + '...')
  } else {
    console.warn('[API Interceptor] No token found in localStorage')
    // Remove auth header if no token
    delete config.headers.Authorization
  }

  return config
})

// Helper function to set token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
    console.log('[API] Auth token set:', token.substring(0, 20) + '...')
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
    console.log('[API] Auth token removed')
  }
}

export default api
