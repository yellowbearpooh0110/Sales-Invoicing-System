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
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1000,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    preOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    proDeliveryDate: {
      type: DataTypes.DATEONLY,
    },
    from: {
      type: DataTypes.TIME,
    },
    to: {
      type: DataTypes.TIME,
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    signUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  };

  return sequelize.define('AccessoryToOrder', attributes);
}
