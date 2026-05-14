import { defineStore } from 'pinia'
import axios from 'axios'
import { setAuthToken } from '@/services/api'

type User = {
  id: number
  name: string
  email: string
  phone?: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      })

      this.user = response.data.data.user
      this.token = response.data.data.token

      localStorage.setItem('user', JSON.stringify(this.user))
      setAuthToken(this.token)

      console.log('[Auth] Login successful, token set')
      return response
    },

    async register(name: string, email: string, password: string, phone?: string) {
      const payload: Record<string, any> = {
        name,
        email,
        password,
      }

      if (phone) payload.phone = phone

      const response = await axios.post('http://127.0.0.1:8000/api/register', payload)

      this.user = response.data.data.user
      this.token = response.data.data.token

      localStorage.setItem('user', JSON.stringify(this.user))
      setAuthToken(this.token)

      console.log('[Auth] Registration successful, token set')
      return response
    },

    logout() {
      this.user = null
      this.token = ''

      localStorage.removeItem('user')
      setAuthToken(null)

      console.log('[Auth] Logout successful, token cleared')
    },
  },
})
