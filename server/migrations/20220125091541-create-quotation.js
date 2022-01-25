'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Quotations', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      quotationNum: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      name: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      district: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      street: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      block: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      floor: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      unit: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      timeLine: {
        allowNull: false,
        defaultValue: 10,
        type: Sequelize.INTEGER,
      },
      remark: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      paymentTerms: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      validTil: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      discout: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      discountType: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      surcharge: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      surchargeType: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      finished: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isPreorder: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Quotations');
  },
};
