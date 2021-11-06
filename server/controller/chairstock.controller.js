const db = require('server/helper/db');
const Sequelize = require('Sequelize');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll() {
  return await db.ChairStock.findAll({
    // attributes: ['id', 'chairBrandRef'],
    include: [{ model: db.ChairBrand, as: 'chairBrand', attributes: ['name'] }],
  });
}

async function getById(id) {
  return await getChairStock(id);
}

async function create(params) {
  const { QTY, ...restParams } = params;
  if (
    await db.ChairStock.findOne({
      where: restParams,
    })
  )
    throw 'Identical ChairStock Exists.';
  // save ChairStock
  await db.ChairStock.create(params);
}

async function update(id, params) {
  const chairStock = await getChairStock(id);
  const { QTY, ...restParams } = params;
  if (
    await db.ChairStock.findOne({
      where: { id: { [Sequelize.Op.ne]: id }, ...restParams },
    })
  )
    throw 'Identical ChairStock Exists.';
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
