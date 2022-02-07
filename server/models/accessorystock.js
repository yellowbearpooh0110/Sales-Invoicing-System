'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessoryStock extends Model {
    static associate(models) {
      this.belongsToMany(models.SalesOrder, {
        through: 'AccessoryToOrder',
        foreignKey: 'stockId',
        otherKey: 'orderId',
      });
      this.belongsToMany(models.Quotation, {
        through: 'AccessoryToQuotatino',
        foreignKey: 'stockId',
        otherKey: 'quotationId',
      });
    }
  }
  AccessoryStock.init(
    {
      name: DataTypes.STRING,
      color: DataTypes.STRING,
      remark: DataTypes.STRING,
      thumbnailURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      isRegistered: DataTypes.BOOLEAN,
      balance: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      shipmentDate: DataTypes.DATEONLY,
      arrivalDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: 'AccessoryStock',
    }
  );
  return AccessoryStock;
};
