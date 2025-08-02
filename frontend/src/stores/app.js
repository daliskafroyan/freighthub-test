import { defineStore } from 'pinia'
import axios from 'axios'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    apiConnected: false,
    apiMessage: '',
    settings: { theme: 'light', notifications: true, autoRefresh: true, refreshInterval: 30000 }
  }),
  getters: {
    isApiHealthy: (state) => state.apiConnected,
    loading: (state) => state.isLoading
  },
  actions: {
    setLoading(loading) {
      this.isLoading = loading
    },
    async checkApiHealth() {
      try {
        const response = await axios.get('/api/health')
        this.apiConnected = response.data.status === 'OK'
        this.apiMessage = response.data.message
        return this.apiConnected
      } catch (error) {
        this.apiConnected = false
        this.apiMessage = 'API connection failed'
        console.error('API health check failed:', error)
        return false
      }
    },
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      localStorage.setItem('app-settings', JSON.stringify(this.settings))
    },
    loadSettings() {
      try {
        const saved = localStorage.getItem('app-settings')
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) }
        }
      } catch (error) {
        console.warn('Failed to load settings from localStorage:', error)
      }
    },
    async initializeApp() {
      this.setLoading(true)
      try {
        await this.checkApiHealth()
        this.loadSettings()
      } catch (error) {
        console.error('App initialization failed:', error)
      } finally {
        this.setLoading(false)
      }
    }
  }
}) 