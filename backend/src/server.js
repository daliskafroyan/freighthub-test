import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import database configuration
import { sequelize, testConnection } from './config/database.js';

// Import models
import { initializeModels } from './models/index.js';

// Import middleware
import { 
  corsOptions, 
  errorHandler, 
  notFoundHandler, 
  requestLogger 
} from './middleware/index.js';

// Import routes
import apiRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// Root health check (keeping the original endpoint)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Logistics Tracking API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    console.log('🚀 Starting Logistics Tracking API Server...');
    
    // Test database connection
    console.log('📡 Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  Database connection failed, but server will start anyway');
    }
    
    // Initialize models and associations
    initializeModels();
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      try {
        await sequelize.sync({ alter: false }); // Don't alter tables automatically
        console.log('🗄️  Database synchronized');
      } catch (error) {
        console.warn('⚠️  Database sync failed:', error.message);
      }
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚚 Logistics Tracking API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
      console.log(`🩺 Database health: http://localhost:${PORT}/api/health/db`);
      console.log(`📋 Detailed health: http://localhost:${PORT}/api/health/detailed`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('📪 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('📪 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer(); 