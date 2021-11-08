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
  return DeskStock;
}
