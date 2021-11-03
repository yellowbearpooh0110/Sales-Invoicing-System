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
};

async function getAll() {
  return await db.ChairModel.findAll();
}

async function getById(id) {
  getChairModel(id);
}

async function create(params) {
  // validate
  if (await db.ChairModel.findOne({ where: { name: params.name } })) {
    throw 'Model Name "' + params.name + '" is already taken';
  }

  // save ChairModel
  await db.ChairModel.create(params);
}

async function update(id, params) {
  const chairModel = await getChairModel(id);

  // validate
  if (!params.name) throw 'You should provide ChairModel name';
  if (chairModel.name !== params.name)
    throw 'The should provide a new ChairModel name';
  if (await db.ChairModel.findOne({ where: { name: params.name } })) {
    throw 'ChairModel "' + params.name + '" is already taken';
  }

  // copy params to chairModel and save
  Object.assign(chairModel, params);
  await chairModel.save();
  return chairModel.get();
}

async function _delete(id) {
  const chairModel = await getChairModel(id);
  await chairModel.destroy();
}

//helper function

async function getChairModel(id) {
  const chairModel = await db.ChairModel.findByPk(id);
  if (!chairModel) throw 'ChairModel was not found.';
  return chairModel;
}
