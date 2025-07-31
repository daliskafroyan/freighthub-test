<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">📦 Orders Management</h1>
        <p class="mt-2 text-gray-600">View and manage all shipping orders</p>
      </div>
      <router-link 
        to="/orders/create"
        class="btn-primary flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create New Order
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Status Filter -->
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

        <!-- Items per page -->
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

        <!-- Sort options -->
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

        <!-- Reset filters -->
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-lg text-gray-900">Loading orders...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card">
      <div class="text-center py-12">
        <div class="mx-auto h-12 w-12 text-red-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchOrders"
          class="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="card">
      <div class="text-center py-12">
        <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">📦 No Orders Found</h3>
        <p class="text-gray-600 mb-4">
          {{ filters.status ? `No orders found with status "${filters.status}". Try adjusting your filters or create a new order.` : 'No orders have been created yet. Get started by creating your first order!' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link to="/orders/create" class="btn-primary">
            🚚 Create Your First Order
          </router-link>
          <button 
            v-if="filters.status"
            @click="resetFilters"
            class="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <!-- Orders Table/Cards -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Orders ({{ pagination.totalOrders }} total)
          </h3>
        </div>
        
        <!-- Mobile: Card Layout -->
        <div class="block md:hidden">
          <div v-for="order in orders" :key="order.id" class="border-b border-gray-200 last:border-b-0">
            <div class="p-4 space-y-3">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <div class="font-medium text-gray-900">
                  {{ order.trackingNumber }}
                </div>
                <div :class="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </div>
              </div>
              
              <!-- Route -->
              <div class="text-sm text-gray-600">
                <div class="flex items-center">
                  <span class="font-medium">Route:</span>
                  <span class="ml-2">{{ order.route }}</span>
                </div>
              </div>
              
              <!-- Sender/Recipient -->
              <div class="text-sm text-gray-600 space-y-1">
                <div><span class="font-medium">From:</span> {{ order.senderName }}</div>
                <div><span class="font-medium">To:</span> {{ order.recipientName }}</div>
              </div>
              
              <!-- Date -->
              <div class="text-xs text-gray-500">
                Created: {{ formatDate(order.createdAt) }}
              </div>
              
                             <!-- Actions -->
               <div class="flex flex-wrap gap-2 pt-2">
                 <button
                   @click="viewOrder(order)"
                   class="text-sm text-primary-600 hover:text-primary-800 font-medium"
                 >
                   View Details
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
            </div>
          </div>
        </div>
        
        <!-- Desktop: Table Layout -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.trackingNumber }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="order.route">
                    {{ order.route }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.senderName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.recipientName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                                 <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <div class="flex justify-end space-x-2">
                     <button
                       @click="viewOrder(order)"
                       class="text-primary-600 hover:text-primary-900 font-medium"
                     >
                       View
                     </button>
                     <button
                       v-if="order.status === 'Pending'"
                       @click="updateOrderStatus(order)"
                       class="text-yellow-600 hover:text-yellow-900 font-medium"
                     >
                       Update
                     </button>
                     <button
                       v-if="order.status === 'Pending'"
                       @click="cancelOrder(order)"
                       class="text-red-600 hover:text-red-900 font-medium"
                       :disabled="cancellingOrders.includes(order.id)"
                     >
                       {{ cancellingOrders.includes(order.id) ? 'Cancelling...' : 'Cancel' }}
                     </button>
                   </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="card">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ ((pagination.currentPage - 1) * pagination.ordersPerPage) + 1 }} to 
            {{ Math.min(pagination.currentPage * pagination.ordersPerPage, pagination.totalOrders) }} of 
            {{ pagination.totalOrders }} orders
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(pagination.currentPage - 1)"
              :disabled="!pagination.hasPreviousPage"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div class="flex space-x-1">
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-2 text-sm border rounded-lg',
                    page === pagination.currentPage 
                      ? 'bg-primary-600 text-white border-primary-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-3 py-2 text-sm text-gray-500">...</span>
              </template>
            </div>
            
            <button
              @click="goToPage(pagination.currentPage + 1)"
              :disabled="!pagination.hasNextPage"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'OrdersList',
  setup() {
    const router = useRouter()
    
    // State
    const orders = ref([])
    const loading = ref(false)
    const error = ref('')
    const cancellingOrders = ref([])
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false
    })
    
    // Filters
    const filters = ref({
      status: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    })
    
    // Computed
    const visiblePages = computed(() => {
      const totalPages = pagination.value.totalPages
      const currentPage = pagination.value.currentPage
      const delta = 2
      
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }
      
      const pages = []
      
      if (currentPage <= delta + 1) {
        for (let i = 1; i <= Math.min(delta + 3, totalPages); i++) {
          pages.push(i)
        }
        if (totalPages > delta + 3) {
          pages.push('...')
          pages.push(totalPages)
        }
      } else if (currentPage >= totalPages - delta) {
        pages.push(1)
        if (totalPages > delta + 3) {
          pages.push('...')
        }
        for (let i = Math.max(totalPages - delta - 2, 1); i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
      
      return pages
    })
    
    // Methods
    const fetchOrders = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const params = new URLSearchParams()
        if (filters.value.status) params.append('status', filters.value.status)
        params.append('page', filters.value.page.toString())
        params.append('limit', filters.value.limit.toString())
        params.append('sortBy', filters.value.sortBy)
        params.append('sortOrder', filters.value.sortOrder)
        
        const response = await axios.get(`/api/orders?${params.toString()}`)
        
        orders.value = response.data.orders
        pagination.value = response.data.pagination
        
      } catch (err) {
        console.error('Error fetching orders:', err)
        
        // Enhanced error handling
        if (err.response?.data?.message) {
          error.value = err.response.data.message
        } else if (err.response?.status === 500) {
          error.value = 'Server error. Please try again later.'
        } else if (err.response?.status === 404) {
          error.value = 'Orders endpoint not found. Please check your API configuration.'
        } else if (err.response?.status >= 400 && err.response?.status < 500) {
          error.value = 'Bad request. Please check your filters and try again.'
        } else if (err.request) {
          error.value = 'Network error. Please check your internet connection and try again.'
        } else {
          error.value = 'An unexpected error occurred while loading orders.'
        }
        
        orders.value = []
        pagination.value = {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          ordersPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false
        }
      } finally {
        loading.value = false
      }
    }
    
    const handleFilterChange = () => {
      filters.value.page = 1 // Reset to first page when filters change
      fetchOrders()
    }
    
    const resetFilters = () => {
      filters.value = {
        status: '',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
      fetchOrders()
    }
    
    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        filters.value.page = page
        fetchOrders()
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
      // Navigate to order details page
      router.push(`/orders/${order.id}`)
    }
    
    const updateOrderStatus = (order) => {
      // Navigate to order details page where status can be updated
      router.push(`/orders/${order.id}`)
    }
    
    const cancelOrder = async (order) => {
      if (!confirm(`Are you sure you want to cancel order ${order.trackingNumber}? This action cannot be undone.`)) {
        return
      }
      
      // Add order ID to cancelling list
      cancellingOrders.value.push(order.id)
      
      try {
        await axios.delete(`/api/orders/${order.id}`)
        
        // Show success message (you could use a toast notification here)
        alert(`Order ${order.trackingNumber} has been cancelled successfully.`)
        
        // Refresh the orders list
        await fetchOrders()
        
      } catch (err) {
        console.error('Error cancelling order:', err)
        
        let errorMessage = 'Failed to cancel order. '
        
        if (err.response?.data?.message) {
          errorMessage += err.response.data.message
        } else if (err.response?.status === 400) {
          errorMessage += 'Order cannot be cancelled in its current state.'
        } else if (err.response?.status === 404) {
          errorMessage += 'Order not found.'
        } else if (err.request) {
          errorMessage += 'Network error. Please check your connection.'
        } else {
          errorMessage += 'An unexpected error occurred.'
        }
        
        alert(errorMessage)
        
      } finally {
        // Remove order ID from cancelling list
        cancellingOrders.value = cancellingOrders.value.filter(id => id !== order.id)
      }
    }
    
    // Watchers
    watch(() => filters.value.page, fetchOrders)
    
    // Lifecycle
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      orders,
      loading,
      error,
      cancellingOrders,
      pagination,
      filters,
      visiblePages,
      fetchOrders,
      handleFilterChange,
      resetFilters,
      goToPage,
      getStatusBadgeClass,
      formatDate,
      viewOrder,
      updateOrderStatus,
      cancelOrder
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style> 