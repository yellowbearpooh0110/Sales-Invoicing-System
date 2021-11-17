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
  return await db.ChairStock.findAll({
    attributes: ['id', 'chairRemark', 'QTY', 'withHeadrest', 'withAdArmrest'],
    include: [
      { model: db.ChairBrand, as: 'chairBrand', attributes: ['id', 'name'] },
      { model: db.ChairModel, as: 'chairModel', attributes: ['id', 'name'] },
      { model: db.ProductColor, as: 'frameColor', attributes: ['id', 'name'] },
      { model: db.ProductColor, as: 'backColor', attributes: ['id', 'name'] },
      { model: db.ProductColor, as: 'seatColor', attributes: ['id', 'name'] },
    ],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairStock(id);
}

async function create(params) {
  const { QTY, ...restParams } = params;
  const nonRegistered = await db.ChairStock.findOne({
    where: { isRegistered: false, ...restParams },
  });
  const registered = await db.ChairStock.findOne({
    where: { isRegistered: true, ...restParams },
  });
  if (registered) throw 'Identical ChairStock Exists.';
  else {
    if (nonRegistered) {
      // set isRegistered as true and save
      nonRegistered.isRegistered = true;
      await nonRegistered.save();
    } else {
      // save registered ChairStock
      await db.ChairStock.create({ ...params, isRegistered: true });
    }
  }
}

async function update(id, params) {
  console.log(params);
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
