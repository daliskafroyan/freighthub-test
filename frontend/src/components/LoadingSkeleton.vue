<template>
  <div :class="containerClass">
    <!-- Card Skeleton -->
    <div v-if="variant === 'card'" class="animate-pulse">
      <div class="bg-gray-200 rounded-lg h-4 w-3/4 mb-4"></div>
      <div class="space-y-3">
        <div class="bg-gray-200 rounded h-3 w-full"></div>
        <div class="bg-gray-200 rounded h-3 w-5/6"></div>
        <div class="bg-gray-200 rounded h-3 w-4/6"></div>
      </div>
      <div class="mt-4 flex space-x-2">
        <div class="bg-gray-200 rounded h-8 w-20"></div>
        <div class="bg-gray-200 rounded h-8 w-16"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="variant === 'list'" class="animate-pulse space-y-4">
      <div v-for="i in (rows || 5)" :key="i" class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="bg-gray-200 rounded h-4 w-3/4"></div>
          <div class="bg-gray-200 rounded h-3 w-1/2"></div>
        </div>
        <div class="bg-gray-200 rounded h-6 w-16"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="variant === 'table'" class="animate-pulse">
      <!-- Table Header -->
      <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-4">
        <div class="grid grid-cols-5 gap-4">
          <div class="bg-gray-200 rounded h-4"></div>
          <div class="bg-gray-200 rounded h-4"></div>
          <div class="bg-gray-200 rounded h-4"></div>
          <div class="bg-gray-200 rounded h-4"></div>
          <div class="bg-gray-200 rounded h-4"></div>
        </div>
      </div>
      <!-- Table Rows -->
      <div class="divide-y divide-gray-100">
        <div v-for="i in (rows || 8)" :key="i" class="p-4">
          <div class="grid grid-cols-5 gap-4 items-center">
            <div class="bg-gray-200 rounded h-3"></div>
            <div class="bg-gray-200 rounded h-3"></div>
            <div class="bg-gray-200 rounded h-3"></div>
            <div class="bg-gray-200 rounded h-6 w-16"></div>
            <div class="flex space-x-2">
              <div class="bg-gray-200 rounded h-6 w-12"></div>
              <div class="bg-gray-200 rounded h-6 w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Skeleton -->
    <div v-else-if="variant === 'form'" class="animate-pulse space-y-6">
      <div class="space-y-4">
        <div class="bg-gray-200 rounded h-6 w-1/4 mb-2"></div>
        <div class="space-y-3">
          <div class="bg-gray-200 rounded h-4 w-1/6 mb-1"></div>
          <div class="bg-gray-200 rounded-lg h-10 w-full"></div>
        </div>
        <div class="space-y-3">
          <div class="bg-gray-200 rounded h-4 w-1/6 mb-1"></div>
          <div class="bg-gray-200 rounded-lg h-10 w-full"></div>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="bg-gray-200 rounded h-6 w-1/3 mb-2"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="bg-gray-200 rounded h-4 w-1/2 mb-1"></div>
            <div class="bg-gray-200 rounded-lg h-10 w-full"></div>
          </div>
          <div class="space-y-3">
            <div class="bg-gray-200 rounded h-4 w-1/2 mb-1"></div>
            <div class="bg-gray-200 rounded-lg h-10 w-full"></div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <div class="bg-gray-200 rounded h-10 w-20"></div>
        <div class="bg-gray-200 rounded h-10 w-32"></div>
      </div>
    </div>

    <!-- Stats/Dashboard Skeleton -->
    <div v-else-if="variant === 'stats'" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="ml-4 flex-1">
              <div class="bg-gray-200 rounded h-4 w-16 mb-2"></div>
              <div class="bg-gray-200 rounded h-6 w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Page Skeleton -->
    <div v-else-if="variant === 'detail'" class="animate-pulse space-y-6">
      <!-- Header -->
      <div class="space-y-2">
        <div class="bg-gray-200 rounded h-8 w-2/3"></div>
        <div class="bg-gray-200 rounded h-4 w-1/2"></div>
      </div>
      
      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <div class="bg-gray-200 rounded h-6 w-1/3 mb-4"></div>
            <div class="space-y-3">
              <div class="bg-gray-200 rounded h-4"></div>
              <div class="bg-gray-200 rounded h-4 w-5/6"></div>
              <div class="bg-gray-200 rounded h-4 w-4/6"></div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <div class="bg-gray-200 rounded h-6 w-1/4 mb-4"></div>
            <div class="space-y-4">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="bg-gray-200 rounded h-4 w-1/3"></div>
                  <div class="bg-gray-200 rounded h-3 w-1/2"></div>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="bg-gray-200 rounded h-4 w-1/4"></div>
                  <div class="bg-gray-200 rounded h-3 w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <div class="bg-gray-200 rounded h-6 w-1/2 mb-4"></div>
            <div class="space-y-3">
              <div class="bg-gray-200 rounded h-4 w-1/3"></div>
              <div class="bg-gray-200 rounded-lg h-10"></div>
              <div class="bg-gray-200 rounded h-8"></div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <div class="bg-gray-200 rounded h-6 w-2/3 mb-4"></div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <div class="bg-gray-200 rounded h-3 w-1/3"></div>
                <div class="bg-gray-200 rounded h-3 w-1/4"></div>
              </div>
              <div class="flex justify-between">
                <div class="bg-gray-200 rounded h-3 w-1/4"></div>
                <div class="bg-gray-200 rounded h-3 w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generic Text Skeleton -->
    <div v-else class="animate-pulse space-y-4">
      <div class="bg-gray-200 rounded h-6 w-1/2"></div>
      <div class="space-y-2">
        <div class="bg-gray-200 rounded h-4"></div>
        <div class="bg-gray-200 rounded h-4 w-5/6"></div>
        <div class="bg-gray-200 rounded h-4 w-4/6"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    variant: {
      type: String,
      default: 'text',
      validator: (value) => [
        'text', 'card', 'list', 'table', 'form', 'stats', 'detail'
      ].includes(value)
    },
    rows: {
      type: Number,
      default: null
    },
    class: {
      type: String,
      default: ''
    }
  },
  computed: {
    containerClass() {
      const baseClass = 'loading-skeleton'
      return this.class ? `${baseClass} ${this.class}` : baseClass
    }
  }
}
</script>

<style scoped>
.loading-skeleton {
  @apply w-full;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.animate-pulse > div {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style> 