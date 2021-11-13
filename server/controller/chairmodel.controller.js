module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll() {
  return await db.ChairModel.findAll({
    attributes: ['id', 'name'],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairModel(id);
}

async function create(params) {
  await db.ChairModel.create(params);
}

async function update(id, params) {
  const chairModel = await getChairModel(id);
  Object.assign(chairModel, params);
  await chairModel.save();
  return chairModel.get();
}

async function _delete(id) {
  const chairModel = await getChairModel(id);
  await chairModel.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairModel.destroy({ where });
}

//helper function

async function getChairModel(id) {
  const chairModel = await db.ChairModel.findByPk(id);
  if (!chairModel) throw 'ChairModel was not found.';
  return chairModel;
}
