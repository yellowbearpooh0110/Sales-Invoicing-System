'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      avatarURL: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.STRING,
      prefix: DataTypes.CHAR(2),
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        // exclude hash by default
        attributes: { exclude: ['password'] },
      },
      scopes: {
        // include hash with this scope
        withPassword: { attributes: {} },
      },
    }
  );
  return User;
};
