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
    hasDeskTop: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    topMaterial: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    topColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    topLength: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 800,
    },
    topWidth: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 600,
    },
    topThickness: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 25,
    },
    topRoundedCorners: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    topCornerRadius: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    topHoleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    topHoleType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Rounded',
    },
    topSketchUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
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
    deliveryDate: {
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

  return sequelize.define('DeskToOrder', attributes);
}
