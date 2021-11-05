const { DataTypes } = require('sequelize');
const ChairStock = require('./chairstock.model');
const User = require('./user.model');

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    invoiceNum: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
    },
    clientName: { type: DataTypes.STRING, allowNull: false },
    clientDistrict: { type: DataTypes.STRING, allowNull: false },
    clientStreet: { type: DataTypes.STRING, allowNull: false },
    clientFloor: { type: DataTypes.STRING, allowNull: false },
    clientUnit: { type: DataTypes.STRING, allowNull: false },
    clientBlock: { type: DataTypes.STRING, allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    finishDate: { type: DataTypes.DATE },
    specialRemarks: { type: DataTypes.STRING },
  };

  const ChairOrder = sequelize.define('ChairOrder', attributes);
  ChairOrder.belongsTo(ChairStock(sequelize), { foreignKey: 'stockID' });
  ChairOrder.belongsTo(User(sequelize), { foreignKey: 'salesmanID' });

  return ChairOrder;
}
