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
    },
    withAdArmrest: {
      type: DataTypes.BOOLEAN,
    },
    specialRemarks: {
      type: DataTypes.STRING,
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };

  const ChairStock = sequelize.define('ChairStock', attributes);
  ChairStock.belongsTo(ProductColor(sequelize), { foreignKey: 'frameColor' });
  ChairStock.belongsTo(ProductColor(sequelize), { foreignKey: 'backColor' });
  ChairStock.belongsTo(ProductColor(sequelize), { foreignKey: 'seatColor' });
  ChairStock.belongsTo(ChairBrand(sequelize), { foreignKey: 'chairBrand' });
  ChairStock.belongsTo(ChairModel(sequelize), { foreignKey: 'chairModel' });

  return ChairStock;
}
