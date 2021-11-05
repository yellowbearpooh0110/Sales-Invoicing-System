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
    detail: { type: DataTypes.STRING, allowNull: false, unique: true },
  };

  return sequelize.define('ChairBrand', attributes);
}
