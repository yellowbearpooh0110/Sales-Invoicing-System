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
  db.ChairToOrder = require('server/model/chairToOrder.model')(sequelize);
  db.AccessoryToOrder = require('server/model/accessoryToOrder.model')(
    sequelize
  );
  db.DeskToOrder = require('server/model/deskToOrder.model')(sequelize);

  db.ChairStock.belongsToMany(db.SalesOrder, { through: db.ChairToOrder });
  db.SalesOrder.belongsToMany(db.ChairStock, { through: db.ChairToOrder });

  db.DeskStock.belongsToMany(db.SalesOrder, { through: db.DeskToOrder });
  db.SalesOrder.belongsToMany(db.DeskStock, { through: db.DeskToOrder });

  db.AccessoryStock.belongsToMany(db.SalesOrder, {
    through: db.AccessoryToOrder,
  });
  db.SalesOrder.belongsToMany(db.AccessoryStock, {
    through: db.AccessoryToOrder,
  });

  db.SalesOrder.belongsTo(db.User, {
    as: 'seller',
    foreignKey: { name: 'sellerId', allowNull: false },
  });

  // sync all models with database
  // await sequelize.sync({ alter: true });
  await sequelize.sync();
}
