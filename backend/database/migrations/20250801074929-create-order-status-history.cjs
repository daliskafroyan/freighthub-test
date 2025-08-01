'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_status_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      previous_status: {
        type: Sequelize.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
        allowNull: true // null for initial status when order is created
      },
      new_status: {
        type: Sequelize.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
        allowNull: false
      },
      changed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('order_status_histories', {
      fields: ['order_id'],
      name: 'order_status_histories_order_id_index'
    });

    await queryInterface.addIndex('order_status_histories', {
      fields: ['changed_at'],
      name: 'order_status_histories_changed_at_index'
    });

    await queryInterface.addIndex('order_status_histories', {
      fields: ['new_status'],
      name: 'order_status_histories_new_status_index'
    });

    await queryInterface.addIndex('order_status_histories', {
      fields: ['order_id', 'changed_at'],
      name: 'order_status_histories_order_changed_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('order_status_histories', 'order_status_histories_order_id_index');
    await queryInterface.removeIndex('order_status_histories', 'order_status_histories_changed_at_index');
    await queryInterface.removeIndex('order_status_histories', 'order_status_histories_new_status_index');
    await queryInterface.removeIndex('order_status_histories', 'order_status_histories_order_changed_index');
    
    // Drop the table
    await queryInterface.dropTable('order_status_histories');
  }
};