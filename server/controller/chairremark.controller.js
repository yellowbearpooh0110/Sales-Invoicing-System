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
  return await db.ChairRemark.findAll();
}

async function getById(id) {
  return await getChairRemark(id);
}

async function create(params) {
  await db.ChairRemark.create(params);
}

async function update(id, params) {
  const chairRemark = await getChairRemark(id);
  Object.assign(chairRemark, params);
  await chairRemark.save();
  return chairRemark.get();
}

async function _delete(id) {
  const chairRemark = await getChairRemark(id);
  await chairRemark.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairRemark.destroy({ where });
}

//helper function

async function getChairRemark(id) {
  const chairRemark = await db.ChairRemark.findByPk(id);
  if (!chairRemark) throw 'ChairRemark was not found.';
  return chairRemark;
}
