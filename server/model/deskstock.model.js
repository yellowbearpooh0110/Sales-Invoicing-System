const { DataTypes, Sequelize } = require('sequelize');
const DeskBrand = require('./deskbrand.model');
const DeskModel = require('./deskmodel.model');
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
    armSize: {
      type: DataTypes.FLOAT,
    },
    feetSize: {
      type: DataTypes.FLOAT,
    },
    beam: {
      type: DataTypes.STRING,
    },
    akInfo: {
      type: DataTypes.STRING,
    },
    woodInfo1: {
      type: DataTypes.STRING,
    },
    woodInfo2: {
      type: DataTypes.STRING,
    },
    melamineInfo: {
      type: DataTypes.STRING,
    },
    laminateInfo: {
      type: DataTypes.STRING,
    },
    bambooInfo: {
      type: DataTypes.STRING,
    },
    deskRemark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  };

  const DeskStock = sequelize.define('DeskStock', attributes);
  DeskStock.belongsTo(DeskModel(sequelize), {
    as: 'deskModel',
    foreignKey: 'deskModelId',
  });
  DeskStock.belongsTo(ProductColor(sequelize), {
    as: 'color',
    foreignKey: 'colorId',
  });
  return DeskStock;
}
