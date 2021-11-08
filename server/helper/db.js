const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;
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
  db.ChairBrand = require('server/model/chairbrand.model')(sequelize);
  db.ChairModel = require('server/model/chairmodel.model')(sequelize);
  db.ChairStock = require('server/model/chairstock.model')(sequelize);
  db.ChairOrder = require('server/model/chairorder.model')(sequelize);
  db.DeskModel = require('server/model/deskmodel.model')(sequelize);
  db.DeskStock = require('server/model/deskstock.model')(sequelize);
  db.DeskOrder = require('server/model/deskorder.model')(sequelize);
  db.ProductColor = require('server/model/productcolor.model')(sequelize);

  // sync all models with database
  await sequelize.sync();
}
