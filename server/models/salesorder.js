'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.ChairStock, {
        through: 'ChairToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.DeskStock, {
        through: 'DeskToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.AccessoryStock, {
        through: 'AccessoryToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId',
      });
    }
  }
  SalesOrder.init(
    {
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      invoiceNum: DataTypes.INTEGER,
      name: DataTypes.STRING,
      district: DataTypes.STRING,
      street: DataTypes.STRING,
      block: DataTypes.STRING,
      floor: DataTypes.STRING,
      unit: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      timeLine: DataTypes.INTEGER,
      remark: DataTypes.STRING,
      signURL: DataTypes.STRING,
      paid: DataTypes.BOOLEAN,
      paymentTerms: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      discout: DataTypes.FLOAT,
      discountType: DataTypes.INTEGER,
      surcharge: DataTypes.FLOAT,
      surchargeType: DataTypes.INTEGER,
      finished: DataTypes.BOOLEAN,
      isPreorder: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'SalesOrder',
    }
  );
  return SalesOrder;
};
