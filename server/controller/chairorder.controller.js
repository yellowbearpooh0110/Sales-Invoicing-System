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
  return await db.ChairOrder.findAll();
}

async function getById(id) {
  return await getChairOrder(id);
}

async function create(params) {
  // validate
  if (await db.ChairOrder.findOne({ where: { name: params.name } })) {
    throw 'Order Name "' + params.name + '" is already taken';
  }

  // save ChairOrder
  await db.ChairOrder.create(params);
}

async function update(id, params) {
  const chairOrder = await getChairOrder(id);

  // validate
  if (!params.name) throw 'You should provide ChairOrder name';
  if (chairOrder.name === params.name)
    throw 'The should provide a new ChairOrder name';
  if (await db.ChairOrder.findOne({ where: { name: params.name } })) {
    throw 'ChairOrder "' + params.name + '" is already taken';
  }

  // copy params to chairOrder and save
  Object.assign(chairOrder, params);
  await chairOrder.save();
  return chairOrder.get();
}

async function _delete(id) {
  const chairOrder = await getChairOrder(id);
  await chairOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairOrder.destroy({ where });
}

//helper function

async function getChairOrder(id) {
  const chairOrder = await db.ChairOrder.findByPk(id);
  if (!chairOrder) throw 'ChairOrder was not found.';
  return chairOrder;
}
