const fs = require('fs');

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateWithoutStock,
  signDelivery,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.DeskOrder.findAll({
    where,
    include: [
      {
        model: db.User,
        as: 'salesman',
        attributes: ['firstName', 'lastName', 'prefix'],
      },
      {
        model: db.DeskStock,
        as: 'stock',
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
        ],
        include: [
          { model: db.DeskModel, as: 'deskModel', attributes: ['id', 'name'] },
          { model: db.ProductColor, as: 'color', attributes: ['id', 'name'] },
        ],
        order: ['createdAt'],
      },
    ],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await db.DeskOrder.findOne({
    where: { id: id },
    include: [
      {
        model: db.User,
        as: 'salesman',
        attributes: ['firstName', 'lastName', 'prefix'],
      },
      {
        model: db.DeskStock,
        as: 'stock',
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
        ],
        include: [
          { model: db.DeskModel, as: 'deskModel', attributes: ['id', 'name'] },
          { model: db.ProductColor, as: 'color', attributes: ['id', 'name'] },
        ],
        order: ['createdAt'],
      },
    ],
    order: ['createdAt'],
  });
}

async function create(params) {
  const {
    deskModelId,
    colorId,
    armSize,
    feetSize,
    beam,
    akInfo,
    woodInfo_1,
    woodInfo_2,
    melamineInfo,
    laminateInfo,
    bambooInfo,
    deskRemark,
    ...restParams
  } = params;
  const stockParams = {
    deskModelId,
    colorId,
    armSize,
    feetSize,
    beam,
    akInfo,
    woodInfo_1,
    woodInfo_2,
    melamineInfo,
    laminateInfo,
    bambooInfo,
    deskRemark,
  };

  let deskStock = await db.DeskStock.findOne({
    where: stockParams,
  });
  if (!deskStock)
    deskStock = await db.DeskStock.create({
      ...stockParams,
      // isRegistered: false,
      isRegistered: true,
      QTY: 0,
    });
  restParams.stockId = deskStock.id;

  // Check updated DeskStock is registered and its QTY, then determine the DeskOrder is preorder or not
  if (!deskStock.isRegistered || deskStock.QTY < restParams.QTY)
    restParams.isPreOrder = true;
  else {
    deskStock.QTY -= restParams.QTY;
    await deskStock.save();
    restParams.isPreOrder = false;
  }
  await db.ChairOrder.create(restParams);
}

async function update(id, params) {
  const deskOrder = await getDeskOrder(id);
  const {
    deskModelId,
    colorId,
    armSize,
    feetSize,
    beam,
    akInfo,
    woodInfo_1,
    woodInfo_2,
    melamineInfo,
    laminateInfo,
    bambooInfo,
    deskRemark,
    ...restParams
  } = params;
  const stockParams = {
    deskModelId,
    colorId,
    armSize,
    feetSize,
    beam,
    akInfo,
    woodInfo_1,
    woodInfo_2,
    melamineInfo,
    laminateInfo,
    bambooInfo,
    deskRemark,
  };

  // Plus the DeskStock QTY if the DeskOrder was not a pre-order
  if (!deskOrder.isPreOrder) {
    const formerDeskStock = await db.DeskStock.findByPk(deskOrder.stockId);
    if (formerDeskStock) {
      formerDeskStock.QTY += deskOrder.QTY;
      await formerDeskStock.save();
    }
  }

  let deskStock = await db.DeskStock.findOne({
    where: stockParams,
  });
  if (!deskStock)
    deskStock = await db.DeskStock.create({
      ...stockParams,
      // isRegistered: false,
      isRegistered: true,
      QTY: 0,
    });
  restParams.stockId = deskStock.id;

  // Check updated DeskStock is registered and its QTY, then determine the DeskOrder is preorder or not
  if (!deskStock.isRegistered || deskStock.QTY < restParams.QTY)
    restParams.isPreOrder = true;
  else {
    deskStock.QTY -= restParams.QTY;
    await deskStock.save();
    restParams.isPreOrder = false;
  }
  Object.assign(deskOrder, restParams);
  await deskOrder.save();
  return deskOrder.get();
}

async function updateWithoutStock(id, params) {
  const deskOrder = await getDeskOrder(id);
  Object.assign(deskOrder, params);
  await deskOrder.save();
  return deskOrder.get();
}

async function signDelivery(id, signature) {
  const deskOrder = await getDeskOrder(id);
  if (deskOrder.finished) throw 'This Order is already finished!';
  const dirpath = 'uploads/signature';
  const filepath = `${dirpath}/${Date.now()}.png`;
  fs.writeFileSync(`server/${filepath}`, signature, 'base64');
  Object.assign(deskOrder, { signURL: filepath, finished: true });
  await deskOrder.save();
  return deskOrder.get();
}

async function _delete(id) {
  const deskOrder = await getDeskOrder(id);
  await deskOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.DeskOrder.destroy({ where });
}

//helper function

async function getDeskOrder(id) {
  const deskOrder = await db.DeskOrder.findByPk(id);
  if (!deskOrder) throw 'DeskOrder was not found.';
  return deskOrder;
}
