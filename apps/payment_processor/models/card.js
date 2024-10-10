'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.hasMany(models.Transaction, {
        foreignKey: 'transaction_origin_id',
        as: 'transactions',
      });
    }
  }
  Card.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      utilization: DataTypes.FLOAT,
      limit: DataTypes.FLOAT,
      total_spent: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Card',
      timestamps: true,
    },
  );
  return Card;
};
