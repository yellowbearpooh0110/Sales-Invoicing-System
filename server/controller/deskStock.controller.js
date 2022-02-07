const Sequelize = require('sequelize');

module.exports = {
  getFeatures,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getFeatures(req, res, next) {
  try {
    const features = await db.DeskStock.findAll({
      attributes: ['supplierCode', 'model', 'color'],
      group: ['supplierCode', 'model', 'color'],
    });
    res.json(features);
  } catch (err) {
    next(err);
  }
}

async function getAll(where) {
  return await db.DeskStock.findAll({
    where,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getDeskStock(id);
}

async function create(params) {
  const {
    thumbnailURL,
    balance,
    qty,
    shipmentDate,
    arrivalDate,
    ...restParams
  } = params;
  const nonRegistered = await db.DeskStock.findOne({
    where: { isRegistered: false, ...restParams },
  });
  const registered = await db.DeskStock.findOne({
    where: { isRegistered: true, ...restParams },
  });
  if (registered) throw 'Identical DeskStock Exists.';
  else {
    if (nonRegistered) {
      // set isRegistered as true and save
      nonRegistered.isRegistered = true;
      await nonRegistered.save();
    } else {
      // save registered DeskStock
      await db.DeskStock.create({ ...params, isRegistered: true });
    }
  }
}

async function update(id, params) {
  const deskStock = await getDeskStock(id);
  const {
    thumbnailURL,
    balance,
    qty,
    shipmentDate,
    arrivalDate,
    ...restParams
  } = params;
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
