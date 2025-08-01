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
              'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200',
              'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              errors.senderName ? 'border-red-300 bg-red-50 animate-pulse-border' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
            ]"
            placeholder="Enter sender's full name"
            @blur="markFieldTouched('senderName')"
            autocomplete="name"
          />
          <p v-if="errors.senderName" class="mt-1 text-sm text-red-600 animate-fade-in">
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
              'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200',
              'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              errors.recipientName ? 'border-red-300 bg-red-50 animate-pulse-border' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
            ]"
            placeholder="Enter recipient's full name"
            @blur="markFieldTouched('recipientName')"
            autocomplete="name"
          />
          <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600 animate-fade-in">
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
                'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.origin ? 'border-red-300 bg-red-50 animate-pulse-border' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              ]"
              placeholder="City, State or Full Address"
              @blur="markFieldTouched('origin')"
              autocomplete="address-line1"
            />
            <p v-if="errors.origin" class="mt-1 text-sm text-red-600 animate-fade-in">
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
                'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.destination ? 'border-red-300 bg-red-50 animate-pulse-border' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              ]"
              placeholder="City, State or Full Address"
              @blur="markFieldTouched('destination')"
              autocomplete="address-line1"
            />
            <p v-if="errors.destination" class="mt-1 text-sm text-red-600 animate-fade-in">
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
      <div v-if="successMessage" class="success-message">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-base font-semibold text-green-800 mb-1">
              🎉 Order Created Successfully!
            </h3>
            <div class="text-sm text-green-700">
              {{ successMessage }}
            </div>
            <div class="mt-2 text-xs text-green-600">
              Redirecting you to the orders page...
            </div>
          </div>
        </div>
      </div>

      <!-- API Error Message (fallback) -->
      <div v-if="apiError && !successMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-base font-semibold text-red-800 mb-1">
              ❌ Failed to Create Order
            </h3>
            <div class="text-sm text-red-700">
              {{ apiError }}
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
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/orders.js'
import { useToast } from '../composables/useToast.js'

