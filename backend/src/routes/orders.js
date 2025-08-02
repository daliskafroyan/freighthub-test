import { Router } from 'express';
import { Order } from '../models/index.js';
import { generateTrackingNumber, isValidTrackingNumberFormat } from '../utils/trackingGenerator.js';
import StatusTracker from '../services/statusTracker.js';

const router = Router();

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

router.post('/', validateOrderCreation, async (req, res) => {
  try {
    const { senderName, recipientName, origin, destination } = req.body;
    
    let trackingNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      trackingNumber = generateTrackingNumber();
      
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
    
    const order = await Order.create({
      trackingNumber,
      senderName: senderName.trim(),
      recipientName: recipientName.trim(),
      origin: origin.trim(),
      destination: destination.trim()
    });
    
    try {
      await StatusTracker.recordStatusChange(
        order.id,
        null,
        order.status,
        'Order created successfully'
      );
    } catch (statusError) {
      console.warn('Failed to record initial status change:', statusError.message);
    }
    
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

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      message: 'Orders retrieved successfully',
      orders: orders.map(order => ({
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
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: count,
        ordersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
    
    let statusHistory = [];
    try {
      statusHistory = await StatusTracker.getStatusTimeline(order.id);
    } catch (historyError) {
      console.warn('Failed to fetch status history:', historyError.message);
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
        updatedAt: order.updatedAt,
        statusHistory: statusHistory
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

router.get('/track/:tracking_number', async (req, res) => {
  try {
    const { tracking_number } = req.params;
    
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
    
    let statusHistory = [];
    try {
      statusHistory = await StatusTracker.getStatusTimeline(order.id);
    } catch (historyError) {
      console.warn('Failed to fetch status history for tracking:', historyError.message);
    }
    
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
        statusHistory: statusHistory
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

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid order ID',
        message: 'Order ID must be a number'
      });
    }
    
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
    
    if (!StatusTracker.isValidStatusTransition(order.status, status)) {
      return res.status(400).json({
        error: 'Invalid status transition',
        message: `Cannot change status from ${order.status} to ${status}`,
        currentStatus: order.status,
        requestedStatus: status
      });
    }
    
    const previousStatus = order.status;
    order.status = status;
    await order.save();
    
    try {
      await StatusTracker.recordStatusChange(
        order.id,
        previousStatus,
        order.status,
        `Status updated from ${previousStatus} to ${order.status}`
      );
    } catch (statusError) {
      console.warn('Failed to record status change:', statusError.message);
    }
    
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
    
    if (order.status !== 'Pending') {
      return res.status(400).json({
        error: 'Cannot cancel order',
        message: `Orders can only be canceled when status is 'Pending'. Current status: ${order.status}`
      });
    }
    
    const previousStatus = order.status;
    
    order.status = 'Canceled';
    await order.save();
    
    try {
      await StatusTracker.recordStatusChange(
        order.id,
        previousStatus,
        'Canceled',
        `Order canceled from ${previousStatus} status`
      );
    } catch (statusError) {
      console.warn('Failed to record cancellation in history:', statusError.message);
    }
    
    res.json({
      message: 'Order canceled successfully',
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        route: order.getFullRoute(),
        previousStatus,
        currentStatus: order.status,
        isCanceled: true,
        updatedAt: order.updatedAt
      }
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