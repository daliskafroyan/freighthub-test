<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p class="text-gray-600">Fill in the details below to create a new shipping order</p>
        </div>
        <router-link to="/orders" class="btn-secondary">
          Back to Orders
        </router-link>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="senderName" class="block text-sm font-medium text-gray-700 mb-2">
              Sender Name *
            </label>
            <input
              id="senderName"
              v-model="form.senderName"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.senderName ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Enter sender's full name"
              @blur="validateField('senderName')"
              @input="clearError('senderName')"
            />
            <p v-if="errors.senderName" class="mt-1 text-sm text-red-600 animate-shake">
              {{ errors.senderName }}
            </p>
          </div>

          <div>
            <label for="recipientName" class="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name *
            </label>
            <input
              id="recipientName"
              v-model="form.recipientName"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.recipientName ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Enter recipient's full name"
              @blur="validateField('recipientName')"
              @input="clearError('recipientName')"
            />
            <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600 animate-shake">
              {{ errors.recipientName }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="origin" class="block text-sm font-medium text-gray-700 mb-2">
              Origin *
            </label>
            <input
              id="origin"
              v-model="form.origin"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.origin ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="e.g., New York, NY"
              @blur="validateField('origin')"
              @input="clearError('origin')"
            />
            <p v-if="errors.origin" class="mt-1 text-sm text-red-600 animate-shake">
              {{ errors.origin }}
            </p>
          </div>

          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-2">
              Destination *
            </label>
            <input
              id="destination"
              v-model="form.destination"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.destination ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="e.g., Los Angeles, CA"
              @blur="validateField('destination')"
              @input="clearError('destination')"
            />
            <p v-if="errors.destination" class="mt-1 text-sm text-red-600 animate-shake">
              {{ errors.destination }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <router-link to="/orders" class="btn-secondary">
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ loading ? 'Creating Order...' : 'Create Order' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="error" class="card border-red-200 bg-red-50">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error Creating Order</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/orders.js'
import { useToast } from '../composables/useToast.js'

export default {
  name: 'OrderForm',
  setup() {
    const router = useRouter()
    const ordersStore = useOrdersStore()
    const toast = useToast()
    
    const form = ref({
      senderName: '',
      recipientName: '',
      origin: '',
      destination: ''
    })
    
    const errors = ref({})
    const loading = ref(false)
    const error = ref('')
    
    const isFormValid = computed(() => {
      return form.value.senderName.trim() &&
             form.value.recipientName.trim() &&
             form.value.origin.trim() &&
             form.value.destination.trim() &&
             Object.keys(errors.value).length === 0
    })
    
    const validateField = (fieldName) => {
      const value = form.value[fieldName].trim()
      
      switch (fieldName) {
        case 'senderName':
          if (!value) {
            errors.value[fieldName] = 'Sender name is required'
          } else if (value.length < 2) {
            errors.value[fieldName] = 'Sender name must be at least 2 characters'
          } else {
            delete errors.value[fieldName]
          }
          break
          
        case 'recipientName':
          if (!value) {
            errors.value[fieldName] = 'Recipient name is required'
          } else if (value.length < 2) {
            errors.value[fieldName] = 'Recipient name must be at least 2 characters'
          } else {
            delete errors.value[fieldName]
          }
          break
          
        case 'origin':
          if (!value) {
            errors.value[fieldName] = 'Origin is required'
          } else if (value.length < 2) {
            errors.value[fieldName] = 'Origin must be at least 2 characters'
          } else {
            delete errors.value[fieldName]
          }
          break
          
        case 'destination':
          if (!value) {
            errors.value[fieldName] = 'Destination is required'
          } else if (value.length < 2) {
            errors.value[fieldName] = 'Destination must be at least 2 characters'
          } else {
            delete errors.value[fieldName]
          }
          break
      }
    }
    
    const validateForm = () => {
      ['senderName', 'recipientName', 'origin', 'destination'].forEach(validateField)
      
      if (form.value.origin.trim().toLowerCase() === form.value.destination.trim().toLowerCase()) {
        errors.value.destination = 'Origin and destination cannot be the same'
      }
      
      return Object.keys(errors.value).length === 0
    }
    
    const clearError = (fieldName) => {
      if (errors.value[fieldName]) {
        delete errors.value[fieldName]
      }
    }
    
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        const orderData = {
          senderName: form.value.senderName.trim(),
          recipientName: form.value.recipientName.trim(),
          origin: form.value.origin.trim(),
          destination: form.value.destination.trim()
        }
        
        const newOrder = await ordersStore.createOrder(orderData)
        
        toast.orderCreated(newOrder.trackingNumber)
        
        router.push(`/orders/${newOrder.id}`)
        
      } catch (err) {
        console.error('Error creating order:', error)
        
        if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
          error.value = err.response.data.details.join(', ')
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to create order. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      const senderNameInput = document.getElementById('senderName')
      if (senderNameInput) {
        senderNameInput.focus()
      }
    })
    
    return {
      form,
      errors,
      loading,
      error,
      isFormValid,
      validateField,
      clearError,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style> 