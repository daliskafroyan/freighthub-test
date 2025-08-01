<template>
  <div id="app" class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">
              🚚 Logistics Tracking
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'Home' }"
            >
              📊 Dashboard
            </router-link>
            <router-link 
              to="/orders" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'OrdersList' || $route.name === 'OrderDetails' }"
            >
              📦 Orders
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
      <router-view />
    </main>

    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2024 Logistics Tracking App. Built with Vue.js & Node.js
        </p>
      </div>
    </footer>

    <!-- Global Toast Notifications -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script>
import Toast from './components/Toast.vue'
import { useToastState } from './composables/useToast.js'

export default { 
  name: 'App',
  components: {
    Toast
  },
  setup() {
    const { toasts } = useToastState()
    
    const removeToast = (id) => {
      const index = toasts.value.findIndex(toast => toast.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }
    
    return {
      toasts,
      removeToast
    }
  }
}
</script> 