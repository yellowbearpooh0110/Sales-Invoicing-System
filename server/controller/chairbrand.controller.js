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
  return await db.ChairBrand.findAll();
}

async function getById(id) {
  return await getChairBrand(id);
}

async function create(params) {
  await db.ChairBrand.create(params);
}

async function update(id, params) {
  const chairBrand = await getChairBrand(id);
  Object.assign(chairBrand, params);
  await chairBrand.save();
  return chairBrand.get();
}

async function _delete(id) {
  const chairBrand = await getChairBrand(id);
  await chairBrand.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairBrand.destroy({ where });
}

//helper function

async function getChairBrand(id) {
  const chairBrand = await db.ChairBrand.findByPk(id);
  if (!chairBrand) throw 'ChairBrand was not found.';
  return chairBrand;
}
