const fs = require('fs');

module.exports = {
  getAll,
  getById,
  create,
  update,
  signDelivery,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.ChairOrder.findAll({
    where,
    include: [
      { model: db.User, as: 'salesman', attributes: ['email'] },
      {
        model: db.ChairStock,
        as: 'stock',
        attributes: [
          'id',
          'chairRemark',
          'QTY',
          'withHeadrest',
          'withAdArmrest',
        ],
        include: [
          {
            model: db.ChairBrand,
            as: 'chairBrand',
            attributes: ['id', 'name'],
          },
          {
            model: db.ChairModel,
            as: 'chairModel',
            attributes: ['id', 'name'],
          },
          {
            model: db.ProductColor,
            as: 'frameColor',
            attributes: ['id', 'name'],
          },
          {
            model: db.ProductColor,
            as: 'backColor',
            attributes: ['id', 'name'],
          },
          {
            model: db.ProductColor,
            as: 'seatColor',
            attributes: ['id', 'name'],
          },
        ],
        order: ['createdAt'],
      },
    ],
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getChairOrder(id);
}

async function create(params) {
  const {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    withHeadrest,
    withAdArmrest,
    chairRemark,
    ...restParams
  } = params;
  const stockParams = {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    withHeadrest,
    withAdArmrest,
    chairRemark,
  };
  let chairStock = await db.ChairStock.findOne({
    where: stockParams,
  });
  if (!chairStock)
    chairStock = await db.ChairStock.create({ QTY: 0, ...stockParams });
  restParams.stockId = chairStock.id;
  await db.ChairOrder.create(restParams);
}

async function update(id, params) {
  const chairOrder = await getChairOrder(id);
  const {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    withHeadrest,
    withAdArmrest,
    chairRemark,
    ...restParams
  } = params;
  const stockParams = {
    chairBrandId,
    chairModelId,
    frameColorId,
    backColorId,
    seatColorId,
    withHeadrest,
    withAdArmrest,
    chairRemark,
  };
  let chairStock = await db.ChairStock.findOne({
    where: stockParams,
  });
  if (!chairStock)
    chairStock = await db.ChairStock.create({ QTY: 0, ...stockParams });
  restParams.stockId = chairStock.id;
  Object.assign(chairOrder, restParams);
  await chairOrder.save();
  return chairOrder.get();
}

async function signDelivery(id, signature) {
  const chairOrder = await getChairOrder(id);
  if (chairOrder.finished) throw 'This Order is already finished!';
  const dirpath = 'server/uploads/signature';
  const filepath = `${dirpath}/${Date.now()}.png`;
  fs.writeFileSync(filepath, signature, 'base64');
  Object.assign(chairOrder, { signURL: filepath, finished: true });
  await chairOrder.save();
  return chairOrder.get();
}

async function _delete(id) {
  const chairOrder = await getChairOrder(id);
  await chairOrder.destroy();
}

async function _bulkDelete(where) {
  return await db.ChairOrder.destroy({ where });
}

//helper function

async function getChairOrder(id) {
  const chairOrder = await db.ChairOrder.findByPk(id);
  if (!chairOrder) throw 'ChairOrder was not found.';
  return chairOrder;
}
