const { DataTypes, Sequelize } = require('sequelize');
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
      allowNull: false,
      defaultValue: '',
    },
    akInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    woodInfo_1: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    woodInfo_2: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    melamineInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    laminateInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    bambooInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    deskRemark: {
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
