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
  return await db.ProductColor.findAll();
}

async function getById(id) {
  return await getChairColor(id);
}

async function create(params) {
  // validate
  if (await db.ProductColor.findOne({ where: { name: params.name } })) {
    throw 'Color Name "' + params.name + '" is already taken';
  }

  // save ProductColor
  await db.ProductColor.create(params);
}

async function update(id, params) {
  const productColor = await getChairColor(id);

  // validate
  if (!params.name) throw 'You should provide ProductColor name';
  if (productColor.name === params.name)
    throw 'The should provide a new ProductColor name';
  if (await db.ProductColor.findOne({ where: { name: params.name } })) {
    throw 'ProductColor "' + params.name + '" is already taken';
  }

  // copy params to productColor and save
  Object.assign(productColor, params);
  await productColor.save();
  return productColor.get();
}

async function _delete(id) {
  const productColor = await getChairColor(id);
  await productColor.destroy();
}

async function _bulkDelete(where) {
  return await db.ProductColor.destroy({ where });
}

//helper function

async function getChairColor(id) {
  const productColor = await db.ProductColor.findByPk(id);
  if (!productColor) throw 'ProductColor was not found.';
  return productColor;
}
