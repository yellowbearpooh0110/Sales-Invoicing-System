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
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    avatarURL: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    prefix: { type: DataTypes.CHAR(2), allowNull: false, defaultValue: '' },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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

  return sequelize.define('User', attributes, options, {
    tableName: 'User',
  });
}
