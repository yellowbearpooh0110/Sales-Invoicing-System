const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    email: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: true },
  };

  const options = {
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ['password'] },
    },
    scopes: {
      // include hash with this scope
      withPassword: { attributes: {} },
    },
  };

  return sequelize.define('User', attributes, options);
}
