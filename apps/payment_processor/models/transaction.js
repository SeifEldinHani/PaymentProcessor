'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Card, {
        foreignKey: 'transaction_origin_id',
        as: 'card',
      });
    }
  }
  Transaction.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      transaction_status: DataTypes.STRING,
      transaction_origin_id: DataTypes.STRING,
      network: DataTypes.STRING,
      merchant_name: DataTypes.STRING,
      authorization_transaction_amount: DataTypes.INTEGER,
      clearing_transaction_amount: DataTypes.INTEGER,
      transaction_currency: DataTypes.STRING,
      authorization_timestamp: DataTypes.DATE,
      clearing_timestamp: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Transaction',
      timestamps: true,
    },
  );
  return Transaction;
};
