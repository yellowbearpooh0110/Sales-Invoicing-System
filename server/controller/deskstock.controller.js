const Sequelize = require('sequelize');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll() {
  return await db.DeskStock.findAll({
    attributes: [
      'id',
      'armSize',
      'feetSize',
      'beam',
      'akInfo',
      'woodInfo_1',
      'woodInfo_2',
      'melamineInfo',
      'laminateInfo',
      'bambooInfo',
      'deskRemark',
      'QTY',
    ],
    include: [
      { model: db.DeskModel, as: 'deskModel', attributes: ['name'] },
      { model: db.ProductColor, as: 'color', attributes: ['name'] },
    ],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getDeskStock(id);
}

async function create(params) {
  const { QTY, ...restParams } = params;
  if (
    await db.DeskStock.findOne({
      where: restParams,
    })
  )
    throw 'Identical DeskStock Exists.';
  // save DeskStock
  await db.DeskStock.create(params);
}

async function update(id, params) {
  const deskStock = await getDeskStock(id);
  const { QTY, ...restParams } = params;
  if (
    await db.DeskStock.findOne({
      where: { id: { [Sequelize.Op.ne]: id }, ...restParams },
    })
  )
    throw 'Identical DeskStock Exists.';
  Object.assign(deskStock, params);
  await deskStock.save();
  return deskStock.get();
}

async function _delete(id) {
  const deskStock = await getDeskStock(id);
  await deskStock.destroy();
}

async function _bulkDelete(where) {
  return await db.DeskStock.destroy({ where });
}

//helper function

async function getDeskStock(id) {
  const deskStock = await db.DeskStock.findByPk(id);
  if (!deskStock) throw 'DeskStock was not found.';
  return deskStock;
}
