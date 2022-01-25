'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccessoryToQuotations', {
      stockId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      quotationId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('AccessoryToQuotations');
  },
};
