<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xl text-gray-900">Loading order details...</span>
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Order</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="fetchOrder" class="btn-primary">
            Try Again
          </button>
          <router-link to="/orders" class="btn-secondary">
            Back to Orders
          </router-link>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <nav class="text-sm text-gray-500 mb-2">
            <router-link to="/" class="hover:text-gray-700">Dashboard</router-link>
            <span class="mx-2">›</span>
            <router-link to="/orders" class="hover:text-gray-700">Orders</router-link>
            <span class="mx-2">›</span>
            <span class="text-gray-900">{{ order.trackingNumber }}</span>
          </nav>
          <h1 class="text-3xl font-bold text-gray-900">📦 Order Details</h1>
          <p class="text-gray-600 mt-1">Complete information for order {{ order.trackingNumber }}</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <span :class="getStatusBadgeClass(order.status)">
            {{ order.status }}
          </span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Order Information (2/3 width) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Tracking Information -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">🚚 Tracking Information</h2>
              <button
                @click="copyTrackingNumber"
                class="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
              </button>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-center">
                <div class="text-2xl font-mono font-bold text-gray-900 mb-2">
                  {{ order.trackingNumber }}
                </div>
                <div class="text-sm text-gray-600">
                  Tracking Number
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Details -->
          <div class="card">
            <h2 class="text-lg font-medium text-gray-900 mb-4">📍 Shipping Details</h2>
            <div class="space-y-4">
              <!-- Route Visualization -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-blue-900">{{ order.origin }}</div>
                    <div class="text-sm text-blue-700">Origin</div>
                  </div>
                  <div class="px-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                  <div class="flex-1 text-right">
                    <div class="font-medium text-blue-900">{{ order.destination }}</div>
                    <div class="text-sm text-blue-700">Destination</div>
                  </div>
                </div>
              </div>

              <!-- Sender and Recipient -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-2">📤 Sender</h3>
                  <p class="text-gray-700">{{ order.senderName }}</p>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-2">📥 Recipient</h3>
                  <p class="text-gray-700">{{ order.recipientName }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="card">
            <h2 class="text-lg font-medium text-gray-900 mb-4">📅 Order Timeline</h2>
            <div v-if="order.statusHistory && order.statusHistory.length > 0" class="space-y-4">
              <!-- Dynamic Timeline from Status History -->
              <div 
                v-for="(entry, index) in order.statusHistory" 
                :key="entry.id"
                class="flex items-start relative"
              >
                <!-- Timeline connector line -->
                <div 
                  v-if="index < order.statusHistory.length - 1"
                  class="absolute left-4 top-8 w-px h-8 bg-gray-200"
                ></div>
                
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white',
                    entry.color === 'yellow' ? 'border-yellow-300 text-yellow-600' :
                    entry.color === 'blue' ? 'border-blue-300 text-blue-600' :
                    entry.color === 'green' ? 'border-green-300 text-green-600' :
                    entry.color === 'red' ? 'border-red-300 text-red-600' :
                    'border-gray-300 text-gray-600'
                  ]">
                    <!-- Dynamic icon based on status -->
                    <svg v-if="entry.icon === 'clock'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="entry.icon === 'truck'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">  
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z"/>
                    </svg>
                    <svg v-else-if="entry.icon === 'check-circle'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="entry.icon === 'x-circle'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-3 7a3 3 0 106 0 3 3 0 00-6 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div class="ml-4 flex-1 pb-4">
                  <div class="flex items-center justify-between">
                    <div class="font-medium text-gray-900">{{ entry.status }}</div>
                    <div v-if="entry.stepNumber" class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Step {{ entry.stepNumber }}
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">{{ formatDate(entry.timestamp) }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ entry.description }}</div>
                  <div v-if="entry.notes" class="text-xs text-gray-400 mt-2 italic">
                    {{ entry.notes }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Loading state -->
            <div v-else-if="loading" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span class="ml-3 text-gray-600">Loading timeline...</span>
            </div>
            
            <!-- Empty state -->
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>No timeline data available</p>
            </div>
          </div>
        </div>

        <!-- Actions Sidebar (1/3 width) -->
        <div class="space-y-6">
          <!-- Status Update -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">⚡ Quick Actions</h3>
            
            <!-- Status Update Section -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select 
                  v-model="newStatus" 
                  :disabled="updatingStatus || !canUpdateStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select new status...</option>
                  <option 
                    v-for="status in availableStatuses" 
                    :key="status" 
                    :value="status"
                    :disabled="!isValidStatusTransition(order.status, status)"
                  >
                    {{ status }}
                  </option>
                </select>
              </div>
              
              <button
                @click="updateOrderStatus"
                :disabled="!newStatus || updatingStatus || !canUpdateStatus"
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="updatingStatus" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ updatingStatus ? 'Updating...' : 'Update Status' }}
              </button>

              <div v-if="!canUpdateStatus" class="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                💡 Status cannot be changed for {{ order.status.toLowerCase() }} orders.
              </div>
            </div>
          </div>

          <!-- Cancel Order -->
          <div v-if="order.status === 'Pending'" class="card border-red-200 bg-red-50">
            <h3 class="text-lg font-medium text-red-900 mb-4">⚠️ Danger Zone</h3>
            <div class="space-y-3">
              <p class="text-sm text-red-700">
                Cancel this pending order. The order will be marked as canceled and no further changes will be possible.
              </p>
              <button
                @click="cancelOrder"
                :disabled="cancelling"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="cancelling" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
              </button>
            </div>
          </div>

          <!-- Order Information -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">ℹ️ Order Information</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Order ID:</span>
                <span class="font-medium">{{ order.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Created:</span>
                <span class="font-medium">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Updated:</span>
                <span class="font-medium">{{ formatDate(order.updatedAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span :class="getStatusBadgeClass(order.status, 'text-xs')">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Back to Orders -->
          <div class="card">
            <router-link to="/orders" class="w-full btn-secondary flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Orders
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'p-4 rounded-lg shadow-lg max-w-sm',
        messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
      ]">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="messageType === 'success'" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="message = ''" class="text-gray-400 hover:text-gray-600">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
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
  name: 'OrderDetails',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    // Store-based state
    const order = computed(() => ordersStore.currentOrder)
    const loading = computed(() => ordersStore.loading.currentOrder)
    const error = computed(() => ordersStore.errors.currentOrder)
    const newStatus = ref('')
    const updatingStatus = computed(() => ordersStore.loading.updating)
    const cancelling = computed(() => ordersStore.loading.deleting)
    const message = ref('')
    const messageType = ref('success')
    
    // Available statuses for the dropdown
    const availableStatuses = ['Pending', 'In Transit', 'Delivered', 'Canceled']
    
    // Computed properties
    const canUpdateStatus = computed(() => {
      return order.value && order.value.status !== 'Delivered' && order.value.status !== 'Canceled'
    })
    
    // Business rules for status transitions
    const isValidStatusTransition = (currentStatus, newStatus) => {
      const transitions = {
        'Pending': ['In Transit', 'Canceled'],
        'In Transit': ['Delivered', 'Canceled'],
        'Delivered': [], // Cannot change from delivered
        'Canceled': []   // Cannot change from canceled
      }
      
      return transitions[currentStatus]?.includes(newStatus) || false
    }
    
    // Methods using store
    const fetchOrder = async () => {
      const orderId = route.params.id
      
      if (!orderId) {
        ordersStore.setError('currentOrder', 'Order ID is required')
        return
      }
      
      try {
        await ordersStore.fetchOrderById(orderId)
      } catch (err) {
        // Error is already handled by the store
        console.error('Error fetching order:', err)
      }
    }
    
    const updateOrderStatus = async () => {
      if (!newStatus.value || !order.value) return
      
      try {
        await ordersStore.updateOrderStatus(order.value.id, newStatus.value)
        
        // Refresh the order data to get the updated timeline
        await fetchOrder()
        
        // Show success toast
        toast.orderUpdated(`Order status updated to ${order.value.status} successfully`)
        newStatus.value = ''
        
      } catch (err) {
        console.error('Error updating order status:', err)
        
        // Show error toast
        const errorMessage = ordersStore.errors.updating || 'Failed to update order status. Please try again.'
        toast.error(errorMessage, { title: 'Update Failed' })
      }
    }
    
    const cancelOrder = async () => {
      if (!confirm(`Are you sure you want to cancel order ${order.value.trackingNumber}? The order will be marked as canceled and no further changes will be possible.`)) {
        return
      }
      
      try {
        await ordersStore.cancelOrder(order.value.id)
        
        // Refresh the order data to get the updated status and timeline
        await fetchOrder()
        
        // Show success toast
        toast.orderCanceled(order.value.trackingNumber)
        
      } catch (err) {
        console.error('Error cancelling order:', err)
        
        // Show error toast
        const errorMessage = ordersStore.errors.deleting || 'Failed to cancel order. Please try again.'
        toast.error(errorMessage, { title: 'Cancellation Failed' })
      }
    }
    
    const getStatusBadgeClass = (status, size = '') => {
      const baseClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${size}`
      
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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getStatusDescription = (status) => {
      const descriptions = {
        'Pending': 'Order is waiting to be processed and shipped',
        'In Transit': 'Order is currently being shipped to destination',
        'Delivered': 'Order has been successfully delivered',
        'Canceled': 'Order has been cancelled and will not be shipped'
      }
      
      return descriptions[status] || 'Status information not available'
    }
    
    const copyTrackingNumber = async () => {
      try {
        await navigator.clipboard.writeText(order.value.trackingNumber)
        toast.success('Tracking number copied to clipboard', { title: 'Copied!' })
      } catch (err) {
        toast.error('Failed to copy tracking number', { title: 'Copy Failed' })
      }
    }
    
    const showMessage = (text, type = 'success') => {
      message.value = text
      messageType.value = type
      
      // Auto-hide message after 5 seconds
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }
    
    // Watchers
    watch(() => route.params.id, () => {
      if (route.params.id) {
        fetchOrder()
      }
    })
    
    // Lifecycle
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      order,
      loading,
      error,
      newStatus,
      updatingStatus,
      cancelling,
      message,
      messageType,
      availableStatuses,
      canUpdateStatus,
      isValidStatusTransition,
      fetchOrder,
      updateOrderStatus,
      cancelOrder,
      getStatusBadgeClass,
      formatDate,
      getStatusDescription,
      copyTrackingNumber,
      showMessage
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style> 