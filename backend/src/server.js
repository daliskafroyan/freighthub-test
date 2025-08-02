import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { sequelize, testConnection } from './config/database.js';

import { initializeModels } from './models/index.js';

import { 
  corsOptions, 
  errorHandler, 
  notFoundHandler, 
  requestLogger 
} from './middleware/index.js';

import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Logistics Tracking API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', apiRoutes);
app.use('*', notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('Database connection failed, but server will start anyway');
    }
    
    initializeModels();
    
    if (process.env.NODE_ENV === 'development') {
      try {
        await sequelize.sync({ alter: false });
      } catch (error) {
        console.warn('Database sync failed:', error.message);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`Logistics Tracking API server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  try {
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer(); 