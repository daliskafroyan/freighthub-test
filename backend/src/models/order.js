import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Order extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Order has many status history entries
    Order.hasMany(models.OrderStatusHistory, {
      foreignKey: 'orderId',
      as: 'statusHistory',
      onDelete: 'CASCADE'
    });
  }

  // Instance methods can be added here
  getFullRoute() {
    return `${this.origin} → ${this.destination}`;
  }

  isDelivered() {
    return this.status === 'Delivered';
  }

  isPending() {
    return this.status === 'Pending';
  }
}

// Define the Order model
Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Tracking number cannot be empty'
      },
      len: {
        args: [6, 20],
        msg: 'Tracking number must be between 6 and 20 characters'
      }
    }
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Sender name is required'
      },
      len: {
        args: [2, 100],
        msg: 'Sender name must be between 2 and 100 characters'
      }
    }
  },
  recipientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Recipient name is required'
      },
      len: {
        args: [2, 100],
        msg: 'Recipient name must be between 2 and 100 characters'
      }
    }
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Origin is required'
      },
      len: {
        args: [2, 200],
        msg: 'Origin must be between 2 and 200 characters'
      }
    }
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Destination is required'
      },
      len: {
        args: [2, 200],
        msg: 'Destination must be between 2 and 200 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Transit', 'Delivered', 'Canceled']],
        msg: 'Status must be one of: Pending, In Transit, Delivered, Canceled'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders', // Explicitly set table name to lowercase
  timestamps: true, // Enables createdAt and updatedAt
  underscored: true, // Use snake_case for database fields
  indexes: [
    {
      unique: true,
      fields: ['tracking_number']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ],
  // Model-level validations
  validate: {
    originDestinationDifferent() {
      if (this.origin === this.destination) {
        throw new Error('Origin and destination cannot be the same');
      }
    }
  }
});

export default Order;