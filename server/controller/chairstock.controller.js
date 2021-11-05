const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('server/helper/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll() {
  return await db.ChairStock.findAll();
}

async function getById(id) {
  return await getChairStock(id);
}

async function create(params) {
  // save ChairStock
  await db.ChairStock.create(params);
}

async function update(id, params) {
  const chairStock = await getChairStock(id);
  Object.assign(chairStock, params);
  await chairStock.save();
  return chairStock.get();
}

async function _delete(id) {
  const chairStock = await getChairStock(id);
  await chairStock.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairStock.destroy({ where });
}

//helper function

async function getChairStock(id) {
  const chairStock = await db.ChairStock.findByPk(id);
  if (!chairStock) throw 'ChairStock was not found.';
  return chairStock;
}
