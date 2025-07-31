import { defineStore } from 'pinia'
import axios from 'axios'

export const useAppStore = defineStore('app', {
  state: () => ({
    // App state
    isLoading: false,
    apiConnected: false,
    apiMessage: '',
    
    // Mock logistics data
    stats: {
      totalShipments: 0,
      delivered: 0,
      inTransit: 0,
      pending: 0
    },
    
    // Application settings
    settings: {
      theme: 'light',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30000 // 30 seconds
    }
  }),

  getters: {
    // Calculate delivery rate
    deliveryRate: (state) => {
      if (state.stats.totalShipments === 0) return 0
      return Math.round((state.stats.delivered / state.stats.totalShipments) * 100)
    },
    
    // Check if API is healthy
    isApiHealthy: (state) => state.apiConnected,
    
    // Get loading state
    loading: (state) => state.isLoading
  },

  actions: {
    // Set loading state
    setLoading(loading) {
      this.isLoading = loading
    },

    // Test API connection
    async checkApiHealth() {
      this.setLoading(true)
      try {
        const response = await axios.get('/api/health', {
          timeout: 5000
        })
        
        this.apiConnected = true
        this.apiMessage = response.data.message || 'API is healthy'
        
        // Generate mock statistics
        this.updateMockStats()
        
        return true
      } catch (error) {
        this.apiConnected = false
        this.apiMessage = 'API connection failed: ' + (error.message || 'Unknown error')
        console.error('API health check failed:', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // Update mock statistics (simulate real data)
    updateMockStats() {
      this.stats = {
        totalShipments: Math.floor(Math.random() * 100) + 50,
        delivered: Math.floor(Math.random() * 50) + 20,
        inTransit: Math.floor(Math.random() * 30) + 10,
        pending: Math.floor(Math.random() * 20) + 5
      }
    },

    // Update application settings
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      
      // Save to localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('logistics-app-settings', JSON.stringify(this.settings))
      }
    },

    // Load settings from localStorage
    loadSettings() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('logistics-app-settings')
        if (saved) {
          try {
            this.settings = { ...this.settings, ...JSON.parse(saved) }
          } catch (error) {
            console.warn('Failed to load settings from localStorage:', error)
          }
        }
      }
    },

    // Initialize the app
    async initializeApp() {
      this.setLoading(true)
      
      try {
        // Load saved settings
        this.loadSettings()
        
        // Check API health
        await this.checkApiHealth()
        
        console.log('✅ App initialized successfully')
      } catch (error) {
        console.error('❌ App initialization failed:', error)
      } finally {
        this.setLoading(false)
      }
    }
  }
}) 