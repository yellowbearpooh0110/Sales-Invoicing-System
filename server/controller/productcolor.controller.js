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
  return await db.ProductColor.findAll({
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairColor(id);
}

async function create(params) {
  await db.ProductColor.create(params);
}

async function update(id, params) {
  const productColor = await getChairColor(id);
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
