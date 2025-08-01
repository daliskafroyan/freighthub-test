import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class OrderStatusHistory extends Model {
  /**
   * Helper method for defining associations.
   */
  static associate(models) {
    // OrderStatusHistory belongs to Order
    OrderStatusHistory.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
      onDelete: 'CASCADE'
    });
  }

  // Instance methods
  getStatusChangeDescription() {
    if (!this.previousStatus) {
      return `Order created with status: ${this.newStatus}`;
    }
    return `Status changed from ${this.previousStatus} to ${this.newStatus}`;
  }

  isInitialStatus() {
    return !this.previousStatus;
  }
}

// Define the OrderStatusHistory model
OrderStatusHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    validate: {
      notEmpty: {
        msg: 'Order ID is required'
      }
    }
  },
  previousStatus: {
    type: DataTypes.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
    allowNull: true, // null for initial status
    validate: {
      isIn: {
        args: [['Pending', 'In Transit', 'Delivered', 'Canceled']],
        msg: 'Previous status must be a valid order status'
      }
    }
  },
  newStatus: {
    type: DataTypes.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'New status is required'
      },
      isIn: {
        args: [['Pending', 'In Transit', 'Delivered', 'Canceled']],
        msg: 'New status must be a valid order status'
      }
    }
  },
  changedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Changed at must be a valid date'
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Notes cannot exceed 1000 characters'
      }
    }
  }
}, {
  sequelize,
  modelName: 'OrderStatusHistory',
  tableName: 'order_status_histories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['changed_at']
    },
    {
      fields: ['new_status']
    },
    {
      fields: ['order_id', 'changed_at']
    }
  ]
});

export default OrderStatusHistory;