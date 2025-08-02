import { Router } from 'express';
import { testConnection } from '../config/database.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: isConnected ? 'OK' : 'ERROR',
      database: isConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/detailed', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.json({
      status: 'OK',
      services: {
        api: 'Running',
        database: dbConnected ? 'Connected' : 'Disconnected'
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 