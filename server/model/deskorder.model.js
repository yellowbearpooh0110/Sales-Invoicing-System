const { DataTypes } = require('sequelize');
const DeskStock = require('./deskstock.model');
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
    clientBlock: { type: DataTypes.STRING, allowNull: false },
    clientFloor: { type: DataTypes.STRING, allowNull: false },
    clientUnit: { type: DataTypes.STRING, allowNull: false },
    orderDate: { type: DataTypes.DATE },
    finishDate: { type: DataTypes.DATE },
    clientRemark: { type: DataTypes.STRING, defaultValue: '' },
  };

  const DeskOrder = sequelize.define('DeskOrder', attributes);
  DeskOrder.belongsTo(DeskStock(sequelize), {
    as: 'stock',
    foreignKey: { name: 'stockId', allowNull: false },
  });
  DeskOrder.belongsTo(User(sequelize), {
    as: 'salesman',
    foreignKey: { name: 'salesmanId', allowNull: false },
  });

  return DeskOrder;
}
