'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DeskToOrders', {
      stockId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      hasDeskTop: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      topMaterial: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      topColor: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      topLength: {
        allowNull: false,
        defaultValue: 800,
        type: Sequelize.FLOAT,
      },
      topWidth: {
        allowNull: false,
        defaultValue: 600,
        type: Sequelize.FLOAT,
      },
      topThickness: {
        allowNull: false,
        defaultValue: 25,
        type: Sequelize.FLOAT,
      },
      topRoundedCorners: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      topCornerRadius: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.FLOAT,
      },
      topHoleCount: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      topHoleType: {
        allowNull: false,
        defaultValue: 'Rounded',
        type: Sequelize.STRING,
      },
      topSketchURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      unitPrice: {
        allowNull: false,
        defaultValue: 1000,
        type: Sequelize.FLOAT,
      },
      qty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      deliveryOption: {
        allowNull: false,
        defaultValue: 'Delivery Included',
        type: Sequelize.STRING,
      },
      preOrder: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      preDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      estDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      from: {
        type: Sequelize.TIME,
      },
      to: {
        type: Sequelize.TIME,
      },
      delivered: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      akNum: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      heworkNum: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      signURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('DeskToOrders');
  },
};