export default {
  name: 'OrderForm',
  setup() {
    const router = useRouter()
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    // Form state
    const form = ref({
      senderName: '',
      recipientName: '',
      origin: '',
      destination: ''
    })
    
    // Store-based state
    const loading = computed(() => ordersStore.loading.creating)
    const apiError = computed(() => ordersStore.errors.creating)
    
    // Local UI state
    const successMessage = ref('')
    const errors = ref({})
    const fieldTouched = ref({
      senderName: false,
      recipientName: false,
      origin: false,
      destination: false
    })
    const isSubmitted = ref(false)
    
    // Enhanced form validation
    const validateField = (fieldName, value) => {
      let error = ''
      
      switch (fieldName) {
        case 'senderName':
          if (!value.trim()) {
            error = 'Sender name is required'
          } else if (value.trim().length < 2) {
            error = 'Sender name must be at least 2 characters'
          } else if (value.trim().length > 100) {
            error = 'Sender name must be less than 100 characters'
          } else if (!/^[a-zA-Z\s'-\.]+$/.test(value.trim())) {
            error = 'Sender name can only contain letters, spaces, hyphens, apostrophes, and periods'
          }
          break
          
        case 'recipientName':
          if (!value.trim()) {
            error = 'Recipient name is required'
          } else if (value.trim().length < 2) {
            error = 'Recipient name must be at least 2 characters'
          } else if (value.trim().length > 100) {
            error = 'Recipient name must be less than 100 characters'
          } else if (!/^[a-zA-Z\s'-\.]+$/.test(value.trim())) {
            error = 'Recipient name can only contain letters, spaces, hyphens, apostrophes, and periods'
          }
          break
          
        case 'origin':
          if (!value.trim()) {
            error = 'Origin address is required'
          } else if (value.trim().length < 2) {
            error = 'Origin address must be at least 2 characters'
          } else if (value.trim().length > 200) {
            error = 'Origin address must be less than 200 characters'
          }
          break
          
        case 'destination':
          if (!value.trim()) {
            error = 'Destination address is required'
          } else if (value.trim().length < 2) {
            error = 'Destination address must be at least 2 characters'
          } else if (value.trim().length > 200) {
            error = 'Destination address must be less than 200 characters'
          } else if (form.value.origin.trim() && 
                     value.trim().toLowerCase() === form.value.origin.trim().toLowerCase()) {
            error = 'Origin and destination cannot be the same'
          }
          break
      }
      
      return error
    }
    
    const validateForm = () => {
      const newErrors = {}
      
      // Validate all fields
      Object.keys(form.value).forEach(fieldName => {
        const error = validateField(fieldName, form.value[fieldName])
        if (error) {
          newErrors[fieldName] = error
        }
      })
      
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }
    
    // Real-time validation
    const validateFieldRealtime = (fieldName) => {
      if (fieldTouched.value[fieldName] || isSubmitted.value) {
        const error = validateField(fieldName, form.value[fieldName])
        if (error) {
          errors.value = { ...errors.value, [fieldName]: error }
        } else {
          const newErrors = { ...errors.value }
          delete newErrors[fieldName]
          errors.value = newErrors
        }
      }
    }
    
    // Mark field as touched
    const markFieldTouched = (fieldName) => {
      fieldTouched.value[fieldName] = true
      validateFieldRealtime(fieldName)
    }
    
    // Computed properties
    const isFormValid = computed(() => {
      return form.value.senderName.trim() && 
             form.value.recipientName.trim() && 
             form.value.origin.trim() && 
             form.value.destination.trim() &&
             Object.keys(errors.value).length === 0
    })
    
    // Watch for form changes for real-time validation
    Object.keys(form.value).forEach(fieldName => {
      watch(() => form.value[fieldName], () => {
        validateFieldRealtime(fieldName)
      })
    })
    
    // Watch for API errors to show toast notifications
    watch(apiError, (newError) => {
      if (newError) {
        toast.error(newError, { title: 'Failed to Create Order' })
      }
    })
    
    // Methods
    const resetForm = () => {
      form.value = {
        senderName: '',
        recipientName: '',
        origin: '',
        destination: ''
      }
      errors.value = {}
      fieldTouched.value = {
        senderName: false,
        recipientName: false,
        origin: false,
        destination: false
      }
      isSubmitted.value = false
      successMessage.value = ''
      ordersStore.clearError('creating')
      
      // Focus first field
      nextTick(() => {
        const firstInput = document.getElementById('senderName')
        if (firstInput) firstInput.focus()
      })
    }
    
    const submitOrder = async () => {
      isSubmitted.value = true
      
      // Validate form
      if (!validateForm()) {
        toast.validationError('Please correct the highlighted errors before submitting.')
        
        // Focus first error field
        nextTick(() => {
          const firstErrorField = Object.keys(errors.value)[0]
          if (firstErrorField) {
            const errorInput = document.getElementById(firstErrorField)
            if (errorInput) errorInput.focus()
          }
        })
        return
      }
      
      // Clear previous messages
      ordersStore.clearError('creating')
      successMessage.value = ''
      
      try {
        const order = await ordersStore.createOrder({
          senderName: form.value.senderName.trim(),
          recipientName: form.value.recipientName.trim(),
          origin: form.value.origin.trim(),
          destination: form.value.destination.trim()
        })
        
        // Success toast notification
        toast.orderCreated(order.trackingNumber)
        
        // Also set local success message for the form
        successMessage.value = `Order created successfully! Tracking number: ${order.trackingNumber}`
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/orders')
        }, 2500)
        
      } catch (error) {
        console.error('Error creating order:', error)
        
        // Show specific error toast if not handled by watcher
        if (!apiError.value) {
          toast.error('Failed to create order. Please try again.', { 
            title: 'Creation Failed' 
          })
        }
      }
    }
    
    // Auto-focus first field on mount
    onMounted(() => {
      nextTick(() => {
        const firstInput = document.getElementById('senderName')
        if (firstInput) firstInput.focus()
      })
    })
    
    return {
      form,
      loading,
      apiError,
      successMessage,
      errors,
      fieldTouched,
      isSubmitted,
      isFormValid,
      validateForm,
      validateFieldRealtime,
      markFieldTouched,
      resetForm,
      submitOrder
    }
  }
}
</script>

<style scoped>
/* Enhanced styling for better UX */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* Pulse animation for error borders */
@keyframes pulse-border {
  0%, 100% {
    border-color: rgb(252 165 165); /* red-300 */
  }
  50% {
    border-color: rgb(239 68 68); /* red-500 */
  }
}

.animate-pulse-border {
  animation: pulse-border 1s ease-in-out;
}

/* Fade in animation for error messages */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Shake animation for validation errors */
@keyframes shake {
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Enhanced button styles */
button:disabled {
  @apply cursor-not-allowed opacity-50;
}

button:not(:disabled):hover {
  @apply transform scale-105 transition-transform duration-150;
}

/* Focus improvements */
input:focus {
  @apply ring-2 ring-primary-500 ring-opacity-50;
}

/* Success message styling */
.success-message {
  @apply bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg;
  animation: fade-in 0.5s ease-out;
}

/* Loading state improvements */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 