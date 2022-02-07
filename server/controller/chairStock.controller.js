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

async function getFeatures() {
  return await db.ChairStock.findAll({
    attributes: ['brand', 'model'],
    group: ['brand', 'model'],
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

async function create(req, res, next) {
  try {
    const params = req.body;
    const {
      thumbnailURL,
      balance,
      qty,
      shipmentDate,
      arrivalDate,
      ...restParams
    } = params;
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
    res.json({ message: 'New ChairStock was created successfully.' });
  } catch (err) {
    next(err);
  }
}

async function update(id, params) {
  const chairStock = await getChairStock(id);
  const {
    thumbnailURL,
    balance,
    qty,
    shipmentDate,
    arrivalDate,
    ...restParams
  } = params;
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
