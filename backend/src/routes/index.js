import { Router } from 'express';
import healthRoutes from './health.js';
import orderRoutes from './orders.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/orders', orderRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'Logistics Tracking API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      orders: {
        create: 'POST /api/orders',
        list: 'GET /api/orders',
        getById: 'GET /api/orders/:id',
        track: 'GET /api/orders/track/:tracking_number',
        updateStatus: 'PUT /api/orders/:id/status',
        cancel: 'DELETE /api/orders/:id'
      }
    }
  });
});

export default router; 