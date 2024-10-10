'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      transaction_status: {
        type: Sequelize.STRING,
      },
      transaction_origin_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Cards',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      network: {
        type: Sequelize.STRING,
      },
      merchant_name: {
        type: Sequelize.STRING,
      },
      authorization_transaction_amount: {
        type: Sequelize.INTEGER,
      },
      clearing_transaction_amount: {
        type: Sequelize.INTEGER,
      },
      transaction_currency: {
        type: Sequelize.STRING,
      },
      authorization_timestamp: {
        type: Sequelize.DATE,
      },
      clearing_timestamp: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  },
};
