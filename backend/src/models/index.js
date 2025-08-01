import sequelize from '../config/database.js';

// Import models here as we create them
import Order from './order.js';
import OrderStatusHistory from './orderstatushistory.js';
// import User from './User.js';
// import Shipment from './Shipment.js';

// Define model associations here
const initializeModels = () => {
  // Set up associations
  const models = { Order, OrderStatusHistory };
  
  // Initialize associations for each model
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  
  console.log('📋 Models initialized with associations');
};

// Export models and initialization function
export {
  sequelize,
  initializeModels
};

// Export individual models here as we create them
export { Order, OrderStatusHistory }; 