const Sequelize = require('sequelize');

module.exports = {
  getBrands,
  getModels,
  getFrameColors,
  getBackColors,
  getSeatColors,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getBrands() {
  return await db.ChairStock.findAll({
    attributes: ['brand'],
    group: ['brand'],
    order: ['createdAt'],
  });
}

async function getModels() {
  return await db.ChairStock.findAll({
    attributes: ['model'],
    group: ['model'],
    order: ['createdAt'],
  });
}
async function getFrameColors() {
  return await db.ChairStock.findAll({
    attributes: ['frameColor'],
    group: ['frameColor'],
    order: ['createdAt'],
  });
}

async function getSeatColors() {
  return await db.ChairStock.findAll({
    attributes: ['seatColor'],
    group: ['seatColor'],
    order: ['createdAt'],
  });
}

async function getBackColors() {
  return await db.ChairStock.findAll({
    attributes: ['backColor'],
    group: ['backColor'],
    order: ['createdAt'],
  });
}

async function getAll(where) {
  return await db.ChairStock.findAll({
    where,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairStock(id);
}

async function create(params) {
  const { balance, qty, shipmentDate, arrivalDate, ...restParams } = params;
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
  const { balance, qty, shipmentDate, arrivalDate, ...restParams } = params;
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
