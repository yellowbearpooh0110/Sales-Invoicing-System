const { DataTypes, Sequelize } = require('sequelize');
const ChairBrand = require('./chairBrand.model');

module.exports = model;

function model(sequelize) {
  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false },
    // brandName: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: ChairBrand(sequelize),
    //     key: 'id',
    //   },
    // },
  };

  return sequelize
    .define('ChairStock', attributes)
    .belongsTo(ChairBrand(sequelize));
}
