'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeskToOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeskToOrder.init(
    {
      hasDeskTop: DataTypes.BOOLEAN,
      topMaterial: DataTypes.STRING,
      topColor: DataTypes.STRING,
      topLength: DataTypes.FLOAT,
      topWidth: DataTypes.FLOAT,
      topThickness: DataTypes.FLOAT,
      topRoundedCorners: DataTypes.INTEGER,
      topHoleCount: DataTypes.INTEGER,
      opHoleType: DataTypes.STRING,
      topSketchURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
      preOrder: DataTypes.BOOLEAN,
      preDeliveryDate: DataTypes.DATEONLY,
      estDeliveryDate: DataTypes.DATEONLY,
      from: DataTypes.TIME,
      to: DataTypes.TIME,
      delivered: DataTypes.BOOLEAN,
      akNum: DataTypes.STRING,
      heworkNum: DataTypes.STRING,
      signURL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'DeskToOrder',
    }
  );
  return DeskToOrder;
};
