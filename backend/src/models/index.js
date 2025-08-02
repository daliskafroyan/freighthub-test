import sequelize from '../config/database.js';
import Order from './order.js';
import OrderStatusHistory from './orderstatushistory.js';

const initializeModels = () => {
  const models = { Order, OrderStatusHistory };
  
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
};

export {
  sequelize,
  initializeModels
};

export { Order, OrderStatusHistory }; 