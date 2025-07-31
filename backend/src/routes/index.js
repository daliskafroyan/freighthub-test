import { Router } from 'express';
import healthRoutes from './health.js';

const router = Router();

// API Routes
router.use('/health', healthRoutes);

// API Info route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Logistics Tracking API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      // More endpoints will be added here as we develop features
    }
  });
});

export default router; 