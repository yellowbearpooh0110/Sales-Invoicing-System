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
  return await db.DeskModel.findAll({
    attributes: ['id', 'name'],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getDeskModel(id);
}

async function create(params) {
  await db.DeskModel.create(params);
}

async function update(id, params) {
  const deskModel = await getDeskModel(id);
  Object.assign(deskModel, params);
  await deskModel.save();
  return deskModel.get();
}

async function _delete(id) {
  const deskModel = await getDeskModel(id);
  await deskModel.destroy();
}

async function _bulkDelete(where) {
  return await db.DeskModel.destroy({ where });
}

//helper function

async function getDeskModel(id) {
  const deskModel = await db.DeskModel.findByPk(id);
  if (!deskModel) throw 'DeskModel was not found.';
  return deskModel;
}
