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
import { useOrdersStore } from '../stores/orders.js'

export default {
  name: 'Home',
  setup() {
    // Use Pinia stores
    const appStore = useAppStore()
    const ordersStore = useOrdersStore()

    // Use real stats from orders store
    const stats = computed(() => {
      const orderCounts = ordersStore.ordersCount
      return {
        totalShipments: orderCounts.total,
        delivered: orderCounts.delivered,
        inTransit: orderCounts.inTransit,
        pending: orderCounts.pending
      }
    })
    
    const loading = computed(() => ordersStore.loading.orders)

    onMounted(async () => {
      // Initialize the app when component mounts
      await appStore.initializeApp()
      
      // Initialize orders store to get real statistics
      if (ordersStore.orders.length === 0) {
        try {
          await ordersStore.initialize()
        } catch (error) {
          console.error('Failed to initialize orders for stats:', error)
        }
      }
    })

    return {
      stats,
      loading
    }
  }
}
</script> 