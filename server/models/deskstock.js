'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeskStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeskStock.init(
    {
      id: DataTypes.UUID,
      supplierCode: DataTypes.STRING,
      model: DataTypes.STRING,
      color: DataTypes.STRING,
      armSize: DataTypes.STRING,
      feetSize: DataTypes.STRING,
      beamSize: DataTypes.STRING,
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
      modelName: 'DeskStock',
    }
  );
  return DeskStock;
};
