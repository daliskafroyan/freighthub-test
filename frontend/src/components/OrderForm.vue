<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">🚚 Create New Order</h1>
      <p class="text-gray-600">Fill out the form below to create a new shipping order with automatic tracking number generation.</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitOrder" class="card space-y-6">
      <!-- Sender Information -->
      <div class="border-b border-gray-200 pb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">📤 Sender Information</h2>
        
        <div>
          <label for="senderName" class="block text-sm font-medium text-gray-700 mb-2">
            Sender Name *
          </label>
          <input
            id="senderName"
            v-model="form.senderName"
            type="text"
            required
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
              'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              errors.senderName ? 'border-red-300 bg-red-50' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
            ]"
            placeholder="Enter sender's full name"
          />
          <p v-if="errors.senderName" class="mt-1 text-sm text-red-600">
            {{ errors.senderName }}
          </p>
        </div>
      </div>

      <!-- Recipient Information -->
      <div class="border-b border-gray-200 pb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">📥 Recipient Information</h2>
        
        <div>
          <label for="recipientName" class="block text-sm font-medium text-gray-700 mb-2">
            Recipient Name *
          </label>
          <input
            id="recipientName"
            v-model="form.recipientName"
            type="text"
            required
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
              'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              errors.recipientName ? 'border-red-300 bg-red-50' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
            ]"
            placeholder="Enter recipient's full name"
          />
          <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600">
            {{ errors.recipientName }}
          </p>
        </div>
      </div>

      <!-- Shipping Information -->
      <div class="pb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">📍 Shipping Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Origin -->
          <div>
            <label for="origin" class="block text-sm font-medium text-gray-700 mb-2">
              Origin Address *
            </label>
            <input
              id="origin"
              v-model="form.origin"
              type="text"
              required
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.origin ? 'border-red-300 bg-red-50' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              ]"
              placeholder="City, State or Full Address"
            />
            <p v-if="errors.origin" class="mt-1 text-sm text-red-600">
              {{ errors.origin }}
            </p>
          </div>

          <!-- Destination -->
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-2">
              Destination Address *
            </label>
            <input
              id="destination"
              v-model="form.destination"
              type="text"
              required
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              ]"
              placeholder="City, State or Full Address"
            />
            <p v-if="errors.destination" class="mt-1 text-sm text-red-600">
              {{ errors.destination }}
            </p>
          </div>
        </div>

        <!-- Route Preview -->
        <div v-if="form.origin && form.destination" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center text-sm text-blue-800">
            <span class="font-medium">📍 Route Preview:</span>
            <span class="ml-2">{{ form.origin }}</span>
            <span class="mx-2">→</span>
            <span>{{ form.destination }}</span>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="apiError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error Creating Order
            </h3>
            <div class="mt-1 text-sm text-red-700">
              {{ apiError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Order Created Successfully!
            </h3>
            <div class="mt-1 text-sm text-green-700">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-between pt-4 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <router-link 
          to="/orders"
          class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Orders
        </router-link>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="resetForm"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating Order...' : '🚚 Create Order' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'OrderForm',
  setup() {
    const router = useRouter()
    
    // Form state
    const form = ref({
      senderName: '',
      recipientName: '',
      origin: '',
      destination: ''
    })
    
    // UI state
    const loading = ref(false)
    const apiError = ref('')
    const successMessage = ref('')
    const errors = ref({})
    
    // Form validation
    const validateForm = () => {
      const newErrors = {}
      
      // Sender name validation
      if (!form.value.senderName.trim()) {
        newErrors.senderName = 'Sender name is required'
      } else if (form.value.senderName.trim().length < 2) {
        newErrors.senderName = 'Sender name must be at least 2 characters'
      } else if (form.value.senderName.trim().length > 100) {
        newErrors.senderName = 'Sender name must be less than 100 characters'
      }
      
      // Recipient name validation
      if (!form.value.recipientName.trim()) {
        newErrors.recipientName = 'Recipient name is required'
      } else if (form.value.recipientName.trim().length < 2) {
        newErrors.recipientName = 'Recipient name must be at least 2 characters'
      } else if (form.value.recipientName.trim().length > 100) {
        newErrors.recipientName = 'Recipient name must be less than 100 characters'
      }
      
      // Origin validation
      if (!form.value.origin.trim()) {
        newErrors.origin = 'Origin address is required'
      } else if (form.value.origin.trim().length < 2) {
        newErrors.origin = 'Origin address must be at least 2 characters'
      } else if (form.value.origin.trim().length > 200) {
        newErrors.origin = 'Origin address must be less than 200 characters'
      }
      
      // Destination validation
      if (!form.value.destination.trim()) {
        newErrors.destination = 'Destination address is required'
      } else if (form.value.destination.trim().length < 2) {
        newErrors.destination = 'Destination address must be at least 2 characters'
      } else if (form.value.destination.trim().length > 200) {
        newErrors.destination = 'Destination address must be less than 200 characters'
      }
      
      // Cross-field validation
      if (form.value.origin.trim() && form.value.destination.trim() && 
          form.value.origin.trim().toLowerCase() === form.value.destination.trim().toLowerCase()) {
        newErrors.origin = 'Origin and destination cannot be the same'
        newErrors.destination = 'Origin and destination cannot be the same'
      }
      
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }
    
    // Computed properties
    const isFormValid = computed(() => {
      return form.value.senderName.trim() && 
             form.value.recipientName.trim() && 
             form.value.origin.trim() && 
             form.value.destination.trim() &&
             Object.keys(errors.value).length === 0
    })
    
    // Watch for form changes to clear errors
    watch(form, () => {
      if (Object.keys(errors.value).length > 0) {
        validateForm()
      }
      // Clear messages when form changes
      if (apiError.value) apiError.value = ''
      if (successMessage.value) successMessage.value = ''
    }, { deep: true })
    
    // Methods
    const resetForm = () => {
      form.value = {
        senderName: '',
        recipientName: '',
        origin: '',
        destination: ''
      }
      errors.value = {}
      apiError.value = ''
      successMessage.value = ''
    }
    
    const submitOrder = async () => {
      // Validate form
      if (!validateForm()) {
        return
      }
      
      loading.value = true
      apiError.value = ''
      successMessage.value = ''
      
      try {
        const response = await axios.post('/api/orders', {
          senderName: form.value.senderName.trim(),
          recipientName: form.value.recipientName.trim(),
          origin: form.value.origin.trim(),
          destination: form.value.destination.trim()
        })
        
        // Success
        const order = response.data.order
        successMessage.value = `Order created with tracking number: ${order.trackingNumber}`
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push('/orders')
        }, 2000)
        
      } catch (error) {
        console.error('Error creating order:', error)
        
        if (error.response?.data?.details) {
          // Handle validation errors from backend
          apiError.value = error.response.data.details.join(', ')
        } else if (error.response?.data?.message) {
          apiError.value = error.response.data.message
        } else if (error.response?.status === 500) {
          apiError.value = 'Server error. Please try again later.'
        } else if (error.request) {
          apiError.value = 'Network error. Please check your connection and try again.'
        } else {
          apiError.value = 'An unexpected error occurred. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      apiError,
      successMessage,
      errors,
      isFormValid,
      validateForm,
      resetForm,
      submitOrder
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style> 