<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
        <p class="text-gray-600">Manage and track your shipping orders</p>
      </div>
      <router-link to="/orders/create" class="btn-primary flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create Order
      </router-link>
    </div>

    <div class="card">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
            <input
              v-model="filters.trackingNumber"
              @input="handleTrackingNumberInput"
              type="text"
              placeholder="Search tracking number..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48"
            />
          </div>

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
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
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
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-1">
                    <button
                      @click="viewOrder(order)"
                      class="p-2 text-gray-400 hover:text-primary-600 transition-colors relative group"
                      title="View & Track Order"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        View & Track
                      </div>
                    </button>
                    
                    <button
                      v-if="order.status === 'Pending'"
                      @click="showStatusUpdateModal(order)"
                      class="p-2 text-gray-400 hover:text-yellow-600 transition-colors relative group"
                      title="Update Status"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Update Status
                      </div>
                    </button>
                    
                    <button
                      v-if="order.status === 'Pending'"
                      @click="cancelOrder(order)"
                      :disabled="cancellingOrders.includes(order.id)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors relative group disabled:opacity-50 disabled:cursor-not-allowed"
                      :title="cancellingOrders.includes(order.id) ? 'Cancelling...' : 'Cancel Order'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {{ cancellingOrders.includes(order.id) ? 'Cancelling...' : 'Cancel Order' }}
                      </div>
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

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 top-[-25px]">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Update Order Status</h3>
            <button
              @click="closeStatusModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              Order: <span class="font-medium">{{ selectedOrder?.trackingNumber }}</span>
            </p>
            <p class="text-sm text-gray-600">
              Current Status: <span :class="getStatusBadgeClass(selectedOrder?.status)">{{ selectedOrder?.status }}</span>
            </p>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <select
              v-model="newStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select new status</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          
          <div class="flex items-center justify-end space-x-3">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="updateOrderStatus"
              :disabled="!newStatus || updatingStatus"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updatingStatus ? 'Updating...' : 'Update Status' }}
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
      trackingNumber: route.query.trackingNumber || '',
      page: parseInt(route.query.page) || 1,
      limit: parseInt(route.query.limit) || 10,
      sortBy: route.query.sortBy || 'createdAt',
      sortOrder: route.query.sortOrder || 'DESC'
    })
    
    const trackingNumberTimeout = ref(null)
    
    const showStatusModal = ref(false)
    const selectedOrder = ref(null)
    const newStatus = ref('')
    const updatingStatus = ref(false)
    
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
      if (filters.value.trackingNumber) query.trackingNumber = filters.value.trackingNumber
      if (filters.value.page > 1) query.page = filters.value.page
      if (filters.value.limit !== 10) query.limit = filters.value.limit
      if (filters.value.sortBy !== 'createdAt') query.sortBy = filters.value.sortBy
      if (filters.value.sortOrder !== 'DESC') query.sortOrder = filters.value.sortOrder
      
      router.replace({ query })
    }
    
    const handleTrackingNumberInput = () => {
      if (trackingNumberTimeout.value) {
        clearTimeout(trackingNumberTimeout.value)
      }
      
      trackingNumberTimeout.value = setTimeout(() => {
        handleFilterChange()
      }, 500)
    }
    
    const handleFilterChange = async () => {
      filters.value.page = 1
      
      updateURL()
      
      ordersStore.updateFilters({
        status: filters.value.status,
        trackingNumber: filters.value.trackingNumber,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder
      })
      
      await ordersStore.fetchOrders({
        page: 1,
        limit: filters.value.limit,
        status: filters.value.status,
        trackingNumber: filters.value.trackingNumber,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder
      })
    }
    
    const resetFilters = async () => {
      filters.value = {
        status: '',
        trackingNumber: '',
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
    
    const showStatusUpdateModal = (order) => {
      selectedOrder.value = order
      newStatus.value = ''
      showStatusModal.value = true
    }
    
    const closeStatusModal = () => {
      showStatusModal.value = false
      selectedOrder.value = null
      newStatus.value = ''
      updatingStatus.value = false
    }
    
    const updateOrderStatus = async () => {
      if (!newStatus.value || !selectedOrder.value) return
      
      updatingStatus.value = true
      
      try {
        await ordersStore.updateOrderStatus(selectedOrder.value.id, newStatus.value)
        toast.success(`Order status updated to ${newStatus.value}`)
        closeStatusModal()
        await fetchOrders()
      } catch (err) {
        console.error('Error updating order status:', err)
        const errorMessage = ordersStore.errors.updating || 'Failed to update order status'
        toast.error(errorMessage)
      } finally {
        updatingStatus.value = false
      }
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
          trackingNumber: filters.value.trackingNumber,
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
        trackingNumber: newQuery.trackingNumber || '',
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
      showStatusModal,
      selectedOrder,
      newStatus,
      updatingStatus,
      handleFilterChange,
      handleTrackingNumberInput,
      resetFilters,
      goToPage,
      getStatusBadgeClass,
      formatDate,
      viewOrder,
      showStatusUpdateModal,
      closeStatusModal,
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