const { DataTypes } = require('sequelize');

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
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    block: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    floor: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    unit: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    phone: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    email: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    signUrl: {
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
    isPreOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  };

  return sequelize.define('SalesOrder', attributes);
}
