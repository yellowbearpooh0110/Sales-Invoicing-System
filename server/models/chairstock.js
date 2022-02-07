'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairStock extends Model {
    static associate(models) {
      this.belongsToMany(models.SalesOrder, {
        through: 'ChairToOrder',
        foreignKey: 'stockId',
        otherKey: 'orderId',
      });
      this.belongsToMany(models.Quotation, {
        through: 'ChairToQuotatino',
        foreignKey: 'stockId',
        otherKey: 'quotationId',
      });
    }
  }
  ChairStock.init(
    {
      brand: DataTypes.STRING,
      model: DataTypes.STRING,
      frameColor: DataTypes.STRING,
      backColor: DataTypes.STRING,
      seatColor: DataTypes.STRING,
      backMaterial: DataTypes.STRING,
      seatMaterial: DataTypes.STRING,
      withHeadrest: DataTypes.BOOLEAN,
      withAdArmrest: DataTypes.BOOLEAN,
      remark: DataTypes.STRING,
      thumbnailURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      balance: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      shipmentDate: DataTypes.DATEONLY,
      arrivalDate: DataTypes.DATEONLY,
      isRegistered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ChairStock',
    }
  );
  return ChairStock;
};
