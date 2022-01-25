'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChairStock.init(
    {
      id: DataTypes.UUID,
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
      isRegsitered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ChairStock',
    }
  );
  return ChairStock;
};
