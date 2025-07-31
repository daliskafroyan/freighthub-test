<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-gray-600">Welcome to your logistics tracking dashboard</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">📦</span>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Shipments</h3>
            <p class="text-2xl font-bold text-blue-600">{{ stats.totalShipments }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">✅</span>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Delivered</h3>
            <p class="text-2xl font-bold text-green-600">{{ stats.delivered }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">🚛</span>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">In Transit</h3>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.inTransit }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- API Status -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">API Connection Status</h3>
      <div class="flex items-center space-x-2">
        <div 
          :class="apiStatus.connected ? 'bg-green-500' : 'bg-red-500'" 
          class="w-3 h-3 rounded-full"
        ></div>
        <span :class="apiStatus.connected ? 'text-green-700' : 'text-red-700'">
          {{ apiStatus.message }}
        </span>
      </div>
      <button 
        @click="checkApiStatus" 
        class="btn-primary mt-4"
        :disabled="loading"
      >
        {{ loading ? 'Checking...' : 'Test Connection' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Home',
  setup() {
    const stats = ref({
      totalShipments: 0,
      delivered: 0,
      inTransit: 0
    })

    const apiStatus = ref({
      connected: false,
      message: 'Not checked'
    })

    const loading = ref(false)

    const checkApiStatus = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/health')
        apiStatus.value = {
          connected: true,
          message: `Connected - ${response.data.message}`
        }
        
        // Mock some stats for demonstration
        stats.value = {
          totalShipments: Math.floor(Math.random() * 100) + 50,
          delivered: Math.floor(Math.random() * 50) + 20,
          inTransit: Math.floor(Math.random() * 30) + 10
        }
      } catch (error) {
        apiStatus.value = {
          connected: false,
          message: 'Connection failed - Backend server may be down'
        }
        console.error('API connection failed:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      checkApiStatus()
    })

    return {
      stats,
      apiStatus,
      loading,
      checkApiStatus
    }
  }
}
</script> 