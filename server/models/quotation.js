'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      this.belongsToMany(models.ChairStock, {
        through: 'ChairToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.DeskStock, {
        through: 'DeskToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.AccessoryStock, {
        through: 'AccessoryToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
    }
  }
  Quotation.init(
    {
      name: DataTypes.STRING,
      quotationNum: DataTypes.INTEGER,
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
      paymentTerms: DataTypes.STRING,
      validTil: DataTypes.INTEGER,
      discout: DataTypes.FLOAT,
      discountType: DataTypes.INTEGER,
      surcharge: DataTypes.FLOAT,
      surchargeType: DataTypes.INTEGER,
      finished: DataTypes.BOOLEAN,
      isPreorder: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Quotation',
    }
  );
  return Quotation;
};
