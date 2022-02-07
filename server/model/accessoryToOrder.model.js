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
    deliveryOption: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Delivery Included',
    },
    preOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    proDeliveryDate: {
      type: DataTypes.DATEONLY,
    },
    estDeliveryDate: {
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
    signURL: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  };

  return sequelize.define('AccessoryToOrder', attributes, {
    tableName: 'AccessoryToOrder',
  });
}
