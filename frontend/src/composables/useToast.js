import { ref, reactive } from 'vue'

// Global toast state
const toasts = ref([])
let toastId = 0

export function useToast() {
  const addToast = (options) => {
    const toast = {
      id: ++toastId,
      type: options.type || 'info', // success, error, warning, info
      title: options.title || '',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 5000, // 5 seconds default, 0 = no auto-dismiss
      autoDismiss: options.autoDismiss !== false, // true by default
      startTime: Date.now(),
      progress: 0
    }
    
    toasts.value.push(toast)
    
    // Auto-dismiss if enabled and duration > 0
    if (toast.autoDismiss && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }
    
    return toast.id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value.splice(0)
  }
  
  // Convenience methods for different toast types
  const success = (message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      title: options.title || 'Success',
      duration: options.duration,
      autoDismiss: options.autoDismiss
    })
  }
  
  const error = (message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      title: options.title || 'Error',
      duration: options.duration !== undefined ? options.duration : 8000, // Longer for errors
      autoDismiss: options.autoDismiss
    })
  }
  
  const warning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      duration: options.duration !== undefined ? options.duration : 6000,
      autoDismiss: options.autoDismiss
    })
  }
  
  const info = (message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      title: options.title || 'Info',
      duration: options.duration,
      autoDismiss: options.autoDismiss
    })
  }
  
  // Validation-specific toasts
  const validationError = (message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      title: options.title || 'Validation Error',
      duration: options.duration !== undefined ? options.duration : 6000,
      autoDismiss: options.autoDismiss
    })
  }
  
  const networkError = (message = 'Network error. Please check your connection.', options = {}) => {
    return addToast({
      type: 'error',
      message,
      title: options.title || 'Connection Error',
      duration: options.duration !== undefined ? options.duration : 10000, // Longer for network errors
      autoDismiss: options.autoDismiss
    })
  }
  
  // Order-specific convenience methods
  const orderCreated = (trackingNumber, options = {}) => {
    return success(
      `Order created successfully with tracking number: ${trackingNumber}`,
      { 
        title: 'Order Created',
        duration: options.duration !== undefined ? options.duration : 7000,
        ...options 
      }
    )
  }
  
  const orderUpdated = (message = 'Order updated successfully', options = {}) => {
    return success(message, { 
      title: 'Order Updated',
      ...options 
    })
  }
  
  const orderCanceled = (trackingNumber, options = {}) => {
    return success(
      `Order ${trackingNumber} has been canceled successfully`,
      { 
        title: 'Order Canceled',
        ...options 
      }
    )
  }
  
  const orderNotFound = (trackingNumber, options = {}) => {
    return error(
      `No order found with tracking number "${trackingNumber}". Please check and try again.`,
      { 
        title: 'Order Not Found',
        ...options 
      }
    )
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    validationError,
    networkError,
    orderCreated,
    orderUpdated,
    orderCanceled,
    orderNotFound
  }
}

// For use in components that need reactive toast state
export const useToastState = () => {
  return {
    toasts
  }
} 