const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const host = process.env.DB_HOST;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  // const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
  });

  // init models and add them to the exported db object
  db.User = require('server/model/user.model')(sequelize);
  db.ChairStock = require('server/model/chairStock.model')(sequelize);
  db.DeskStock = require('server/model/deskStock.model')(sequelize);
  db.AccessoryStock = require('server/model/accessoryStock.model')(sequelize);
  db.SalesOrder = require('server/model/salesOrder.model')(sequelize);
  db.Quotation = require('server/model/quotation.model')(sequelize);

  db.ChairToOrder = require('server/model/chairToOrder.model')(sequelize);
  db.DeskToOrder = require('server/model/deskToOrder.model')(sequelize);
  db.AccessoryToOrder = require('server/model/accessoryToOrder.model')(
    sequelize
  );

  db.ChairToQuotation = require('server/model/chairToQuotation.model')(
    sequelize
  );
  db.DeskToQuotation = require('server/model/deskToQuotation.model')(sequelize);
  db.AccessoryToQuotation = require('server/model/accessoryToQuotation.model')(
    sequelize
  );

  db.ChairStock.belongsToMany(db.SalesOrder, { through: db.ChairToOrder });
  db.SalesOrder.belongsToMany(db.ChairStock, { through: db.ChairToOrder });
  db.ChairStock.hasMany(db.ChairToOrder);
  db.ChairToOrder.belongsTo(db.ChairStock);
  db.SalesOrder.hasMany(db.ChairToOrder);
  db.ChairToOrder.belongsTo(db.SalesOrder);

  db.DeskStock.belongsToMany(db.SalesOrder, { through: db.DeskToOrder });
  db.SalesOrder.belongsToMany(db.DeskStock, { through: db.DeskToOrder });
  db.DeskStock.hasMany(db.DeskToOrder);
  db.DeskToOrder.belongsTo(db.DeskStock);
  db.SalesOrder.hasMany(db.DeskToOrder);
  db.DeskToOrder.belongsTo(db.SalesOrder);

  db.AccessoryStock.belongsToMany(db.SalesOrder, {
    through: db.AccessoryToOrder,
  });
  db.SalesOrder.belongsToMany(db.AccessoryStock, {
    through: db.AccessoryToOrder,
  });
  db.AccessoryStock.hasMany(db.AccessoryToOrder);
  db.AccessoryToOrder.belongsTo(db.AccessoryStock);
  db.SalesOrder.hasMany(db.AccessoryToOrder);
  db.AccessoryToOrder.belongsTo(db.SalesOrder);

  db.ChairStock.belongsToMany(db.Quotation, { through: db.ChairToQuotation });
  db.Quotation.belongsToMany(db.ChairStock, { through: db.ChairToQuotation });
  db.ChairStock.hasMany(db.ChairToQuotation);
  db.ChairToQuotation.belongsTo(db.ChairStock);
  db.Quotation.hasMany(db.ChairToQuotation);
  db.ChairToQuotation.belongsTo(db.Quotation);

  db.DeskStock.belongsToMany(db.Quotation, { through: db.DeskToQuotation });
  db.Quotation.belongsToMany(db.DeskStock, { through: db.DeskToQuotation });
  db.DeskStock.hasMany(db.DeskToQuotation);
  db.DeskToQuotation.belongsTo(db.DeskStock);
  db.Quotation.hasMany(db.DeskToQuotation);
  db.DeskToQuotation.belongsTo(db.Quotation);

  db.AccessoryStock.belongsToMany(db.Quotation, {
    through: db.AccessoryToQuotation,
  });
  db.Quotation.belongsToMany(db.AccessoryStock, {
    through: db.AccessoryToQuotation,
  });
  db.AccessoryStock.hasMany(db.AccessoryToQuotation);
  db.AccessoryToQuotation.belongsTo(db.AccessoryStock);
  db.Quotation.hasMany(db.AccessoryToQuotation);
  db.AccessoryToQuotation.belongsTo(db.Quotation);

  db.SalesOrder.belongsTo(db.User, {
    as: 'Seller',
    foreignKey: { name: 'sellerId', allowNull: false },
  });
  db.Quotation.belongsTo(db.User, {
    as: 'Seller',
    foreignKey: { name: 'sellerId', allowNull: false },
  });

  // sync all models with database
  // await sequelize.sync({ alter: true });
  await sequelize.sync();
}
