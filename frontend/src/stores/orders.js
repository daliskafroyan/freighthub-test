import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    // Orders data
    orders: [],
    currentOrder: null,
    
    // Loading states
    loading: {
      orders: false,
      currentOrder: false,
      creating: false,
      updating: false,
      deleting: false,
      tracking: false
    },
    
    // Error states
    errors: {
      orders: null,
      currentOrder: null,
      creating: null,
      updating: null,
      deleting: null,
      tracking: null
    },
    
    // Pagination and filtering
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false
    },
    
    // Filter state
    filters: {
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    },
    
    // Track order state
    trackedOrder: null
  }),

  getters: {
    // Filter orders by status
    ordersByStatus: (state) => (status) => {
      return state.orders.filter(order => order.status === status)
    },
    
    // Get pending orders
    pendingOrders: (state) => {
      return state.orders.filter(order => order.status === 'Pending')
    },
    
    // Get in transit orders
    inTransitOrders: (state) => {
      return state.orders.filter(order => order.status === 'In Transit')
    },
    
    // Get delivered orders
    deliveredOrders: (state) => {
      return state.orders.filter(order => order.status === 'Delivered')
    },
    
    // Get canceled orders
    canceledOrders: (state) => {
      return state.orders.filter(order => order.status === 'Canceled')
    },
    
    // Get orders count by status
    ordersCount: (state) => {
      return {
        total: state.orders.length,
        pending: state.orders.filter(order => order.status === 'Pending').length,
        inTransit: state.orders.filter(order => order.status === 'In Transit').length,
        delivered: state.orders.filter(order => order.status === 'Delivered').length,
        canceled: state.orders.filter(order => order.status === 'Canceled').length
      }
    },
    
    // Check if any operation is loading
    isLoading: (state) => {
      return Object.values(state.loading).some(loading => loading)
    },
    
    // Check if there are any errors
    hasErrors: (state) => {
      return Object.values(state.errors).some(error => error !== null)
    },
    
    // Get all errors as array
    allErrors: (state) => {
      return Object.values(state.errors).filter(error => error !== null)
    },
    
    // Find order by ID
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === parseInt(id))
    },
    
    // Find order by tracking number
    getOrderByTrackingNumber: (state) => (trackingNumber) => {
      return state.orders.find(order => order.trackingNumber === trackingNumber)
    }
  },

  actions: {
    // Clear all errors
    clearErrors() {
      this.errors = {
        orders: null,
        currentOrder: null,
        creating: null,
        updating: null,
        deleting: null,
        tracking: null
      }
    },
    
    // Clear specific error
    clearError(type) {
      if (this.errors.hasOwnProperty(type)) {
        this.errors[type] = null
      }
    },
    
    // Set loading state
    setLoading(type, loading) {
      if (this.loading.hasOwnProperty(type)) {
        this.loading[type] = loading
      }
    },
    
    // Set error state
    setError(type, error) {
      if (this.errors.hasOwnProperty(type)) {
        this.errors[type] = error
      }
    },
    
    // Update filters
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    
    // Reset filters
    resetFilters() {
      this.filters = {
        status: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
    },
    
    // Fetch orders with pagination and filtering
    async fetchOrders(options = {}) {
      const {
        page = this.pagination.currentPage,
        limit = this.pagination.ordersPerPage,
        status = this.filters.status,
        sortBy = this.filters.sortBy,
        sortOrder = this.filters.sortOrder
      } = options
      
      this.setLoading('orders', true)
      this.clearError('orders')
      
      try {
        const params = {
          page,
          limit,
          sortBy,
          sortOrder
        }
        
        if (status) {
          params.status = status
        }
        
        const response = await axios.get('/api/orders', { params })
        
        // Update orders
        this.orders = response.data.orders || []
        
        // Update pagination
        this.pagination = {
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalOrders: response.data.pagination?.totalOrders || 0,
          ordersPerPage: response.data.pagination?.ordersPerPage || 10,
          hasNextPage: response.data.pagination?.hasNextPage || false,
          hasPreviousPage: response.data.pagination?.hasPreviousPage || false
        }
        
        return response.data
        
      } catch (error) {
        console.error('Error fetching orders:', error)
        
        let errorMessage = 'Failed to fetch orders. '
        
        if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.request) {
          errorMessage += 'Network error. Please check your connection.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('orders', errorMessage)
        throw error
        
      } finally {
        this.setLoading('orders', false)
      }
    },
    
    // Fetch single order by ID
    async fetchOrderById(id) {
      this.setLoading('currentOrder', true)
      this.clearError('currentOrder')
      
      try {
        const response = await axios.get(`/api/orders/${id}`)
        this.currentOrder = response.data.order
        
        // Also update the order in the orders array if it exists
        const index = this.orders.findIndex(order => order.id === parseInt(id))
        if (index !== -1) {
          this.orders[index] = response.data.order
        }
        
        return response.data.order
        
      } catch (error) {
        console.error('Error fetching order:', error)
        
        let errorMessage = 'Failed to fetch order details. '
        
        if (error.response?.status === 404) {
          errorMessage += 'Order not found.'
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.request) {
          errorMessage += 'Network error. Please check your connection.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('currentOrder', errorMessage)
        throw error
        
      } finally {
        this.setLoading('currentOrder', false)
      }
    },
    
    // Create new order
    async createOrder(orderData) {
      this.setLoading('creating', true)
      this.clearError('creating')
      
      try {
        const response = await axios.post('/api/orders', orderData)
        const newOrder = response.data.order
        
        // Add to beginning of orders array
        this.orders.unshift(newOrder)
        
        // Update pagination total
        this.pagination.totalOrders += 1
        
        return newOrder
        
      } catch (error) {
        console.error('Error creating order:', error)
        
        let errorMessage = 'Failed to create order. '
        
        if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
          errorMessage += error.response.data.details.join(', ')
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.request) {
          errorMessage += 'Network error. Please check your connection.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('creating', errorMessage)
        throw error
        
      } finally {
        this.setLoading('creating', false)
      }
    },
    
    // Update order status
    async updateOrderStatus(orderId, newStatus) {
      this.setLoading('updating', true)
      this.clearError('updating')
      
      try {
        const response = await axios.put(`/api/orders/${orderId}/status`, {
          status: newStatus
        })
        
        const updatedOrder = response.data.order
        
        // Update order in orders array
        const index = this.orders.findIndex(order => order.id === parseInt(orderId))
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...updatedOrder }
        }
        
        // Update current order if it's the same
        if (this.currentOrder && this.currentOrder.id === parseInt(orderId)) {
          this.currentOrder = { ...this.currentOrder, ...updatedOrder }
        }
        
        return updatedOrder
        
      } catch (error) {
        console.error('Error updating order status:', error)
        
        let errorMessage = 'Failed to update order status. '
        
        if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.response?.status === 400) {
          errorMessage += 'Invalid status change requested.'
        } else if (error.request) {
          errorMessage += 'Network error. Please try again.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('updating', errorMessage)
        throw error
        
      } finally {
        this.setLoading('updating', false)
      }
    },
    
    // Cancel order (delete)
    async cancelOrder(orderId) {
      this.setLoading('deleting', true)
      this.clearError('deleting')
      
      try {
        await axios.delete(`/api/orders/${orderId}`)
        
        // Remove order from orders array
        this.orders = this.orders.filter(order => order.id !== parseInt(orderId))
        
        // Update pagination total
        this.pagination.totalOrders = Math.max(0, this.pagination.totalOrders - 1)
        
        // Clear current order if it's the same
        if (this.currentOrder && this.currentOrder.id === parseInt(orderId)) {
          this.currentOrder = null
        }
        
        return true
        
      } catch (error) {
        console.error('Error canceling order:', error)
        
        let errorMessage = 'Failed to cancel order. '
        
        if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.response?.status === 400) {
          errorMessage += 'Order cannot be canceled in its current state.'
        } else if (error.request) {
          errorMessage += 'Network error. Please try again.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('deleting', errorMessage)
        throw error
        
      } finally {
        this.setLoading('deleting', false)
      }
    },
    
    // Track order by tracking number
    async trackOrder(trackingNumber) {
      this.setLoading('tracking', true)
      this.clearError('tracking')
      
      try {
        const response = await axios.get(`/api/orders/track/${trackingNumber}`)
        this.trackedOrder = response.data.tracking
        
        return response.data.tracking
        
      } catch (error) {
        console.error('Error tracking order:', error)
        
        let errorMessage = 'Failed to track order. '
        
        if (error.response?.status === 404) {
          errorMessage += `No order found with tracking number "${trackingNumber}".`
        } else if (error.response?.status === 400) {
          errorMessage += 'Invalid tracking number format.'
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else if (error.request) {
          errorMessage += 'Network error. Please check your connection.'
        } else {
          errorMessage += 'Please try again.'
        }
        
        this.setError('tracking', errorMessage)
        throw error
        
      } finally {
        this.setLoading('tracking', false)
      }
    },
    
    // Clear tracked order
    clearTrackedOrder() {
      this.trackedOrder = null
      this.clearError('tracking')
    },
    
    // Refresh orders (re-fetch with current filters)
    async refreshOrders() {
      return this.fetchOrders({
        page: this.pagination.currentPage,
        limit: this.pagination.ordersPerPage,
        status: this.filters.status,
        sortBy: this.filters.sortBy,
        sortOrder: this.filters.sortOrder
      })
    },
    
    // Go to next page
    async nextPage() {
      if (this.pagination.hasNextPage) {
        return this.fetchOrders({
          page: this.pagination.currentPage + 1
        })
      }
    },
    
    // Go to previous page
    async previousPage() {
      if (this.pagination.hasPreviousPage) {
        return this.fetchOrders({
          page: this.pagination.currentPage - 1
        })
      }
    },
    
    // Go to specific page
    async goToPage(page) {
      return this.fetchOrders({ page })
    },
    
    // Filter orders by status
    async filterByStatus(status) {
      this.updateFilters({ status })
      return this.fetchOrders({
        page: 1, // Reset to first page when filtering
        status
      })
    },
    
    // Sort orders
    async sortOrders(sortBy, sortOrder = 'DESC') {
      this.updateFilters({ sortBy, sortOrder })
      return this.fetchOrders({
        page: 1, // Reset to first page when sorting
        sortBy,
        sortOrder
      })
    },
    
    // Initialize store (call this when app starts)
    async initialize() {
      try {
        await this.fetchOrders()
      } catch (error) {
        // Initialization error is already handled in fetchOrders
        console.error('Failed to initialize orders store:', error)
      }
    },
    
    // Reset store to initial state
    reset() {
      this.orders = []
      this.currentOrder = null
      this.trackedOrder = null
      
      this.loading = {
        orders: false,
        currentOrder: false,
        creating: false,
        updating: false,
        deleting: false,
        tracking: false
      }
      
      this.clearErrors()
      
      this.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        ordersPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false
      }
      
      this.resetFilters()
    }
  }
}) 