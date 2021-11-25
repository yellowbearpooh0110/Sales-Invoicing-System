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
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    frameColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    backColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    seatColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    withHeadrest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    withAdArmrest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
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

  return sequelize.define('ChairStock', attributes);
}
