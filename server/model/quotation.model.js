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
    quotationNum: {
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
    timeLine: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    validTil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    discountType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    surcharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    surchargeType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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

  return sequelize.define('Quotation', attributes);
}
