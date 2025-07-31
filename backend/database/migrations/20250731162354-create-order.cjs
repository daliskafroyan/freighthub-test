'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tracking_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      sender_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      recipient_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      origin: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      destination: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Transit', 'Delivered', 'Canceled'),
        allowNull: false,
        defaultValue: 'Pending'
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

    // Add indexes for better query performance
    await queryInterface.addIndex('orders', {
      fields: ['tracking_number'],
      unique: true,
      name: 'orders_tracking_number_unique'
    });

    await queryInterface.addIndex('orders', {
      fields: ['status'],
      name: 'orders_status_index'
    });

    await queryInterface.addIndex('orders', {
      fields: ['created_at'],
      name: 'orders_created_at_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    await queryInterface.removeIndex('orders', 'orders_created_at_index');
    await queryInterface.removeIndex('orders', 'orders_status_index');
    await queryInterface.removeIndex('orders', 'orders_tracking_number_unique');
    
    // Drop the table
    await queryInterface.dropTable('orders');
  }
};