<template>
  <div class="space-y-6">
    <div v-if="loading" class="card text-center py-12">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span class="ml-3 text-gray-600">Loading order details...</span>
      </div>
    </div>

    <div v-else-if="error" class="card text-center py-12">
      <div class="text-red-600">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg font-medium">{{ error }}</p>
        <button @click="fetchOrder" class="mt-4 btn-primary">Try Again</button>
      </div>
    </div>

    <div v-else-if="order" class="space-y-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Order Details</h1>
            <p class="text-gray-600">Tracking number: {{ order.trackingNumber }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span :class="getStatusBadgeClass(order.status)">
              {{ order.status }}
            </span>
            <router-link to="/orders" class="btn-secondary">
              Back to Orders
            </router-link>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900 mb-4">📦 Order Summary</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tracking Number</label>
              <div class="mt-1 flex items-center">
                <span class="text-lg font-mono text-gray-900">{{ order.trackingNumber }}</span>
                <button
                  @click="copyToClipboard(order.trackingNumber)"
                  class="ml-2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy to clipboard"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <div class="mt-1">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Created</label>
              <div class="mt-1 text-gray-900">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Updated</label>
              <div class="mt-1 text-gray-900">{{ formatDate(order.updatedAt) }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-medium text-gray-900 mb-4">📍 Route Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Origin</label>
              <div class="mt-1 text-gray-900">{{ order.origin }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Destination</label>
              <div class="mt-1 text-gray-900">{{ order.destination }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Route</label>
              <div class="mt-1 text-gray-900">{{ order.route }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-lg font-medium text-gray-900 mb-4">👤 Sender Information</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <div class="mt-1 text-gray-900">{{ order.senderName }}</div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-medium text-gray-900 mb-4">👤 Recipient Information</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <div class="mt-1 text-gray-900">{{ order.recipientName }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">📅 Order Timeline</h2>
        <div v-if="order.statusHistory && order.statusHistory.length > 0" class="space-y-4">
          <div
            v-for="(entry, index) in order.statusHistory"
            :key="entry.id"
            class="flex items-start relative"
          >
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
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ entry.description }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(entry.timestamp) }}</p>
                  <p v-if="entry.notes" class="text-sm text-gray-600 mt-1">{{ entry.notes }}</p>
                </div>
                <div class="text-xs text-gray-400">Step {{ entry.stepNumber }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>No timeline information available</p>
        </div>
      </div>

      <div v-if="order.status === 'Pending'" class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">⚙️ Order Actions</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
            <div class="flex items-center space-x-3">
              <select
                v-model="newStatus"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select new status</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>
              <button
                @click="updateOrderStatus"
                :disabled="!newStatus || updatingStatus"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ updatingStatus ? 'Updating...' : 'Update Status' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="order.status === 'Pending'" class="card border-red-200 bg-red-50">
        <h2 class="text-lg font-medium text-red-900 mb-4">⚠️ Danger Zone</h2>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-red-700 mb-4">
              Canceling an order will mark it as canceled and prevent any further status changes.
            </p>
            <button
              @click="cancelOrder"
              :disabled="cancelling"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/orders.js'
import { useToast } from '../composables/useToast.js'

export default {
  name: 'OrderDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    const newStatus = ref('')
    const updatingStatus = ref(false)
    const cancelling = ref(false)
    
    const order = computed(() => ordersStore.currentOrder)
    const loading = computed(() => ordersStore.loading.currentOrder)
    const error = computed(() => ordersStore.errors.currentOrder)
    
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
    
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy to clipboard')
      }
    }
    
    const fetchOrder = async () => {
      try {
        await ordersStore.fetchOrderById(props.id)
      } catch (err) {
        console.error('Error fetching order:', err)
      }
    }
    
    const updateOrderStatus = async () => {
      if (!newStatus.value) return
      
      updatingStatus.value = true
      
      try {
        await ordersStore.updateOrderStatus(props.id, newStatus.value)
        toast.success(`Order status updated to ${newStatus.value}`)
        newStatus.value = ''
        await fetchOrder()
      } catch (err) {
        console.error('Error updating order status:', err)
        const errorMessage = ordersStore.errors.updating || 'Failed to update order status'
        toast.error(errorMessage)
      } finally {
        updatingStatus.value = false
      }
    }
    
    const cancelOrder = async () => {
      if (!confirm(`Are you sure you want to cancel order ${order.value.trackingNumber}? This action cannot be undone.`)) {
        return
      }
      
      cancelling.value = true
      
      try {
        await ordersStore.cancelOrder(props.id)
        toast.orderCanceled(order.value.trackingNumber)
        await fetchOrder()
      } catch (err) {
        console.error('Error cancelling order:', err)
        const errorMessage = ordersStore.errors.deleting || 'Failed to cancel order'
        toast.error(errorMessage)
      } finally {
        cancelling.value = false
      }
    }
    
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
      getStatusBadgeClass,
      formatDate,
      copyToClipboard,
      fetchOrder,
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