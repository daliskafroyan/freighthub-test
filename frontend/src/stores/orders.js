import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: {
      orders: false,
      currentOrder: false,
      creating: false,
      updating: false,
      deleting: false,
      tracking: false
    },
    errors: {
      orders: null,
      currentOrder: null,
      creating: null,
      updating: null,
      deleting: null,
      tracking: null
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false
    },
    filters: {
      status: '',
      trackingNumber: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    },
    trackedOrder: null
  }),

  getters: {
    ordersByStatus: (state) => (status) => {
      return state.orders.filter(order => order.status === status)
    },
    pendingOrders: (state) => {
      return state.orders.filter(order => order.status === 'Pending')
    },
    inTransitOrders: (state) => {
      return state.orders.filter(order => order.status === 'In Transit')
    },
    deliveredOrders: (state) => {
      return state.orders.filter(order => order.status === 'Delivered')
    },
    canceledOrders: (state) => {
      return state.orders.filter(order => order.status === 'Canceled')
    },
    ordersCount: (state) => {
      return {
        total: state.orders.length,
        pending: state.orders.filter(order => order.status === 'Pending').length,
        inTransit: state.orders.filter(order => order.status === 'In Transit').length,
        delivered: state.orders.filter(order => order.status === 'Delivered').length,
        canceled: state.orders.filter(order => order.status === 'Canceled').length
      }
    },
    isLoading: (state) => {
      return Object.values(state.loading).some(loading => loading)
    },
    hasErrors: (state) => {
      return Object.values(state.errors).some(error => error !== null)
    },
    allErrors: (state) => {
      return Object.values(state.errors).filter(error => error !== null)
    },
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === parseInt(id))
    },
    getOrderByTrackingNumber: (state) => (trackingNumber) => {
      return state.orders.find(order => order.trackingNumber === trackingNumber)
    }
  },

  actions: {
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

    clearError(type) {
      if (this.errors.hasOwnProperty(type)) {
        this.errors[type] = null
      }
    },

    setLoading(type, loading) {
      if (this.loading.hasOwnProperty(type)) {
        this.loading[type] = loading
      }
    },

    setError(type, error) {
      if (this.errors.hasOwnProperty(type)) {
        this.errors[type] = error
      }
    },

    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    resetFilters() {
      this.filters = {
        status: '',
        trackingNumber: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
    },

    async fetchOrders(options = {}) {
      const {
        page = this.pagination.currentPage,
        limit = this.pagination.ordersPerPage,
        status = this.filters.status,
        trackingNumber = this.filters.trackingNumber,
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

        if (trackingNumber) {
          params.trackingNumber = trackingNumber
        }

        const response = await axios.get('/api/orders', { params })

        this.orders = response.data.orders || []

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

    async fetchOrderById(id) {
      this.setLoading('currentOrder', true)
      this.clearError('currentOrder')

      try {
        const response = await axios.get(`/api/orders/${id}`)
        this.currentOrder = response.data.order

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

    async createOrder(orderData) {
      this.setLoading('creating', true)
      this.clearError('creating')

      try {
        const response = await axios.post('/api/orders', orderData)
        const newOrder = response.data.order

        this.orders.unshift(newOrder)
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

    async updateOrderStatus(orderId, newStatus) {
      this.setLoading('updating', true)
      this.clearError('updating')

      try {
        const response = await axios.put(`/api/orders/${orderId}/status`, {
          status: newStatus
        })

        const updatedOrder = response.data.order

        const index = this.orders.findIndex(order => order.id === parseInt(orderId))
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...updatedOrder }
        }

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

    async cancelOrder(orderId) {
      this.setLoading('deleting', true)
      this.clearError('deleting')

      try {
        const response = await axios.delete(`/api/orders/${orderId}`)

        const canceledOrder = response.data.order

        const index = this.orders.findIndex(order => order.id === parseInt(orderId))
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...canceledOrder }
        }

        if (this.currentOrder && this.currentOrder.id === parseInt(orderId)) {
          this.currentOrder = { ...this.currentOrder, ...canceledOrder }
        }

        return canceledOrder

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

    clearTrackedOrder() {
      this.trackedOrder = null
      this.clearError('tracking')
    },

    async refreshOrders() {
      return this.fetchOrders({
        page: this.pagination.currentPage,
        limit: this.pagination.ordersPerPage,
        status: this.filters.status,
        sortBy: this.filters.sortBy,
        sortOrder: this.filters.sortOrder
      })
    },

    async nextPage() {
      if (this.pagination.hasNextPage) {
        return this.fetchOrders({
          page: this.pagination.currentPage + 1
        })
      }
    },

    async previousPage() {
      if (this.pagination.hasPreviousPage) {
        return this.fetchOrders({
          page: this.pagination.currentPage - 1
        })
      }
    },

    async goToPage(page) {
      return this.fetchOrders({ page })
    },

    async filterByStatus(status) {
      this.updateFilters({ status })
      return this.fetchOrders({
        page: 1,
        status
      })
    },

    async sortOrders(sortBy, sortOrder = 'DESC') {
      this.updateFilters({ sortBy, sortOrder })
      return this.fetchOrders({
        page: 1,
        sortBy,
        sortOrder
      })
    },

    async initialize() {
      try {
        await this.fetchOrders()
      } catch (error) {
        console.error('Failed to initialize orders store:', error)
      }
    },

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