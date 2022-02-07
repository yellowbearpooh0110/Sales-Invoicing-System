'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeskToQuotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeskToQuotation.init(
    {
      hasDeskTop: DataTypes.BOOLEAN,
      topMaterial: DataTypes.STRING,
      topColor: DataTypes.STRING,
      topLength: DataTypes.FLOAT,
      topWidth: DataTypes.FLOAT,
      topThickness: DataTypes.FLOAT,
      topRoundedCorners: DataTypes.INTEGER,
      topCornerRadius: DataTypes.FLOAT,
      topHoleCount: DataTypes.INTEGER,
      topHoleType: DataTypes.STRING,
      topSketchURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'DeskToQuotation',
    }
  );
  return DeskToQuotation;
};
