<template>
  <transition-group 
    tag="div" 
    name="toast" 
    class="fixed top-4 right-4 z-50 space-y-2"
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
        'transform transition-all duration-300 ease-in-out'
      ]"
    >
      <div class="flex-1 w-0 p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg 
              v-if="toast.type === 'success'" 
              class="h-6 w-6 text-green-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <!-- Error Icon -->
            <svg 
              v-else-if="toast.type === 'error'" 
              class="h-6 w-6 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <!-- Warning Icon -->
            <svg 
              v-else-if="toast.type === 'warning'" 
              class="h-6 w-6 text-yellow-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            
            <!-- Info Icon -->
            <svg 
              v-else 
              class="h-6 w-6 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p 
              v-if="toast.title" 
              :class="[
                'text-sm font-medium',
                toast.type === 'success' ? 'text-green-900' :
                toast.type === 'error' ? 'text-red-900' :
                toast.type === 'warning' ? 'text-yellow-900' :
                'text-blue-900'
              ]"
            >
              {{ toast.title }}
            </p>
            <p 
              :class="[
                'text-sm',
                toast.title ? 'mt-1' : '',
                toast.type === 'success' ? 'text-green-700' :
                toast.type === 'error' ? 'text-red-700' :
                toast.type === 'warning' ? 'text-yellow-700' :
                'text-blue-700'
              ]"
            >
              {{ toast.message }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex border-l border-gray-200">
        <button
          @click="removeToast(toast.id)"
          class="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Progress bar for auto-dismiss -->
      <div 
        v-if="toast.autoDismiss && toast.duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden"
        :style="{ width: '100%' }"
      >
        <div 
          :class="[
            'h-full transition-all ease-linear',
            toast.type === 'success' ? 'bg-green-400' :
            toast.type === 'error' ? 'bg-red-400' :
            toast.type === 'warning' ? 'bg-yellow-400' :
            'bg-blue-400'
          ]"
          :style="{ 
            width: `${toast.progress}%`,
            transitionDuration: '100ms'
          }"
        ></div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Toast',
  props: {
    toasts: {
      type: Array,
      default: () => []
    }
  },
  emits: ['remove'],
  setup(props, { emit }) {
    let intervalId = null
    
    const removeToast = (id) => {
      emit('remove', id)
    }
    
    const updateProgress = () => {
      props.toasts.forEach(toast => {
        if (toast.autoDismiss && toast.duration > 0) {
          const elapsed = Date.now() - toast.startTime
          const remaining = Math.max(0, toast.duration - elapsed)
          toast.progress = ((toast.duration - remaining) / toast.duration) * 100
          
          if (remaining <= 0) {
            removeToast(toast.id)
          }
        }
      })
    }
    
    onMounted(() => {
      intervalId = setInterval(updateProgress, 100)
    })
    
    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })
    
    return {
      removeToast
    }
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease-out;
}
</style> 