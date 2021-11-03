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
  // validate
  if (
    await db.ChairStock.findOne({
      where: {
        frameColor: params.frameColor ? params.frameColor : null,
        backColor: params.backColor ? params.backColor : null,
        seatColor: params.seatColor ? params.seatColor : null,
        withHeadrest: params.withHeadrest ? params.withHeadrest : null,
        chairBrand: params.chairBrand ? params.chairBrand : null,
        chairModel: params.chairModel ? params.chairModel : null,
      },
    })
  ) {
    throw 'Identical Stock is already exist.';
  }

  // save ChairStock
  await db.ChairStock.create(params);
}

async function update(id, params) {
  const chairStock = await getChairStock(id);

  // validate
  if (!params.name) throw 'You should provide ChairStock name';
  if (chairStock.name === params.name)
    throw 'The should provide a new ChairStock name';
  if (await db.ChairStock.findOne({ where: { name: params.name } })) {
    throw 'ChairStock "' + params.name + '" is already taken';
  }

  // copy params to chairStock and save
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
