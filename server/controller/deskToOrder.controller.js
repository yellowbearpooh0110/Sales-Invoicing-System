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
  return await db.DeskToOrder.findAll({
    where,
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getDeskToOrder(id);
}

async function create(params) {
  const { unitPrice, qty, ...restParams } = params;
  if (
    await db.DeskToOrder.findOne({
      where: { ...restParams },
    })
  )
    throw 'Identical DeskStock Exists.';
  await db.DeskToOrder.create({ ...params });
}

async function update(id, params) {
  const deskToOrder = await getDeskToOrder(id);
  const { unitPrice, qty, ...restParams } = params;
  if (
    await db.DeskToOrder.findOne({
      where: { id: { [Sequelize.Op.ne]: id }, ...restParams },
    })
  )
    throw 'Identical DeskStock Exists.';
  Object.assign(deskToOrder, params);
  await deskToOrder.save();
  return deskToOrder.get();
}

async function _delete(id) {
  const deskToOrder = await getDeskToOrder(id);
  await deskToOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.DeskToOrder.destroy({ where });
}

//helper function

async function getDeskToOrder(id) {
  const deskToOrder = await db.DeskToOrder.findByPk(id);
  if (!deskToOrder) throw 'DeskStock was not found.';
  return deskToOrder;
}
