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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">⏳</span>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Pending</h3>
            <p class="text-2xl font-bold text-orange-600">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Rate -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">📊 Delivery Performance</h3>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Delivery Rate</span>
        <div class="flex items-center">
          <div class="w-24 bg-gray-200 rounded-full h-2 mr-3">
            <div 
              :class="deliveryRate >= 80 ? 'bg-green-500' : deliveryRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'"
              class="h-2 rounded-full transition-all duration-300"
              :style="{ width: deliveryRate + '%' }"
            ></div>
          </div>
          <span 
            :class="deliveryRate >= 80 ? 'text-green-600' : deliveryRate >= 60 ? 'text-yellow-600' : 'text-red-600'"
            class="font-bold"
          >
            {{ deliveryRate }}%
          </span>
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

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">🚀 Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <router-link 
          to="/orders/create"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
        >
          <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900">Create New Order</h4>
            <p class="text-sm text-gray-500">Start a new shipment</p>
          </div>
        </router-link>
        
        <router-link 
          to="/orders"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
        >
          <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900">View All Orders</h4>
            <p class="text-sm text-gray-500">Manage existing orders</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'

export default {
  name: 'Home',
  setup() {
    // Use Pinia store
    const appStore = useAppStore()

    // Computed properties from store
    const stats = computed(() => appStore.stats)
    const apiStatus = computed(() => ({
      connected: appStore.apiConnected,
      message: appStore.apiMessage
    }))
    const loading = computed(() => appStore.loading)
    const deliveryRate = computed(() => appStore.deliveryRate)

    // Actions
    const checkApiStatus = () => appStore.checkApiHealth()

    onMounted(() => {
      // Initialize the app when component mounts
      appStore.initializeApp()
    })

    return {
      stats,
      apiStatus,
      loading,
      deliveryRate,
      checkApiStatus
    }
  }
}
</script> 