import { Router } from 'express';
import { Order } from '../models/index.js';
import { generateTrackingNumber, isValidTrackingNumberFormat } from '../utils/trackingGenerator.js';

const router = Router();

// Validation middleware for order creation
const validateOrderCreation = (req, res, next) => {
  const { senderName, recipientName, origin, destination } = req.body;
  
  const errors = [];
  
  if (!senderName || senderName.trim().length < 2) {
    errors.push('Sender name is required and must be at least 2 characters');
  }
  
  if (!recipientName || recipientName.trim().length < 2) {
    errors.push('Recipient name is required and must be at least 2 characters');
  }
  
  if (!origin || origin.trim().length < 2) {
    errors.push('Origin is required and must be at least 2 characters');
  }
  
  if (!destination || destination.trim().length < 2) {
    errors.push('Destination is required and must be at least 2 characters');
  }
  
  if (origin && destination && origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
    errors.push('Origin and destination cannot be the same');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// POST /api/orders - Create new order with auto-generated tracking number
router.post('/', validateOrderCreation, async (req, res) => {
  try {
    const { senderName, recipientName, origin, destination } = req.body;
    
    // Generate unique tracking number
    let trackingNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Ensure tracking number is unique (retry if collision)
    while (!isUnique && attempts < maxAttempts) {
      trackingNumber = generateTrackingNumber();
      
      // Check if tracking number already exists
      const existingOrder = await Order.findOne({ 
        where: { trackingNumber } 
      });
      
      if (!existingOrder) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return res.status(500).json({
        error: 'Failed to generate unique tracking number',
        message: 'Please try again'
      });
    }
    
    // Create the order
    const order = await Order.create({
      trackingNumber,
      senderName: senderName.trim(),
      recipientName: recipientName.trim(),
      origin: origin.trim(),
      destination: destination.trim()
      // status defaults to 'Pending'
    });
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        senderName: order.senderName,
        recipientName: order.recipientName,
        origin: order.origin,
        destination: order.destination,
        status: order.status,
        route: order.getFullRoute(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      error: 'Failed to create order',
      message: 'An unexpected error occurred'
    });
  }
});

// GET /api/orders - Get all orders with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;
    
    // Build where clause
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Get orders with pagination
    const { rows: orders, count: totalOrders } = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });
    
    // Format response with additional info
    const formattedOrders = orders.map(order => ({
      id: order.id,
      trackingNumber: order.trackingNumber,
      senderName: order.senderName,
      recipientName: order.recipientName,
      origin: order.origin,
      destination: order.destination,
      status: order.status,
      route: order.getFullRoute(),
      isPending: order.isPending(),
      isDelivered: order.isDelivered(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
    
    res.json({
      message: 'Orders retrieved successfully',
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        ordersPerPage: parseInt(limit),
        hasNextPage: offset + parseInt(limit) < totalOrders,
        hasPreviousPage: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: 'An unexpected error occurred'
    });
  }
});

// GET /api/orders/:id - Get specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'Order ID must be a number'
      });
    }
    
    const order = await Order.findByPk(parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with ID ${id}`
      });
    }
    
    res.json({
      message: 'Order retrieved successfully',
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        senderName: order.senderName,
        recipientName: order.recipientName,
        origin: order.origin,
        destination: order.destination,
        status: order.status,
        route: order.getFullRoute(),
        isPending: order.isPending(),
        isDelivered: order.isDelivered(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: 'Failed to fetch order',
      message: 'An unexpected error occurred'
    });
  }
});

// GET /api/orders/track/:tracking_number - Track order by tracking number
router.get('/track/:tracking_number', async (req, res) => {
  try {
    const { tracking_number } = req.params;
    
    // Validate tracking number format
    if (!isValidTrackingNumberFormat(tracking_number)) {
      return res.status(400).json({
        error: 'Invalid tracking number format',
        message: 'Tracking number should be in format: TRK followed by 12 characters'
      });
    }
    
    const order = await Order.findOne({
      where: { trackingNumber: tracking_number }
    });
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with tracking number ${tracking_number}`
      });
    }
    
    // Enhanced tracking response with more details
    res.json({
      message: 'Order tracking information',
      tracking: {
        trackingNumber: order.trackingNumber,
        status: order.status,
        route: order.getFullRoute(),
        senderName: order.senderName,
        recipientName: order.recipientName,
        origin: order.origin,
        destination: order.destination,
        isPending: order.isPending(),
        isDelivered: order.isDelivered(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        statusHistory: [
          {
            status: 'Pending',
            timestamp: order.createdAt,
            description: 'Order created and pending processing'
          }
          // TODO: Add actual status history when we implement it
        ]
      }
    });
    
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      error: 'Failed to track order',
      message: 'An unexpected error occurred'
    });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate ID
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'Order ID must be a number'
      });
    }
    
    // Validate status
    const validStatuses = ['Pending', 'In Transit', 'Delivered', 'Canceled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findByPk(parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with ID ${id}`
      });
    }
    
    // Business rules for status updates
    if (order.status === 'Delivered' && status !== 'Delivered') {
      return res.status(400).json({
        error: 'Cannot change status',
        message: 'Cannot change status of a delivered order'
      });
    }
    
    if (order.status === 'Canceled' && status !== 'Canceled') {
      return res.status(400).json({
        error: 'Cannot change status',
        message: 'Cannot change status of a canceled order'
      });
    }
    
    // Update the status
    const previousStatus = order.status;
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        previousStatus,
        currentStatus: order.status,
        route: order.getFullRoute(),
        isPending: order.isPending(),
        isDelivered: order.isDelivered(),
        updatedAt: order.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      error: 'Failed to update order status',
      message: 'An unexpected error occurred'
    });
  }
});

// DELETE /api/orders/:id - Cancel order (only if status is 'Pending')
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'Order ID must be a number'
      });
    }
    
    const order = await Order.findByPk(parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with ID ${id}`
      });
    }
    
    // Business rule: Only allow cancellation if status is 'Pending'
    if (order.status !== 'Pending') {
      return res.status(400).json({
        error: 'Cannot cancel order',
        message: `Orders can only be canceled when status is 'Pending'. Current status: ${order.status}`
      });
    }
    
    // Store order info before deletion
    const orderInfo = {
      id: order.id,
      trackingNumber: order.trackingNumber,
      route: order.getFullRoute(),
      status: order.status
    };
    
    // Delete the order
    await order.destroy();
    
    res.json({
      message: 'Order canceled and deleted successfully',
      canceledOrder: orderInfo
    });
    
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({
      error: 'Failed to cancel order',
      message: 'An unexpected error occurred'
    });
  }
});

export default router; 