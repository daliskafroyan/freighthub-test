import sequelize from '../config/database.js';

// Import models here as we create them
import Order from './order.js';
// import User from './User.js';
// import Shipment from './Shipment.js';

// Define model associations here
const initializeModels = () => {
  // Example of how to define associations when we have models:
  // User.hasMany(Shipment, { foreignKey: 'userId', as: 'shipments' });
  // Shipment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  console.log('📋 Models initialized');
};

// Export models and initialization function
export {
  sequelize,
  initializeModels
};

// Export individual models here as we create them
export { Order }; 