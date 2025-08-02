<template>
  <div class="space-y-6">
    <div class="card">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              v-model="filters.status" 
              @change="handleFilterChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
            <select 
              v-model="filters.limit" 
              @change="handleFilterChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              v-model="filters.sortBy" 
              @change="handleFilterChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="status">Status</option>
              <option value="trackingNumber">Tracking Number</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <select 
              v-model="filters.sortOrder" 
              @change="handleFilterChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
        </div>

        <div>
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="card text-center py-12">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span class="ml-3 text-gray-600">Loading orders...</span>
      </div>
    </div>

    <div v-else-if="error" class="card text-center py-12">
      <div class="text-red-600">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg font-medium">{{ error }}</p>
        <button @click="fetchOrders" class="mt-4 btn-primary">Try Again</button>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="card text-center py-12">
      <div class="text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <p class="text-lg font-medium">No orders found</p>
        <p class="text-sm">Create your first order to get started</p>
        <router-link to="/orders/create" class="mt-4 btn-primary inline-block">Create Order</router-link>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ order.trackingNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.route }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View & Track
                    </button>
                    <button
                      v-if="order.status === 'Pending'"
                      @click="updateOrderStatus(order)"
                      class="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                    >
                      Update Status
                    </button>
                    <button
                      v-if="order.status === 'Pending'"
                      @click="cancelOrder(order)"
                      class="text-sm text-red-600 hover:text-red-800 font-medium"
                      :disabled="cancellingOrders.includes(order.id)"
                    >
                      {{ cancellingOrders.includes(order.id) ? 'Cancelling...' : 'Cancel Order' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (pagination.currentPage - 1) * pagination.ordersPerPage + 1 }} to 
            {{ Math.min(pagination.currentPage * pagination.ordersPerPage, pagination.totalOrders) }} of 
            {{ pagination.totalOrders }} orders
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(pagination.currentPage - 1)"
              :disabled="!pagination.hasPreviousPage"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
            </span>
            <button
              @click="goToPage(pagination.currentPage + 1)"
              :disabled="!pagination.hasNextPage"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrdersStore } from '../stores/orders.js'
import { useToast } from '../composables/useToast.js'

export default {
  name: 'OrdersList',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    const orders = computed(() => ordersStore.orders)
    const loading = computed(() => ordersStore.loading.orders)
    const error = computed(() => ordersStore.errors.orders)
    const cancellingOrders = ref([])
    const pagination = computed(() => ordersStore.pagination)
    
    const filters = ref({
      status: route.query.status || '',
      page: parseInt(route.query.page) || 1,
      limit: parseInt(route.query.limit) || 10,
      sortBy: route.query.sortBy || 'createdAt',
      sortOrder: route.query.sortOrder || 'DESC'
    })
    
    const visiblePages = computed(() => {
      const totalPages = pagination.value.totalPages
      const currentPage = pagination.value.currentPage
      const delta = 2
      
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }
      
      const pages = []
      
      for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        pages.push(i)
      }
      
      if (pages[0] > 1) {
        pages.unshift(1)
        if (pages[1] > 2) {
          pages.splice(1, 0, '...')
        }
      }
      
      if (pages[pages.length - 1] < totalPages) {
        if (pages[pages.length - 2] < totalPages - 1) {
          pages.splice(pages.length - 1, 0, '...')
        }
        pages.push(totalPages)
      }
      
      return pages
    })
    
    const updateURL = () => {
      const query = {}
      
      if (filters.value.status) query.status = filters.value.status
      if (filters.value.page > 1) query.page = filters.value.page
      if (filters.value.limit !== 10) query.limit = filters.value.limit
      if (filters.value.sortBy !== 'createdAt') query.sortBy = filters.value.sortBy
      if (filters.value.sortOrder !== 'DESC') query.sortOrder = filters.value.sortOrder
      
      router.replace({ query })
    }
    
    const handleFilterChange = async () => {
      filters.value.page = 1
      
      updateURL()
      
      await ordersStore.updateFilters({
        status: filters.value.status,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder
      })
      
      await ordersStore.fetchOrders({
        page: 1,
        limit: filters.value.limit,
        status: filters.value.status,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder
      })
    }
    
    const resetFilters = async () => {
      filters.value = {
        status: '',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
      
      updateURL()
      
      ordersStore.resetFilters()
      await ordersStore.fetchOrders({ page: 1, limit: 10 })
    }
    
    const goToPage = async (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        filters.value.page = page
        
        updateURL()
        
        await ordersStore.goToPage(page)
      }
    }
    
    const getStatusBadgeClass = (status) => {
      const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
      
      switch (status) {
        case 'Pending':
          return `${baseClasses} bg-yellow-100 text-yellow-800`
        case 'In Transit':
          return `${baseClasses} bg-blue-100 text-blue-800`
        case 'Delivered':
          return `${baseClasses} bg-green-100 text-green-800`
        case 'Canceled':
          return `${baseClasses} bg-red-100 text-red-800`
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`
      }
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const viewOrder = (order) => {
      router.push(`/orders/${order.id}`)
    }
    
    const updateOrderStatus = (order) => {
      router.push(`/orders/${order.id}`)
    }
    
    const cancelOrder = async (order) => {
      if (!confirm(`Are you sure you want to cancel order ${order.trackingNumber}? The order will be marked as canceled and no further changes will be possible.`)) {
        return
      }
      
      cancellingOrders.value.push(order.id)
      
      try {
        await ordersStore.cancelOrder(order.id)
        
        toast.orderCanceled(order.trackingNumber)
        
      } catch (err) {
        console.error('Error cancelling order:', err)
        
        const errorMessage = ordersStore.errors.deleting || 'Failed to cancel order. Please try again.'
        toast.error(errorMessage, { title: 'Cancellation Failed' })
        
      } finally {
        cancellingOrders.value = cancellingOrders.value.filter(id => id !== order.id)
      }
    }
    
    const fetchOrders = async () => {
      try {
        await ordersStore.fetchOrders({
          page: filters.value.page,
          limit: filters.value.limit,
          status: filters.value.status,
          sortBy: filters.value.sortBy,
          sortOrder: filters.value.sortOrder
        })
      } catch (err) {
        console.error('Error fetching orders:', err)
      }
    }
    
    watch(() => route.query, (newQuery) => {
      filters.value = {
        status: newQuery.status || '',
        page: parseInt(newQuery.page) || 1,
        limit: parseInt(newQuery.limit) || 10,
        sortBy: newQuery.sortBy || 'createdAt',
        sortOrder: newQuery.sortOrder || 'DESC'
      }
      
      fetchOrders()
    }, { deep: true })

    onMounted(async () => {
      await fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      pagination,
      filters,
      visiblePages,
      cancellingOrders,
      handleFilterChange,
      resetFilters,
      goToPage,
      getStatusBadgeClass,
      formatDate,
      viewOrder,
      updateOrderStatus,
      cancelOrder,
      fetchOrders
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style> 