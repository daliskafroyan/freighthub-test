<template>
  <div class="space-y-6">
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900">Logistics Dashboard</h2>
        <p class="mt-1 text-sm text-gray-600">Track your shipments and monitor delivery performance</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Total Shipments</div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.totalShipments }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Delivered</div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.delivered }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">In Transit</div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.inTransit }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Pending</div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.pending }}</div>
          </div>
        </div>
      </div>
    </div>

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
    const appStore = useAppStore()
    const ordersStore = useOrdersStore()

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
      await appStore.initializeApp()
      
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