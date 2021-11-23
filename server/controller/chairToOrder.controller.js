const Sequelize = require('sequelize');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.ChairToOrder.findAll({
    where,
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairToOrder(id);
}

async function create(params) {
  const { unitPrice, qty, ...restParams } = params;
  if (
    await db.ChairToOrder.findOne({
      where: { ...restParams },
    })
  )
    throw 'There was an error while creating new sales order.';
  await db.ChairToOrder.create({ ...params });
}

async function update(id, params) {
  const chairToOrder = await getChairToOrder(id);
  const { unitPrice, qty, ...restParams } = params;
  if (
    await db.ChairToOrder.findOne({
      where: { id: { [Sequelize.Op.ne]: id }, ...restParams },
    })
  )
    throw 'Identical ChairStock Exists.';
  Object.assign(chairToOrder, params);
  await chairToOrder.save();
  return chairToOrder.get();
}

async function _delete(id) {
  const chairToOrder = await getChairToOrder(id);
  await chairToOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairToOrder.destroy({ where });
}

//helper function

async function getChairToOrder(id) {
  const chairToOrder = await db.ChairToOrder.findByPk(id);
  if (!chairToOrder) throw 'ChairStock was not found.';
  return chairToOrder;
}
