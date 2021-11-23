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
    supplierCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'AK',
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    armSize: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    feetSize: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    beamSize: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Regular',
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
    topSize: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shipmentDate: {
      type: DataTypes.DATEONLY,
    },
    arrivalDate: {
      type: DataTypes.DATEONLY,
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  };

  return sequelize.define('DeskStock', attributes);
}
