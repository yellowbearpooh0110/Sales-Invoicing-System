const { DataTypes, Sequelize } = require('sequelize');
const ChairBrand = require('./chairbrand.model');
const ChairModel = require('./chairmodel.model');
const ProductColor = require('./productcolor.model');

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    withHeadrest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    withAdArmrest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    chairRemark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  };

  const ChairStock = sequelize.define('ChairStock', attributes);
  ChairStock.belongsTo(ChairBrand(sequelize), {
    as: 'chairBrand',
    foreignKey: 'chairBrandId',
  });
  ChairStock.belongsTo(ChairModel(sequelize), {
    as: 'chairModel',
    foreignKey: 'chairModelId',
  });
  ChairStock.belongsTo(ProductColor(sequelize), {
    as: 'frameColor',
    foreignKey: 'frameColorId',
  });
  ChairStock.belongsTo(ProductColor(sequelize), {
    as: 'backColor',
    foreignKey: 'backColorId',
  });
  ChairStock.belongsTo(ProductColor(sequelize), {
    as: 'seatColor',
    foreignKey: 'seatColorId',
  });

  return ChairStock;
}
