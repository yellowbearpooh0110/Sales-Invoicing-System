'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessoryToQuotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccessoryToQuotation.init(
    {
      stockId: DataTypes.UUID,
      quotationId: DataTypes.UUID,
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'AccessoryToQuotation',
    }
  );
  return AccessoryToQuotation;
};
