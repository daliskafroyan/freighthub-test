<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">🔍 Track Your Order</h1>
      <p class="text-lg text-gray-600">Enter your tracking number to get real-time updates on your shipment</p>
    </div>

    <!-- Tracking Form -->
    <div class="card">
      <form @submit.prevent="trackOrder" class="space-y-4">
        <div>
          <label for="trackingNumber" class="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number
          </label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              id="trackingNumber"
              v-model="trackingNumber"
              type="text"
              required
              :disabled="loading"
              placeholder="e.g., TRK123456ABCDEF"
              :class="[
                'flex-1 px-4 py-3 border rounded-lg text-lg font-mono transition-colors',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                error && !order ? 'border-red-300 bg-red-50' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              ]"
            />
            <button
              type="submit"
              :disabled="!trackingNumber.trim() || loading"
              class="px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Tracking...' : 'Track Order' }}
            </button>
          </div>
          <p v-if="error && !order" class="mt-2 text-sm text-red-600">
            {{ error }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            💡 Tracking numbers start with "TRK" followed by 12 characters
          </p>
        </div>
      </form>
    </div>

    <!-- Tracking Results -->
    <div v-if="order" class="space-y-6">
      <!-- Order Status Card -->
      <div class="card border-2 border-primary-200 bg-primary-50">
        <div class="text-center">
          <div class="mb-4">
            <span :class="getStatusBadgeClass(order.status, 'text-lg px-4 py-2')">
              {{ order.status }}
            </span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ getStatusTitle(order.status) }}
          </h2>
          <p class="text-gray-600">
            {{ getStatusDescription(order.status) }}
          </p>
        </div>
      </div>

      <!-- Tracking Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Shipping Information -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">📦 Shipment Details</h3>
          <div class="space-y-3">
            <div>
              <div class="text-sm text-gray-600">Tracking Number</div>
              <div class="font-mono font-medium text-gray-900">{{ order.trackingNumber }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Route</div>
              <div class="font-medium text-gray-900">{{ order.route }}</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-600">From</div>
                <div class="font-medium text-gray-900">{{ order.senderName }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">To</div>
                <div class="font-medium text-gray-900">{{ order.recipientName }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">📅 Tracking Timeline</h3>
          <div class="space-y-4">
            <!-- Order Created -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <div class="font-medium text-gray-900">Order Created</div>
                <div class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</div>
              </div>
            </div>

            <!-- Current Status -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                  order.status === 'In Transit' ? 'bg-blue-100 text-blue-600' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                ]">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <div class="font-medium text-gray-900">{{ order.status }}</div>
                <div class="text-sm text-gray-600">{{ formatDate(order.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Progress -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">🚚 Delivery Progress</h3>
        <div class="relative">
          <!-- Progress Line -->
          <div class="absolute top-5 left-6 right-6 h-0.5 bg-gray-200">
            <div 
              :class="[
                'h-full transition-all duration-500',
                order.status === 'Pending' ? 'w-0 bg-yellow-500' :
                order.status === 'In Transit' ? 'w-1/2 bg-blue-500' :
                order.status === 'Delivered' ? 'w-full bg-green-500' :
                'w-1/4 bg-red-500'
              ]"
            ></div>
          </div>
          
          <!-- Progress Steps -->
          <div class="relative flex justify-between">
            <!-- Pending -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all',
                order.status === 'Pending' ? 'border-yellow-500 text-yellow-600' : 'border-green-500 text-green-600'
              ]">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="mt-2 text-center">
                <div class="text-sm font-medium text-gray-900">Order Placed</div>
                <div class="text-xs text-gray-500">Ready for pickup</div>
              </div>
            </div>

            <!-- In Transit -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all',
                ['In Transit', 'Delivered'].includes(order.status) ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-400'
              ]">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
                </svg>
              </div>
              <div class="mt-2 text-center">
                <div class="text-sm font-medium text-gray-900">In Transit</div>
                <div class="text-xs text-gray-500">On the way</div>
              </div>
            </div>

            <!-- Delivered -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all',
                order.status === 'Delivered' ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-400'
              ]">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="mt-2 text-center">
                <div class="text-sm font-medium text-gray-900">Delivered</div>
                <div class="text-xs text-gray-500">Package received</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card bg-gray-50">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Need help with your order?</h3>
            <p class="text-sm text-gray-600">Contact our support team for assistance</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="copyTrackingNumber"
              class="btn-secondary flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy Tracking #
            </button>
            <button
              @click="trackOrder"
              class="btn-primary flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample Tracking Numbers -->
    <div v-if="!order" class="card bg-blue-50 border border-blue-200">
      <h3 class="font-medium text-blue-900 mb-3">📋 Don't have a tracking number?</h3>
      <p class="text-sm text-blue-800 mb-4">
        Tracking numbers are provided when you create an order. If you're testing the system, you can create a sample order first.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <router-link to="/orders/create" class="btn-primary">
          Create Sample Order
        </router-link>
        <router-link to="/orders" class="btn-secondary">
          View All Orders
        </router-link>
      </div>
    </div>

    <!-- Success/Error Toast -->
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
import { ref, computed } from 'vue'
import { useOrdersStore } from '../stores/orders.js'
import { useToast } from '../composables/useToast.js'

export default {
  name: 'TrackOrder',
  setup() {
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    // Local state
    const trackingNumber = ref('')
    const message = ref('')
    const messageType = ref('success')
    
    // Store-based state
    const order = computed(() => ordersStore.trackedOrder)
    const loading = computed(() => ordersStore.loading.tracking)
    const error = computed(() => ordersStore.errors.tracking)
    
    // Methods using store
    const trackOrder = async () => {
      if (!trackingNumber.value.trim()) return
      
      // Clear previous tracked order
      ordersStore.clearTrackedOrder()
      
      try {
        await ordersStore.trackOrder(trackingNumber.value.trim())
      } catch (err) {
        // Error is already handled by the store
        console.error('Error tracking order:', err)
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
    
    const getStatusTitle = (status) => {
      const titles = {
        'Pending': 'Order Received',
        'In Transit': 'On Its Way',
        'Delivered': 'Successfully Delivered',
        'Canceled': 'Order Canceled'
      }
      
      return titles[status] || 'Order Status'
    }
    
    const getStatusDescription = (status) => {
      const descriptions = {
        'Pending': 'Your order has been received and is being prepared for shipment.',
        'In Transit': 'Your order is currently being shipped and is on its way to the destination.',
        'Delivered': 'Your order has been successfully delivered to the recipient.',
        'Canceled': 'This order has been canceled and will not be shipped.'
      }
      
      return descriptions[status] || 'Status information not available.'
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
    
    const copyTrackingNumber = async () => {
      if (!order.value?.trackingNumber) return
      
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
      
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
    
    return {
      trackingNumber,
      order,
      loading,
      error,
      message,
      messageType,
      trackOrder,
      getStatusBadgeClass,
      getStatusTitle,
      getStatusDescription,
      formatDate,
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