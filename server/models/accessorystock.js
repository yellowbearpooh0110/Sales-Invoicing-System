'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessoryStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccessoryStock.init(
    {
      id: DataTypes.UUID,
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
