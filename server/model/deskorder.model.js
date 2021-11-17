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
    clientName: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    clientDistrict: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    clientStreet: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    clientBlock: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    clientFloor: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    clientUnit: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    clientPhone: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    clientEmail: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    clientRemark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    signURL: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1000,
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isPreOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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
