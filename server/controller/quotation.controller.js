const chairStockController = require('./chairStock.controller');
const deskStockController = require('./deskStock.controller');
const accessoryStockController = require('./accessoryStock.controller');
const { drawDeskTop } = require('server/middleware/deskDrawing');

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateWithoutStock,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.Quotation.findAll({
    where,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.User,
        as: 'Seller',
        attributes: ['id', 'firstName', 'lastName', 'prefix'],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
      {
        model: db.DeskStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
    ],
  });
}

async function getById(id) {
  return await getQuotation(id);
}

async function create(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const { products, ...restParams } = req.body;
    restParams.sellerId = req.user.id;

    const quotation = await db.Quotation.create({ ...restParams });

    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === 'chair') {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        await quotation.addChairStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
          },
        });
      } else if (products[index].productType === 'desk') {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productType,
          ...restParams
        } = products[index];

        if (restParams.hasDeskTop && !restParams.topSketchUrl)
          restParams.topSketchUrl = `${protocol}://${host}/${await drawDeskTop({
            topLength: restParams.topLength,
            topWidth: restParams.topWidth,
            topThickness: restParams.topThickness,
            topRoundedCorners: restParams.topRoundedCorners,
            topCornerRadius: restParams.topCornerRadius,
            topHoleCount: restParams.topHoleCount,
            topHoleType: restParams.topHoleType,
          })}`;
        await quotation.addDeskStock(stock, {
          through: {
            unitPrice,
            qty,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'accessory') {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        await quotation.addAccessoryStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
          },
        });
      }
    }
    res.json({ message: 'New Quotation was created successfully.' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const id = req.params.id;
    const quotation = await getQuotation(id);
    const { ChairStocks, DeskStocks, AccessoryStocks } = quotation;
    const { products, ...restParams } = req.body;
    Object.assign(quotation, restParams);
    await quotation.save();
    for (var index = 0; index < ChairStocks.length; index++) {
      await quotation.removeChairStock(ChairStocks[index]);
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      await quotation.removeDeskStock(DeskStocks[index].id);
    }
    for (var index = 0; index < AccessoryStocks.length; index++) {
      await quotation.removeAccessoryStock(AccessoryStocks[index].id);
    }
    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === 'chair') {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        await quotation.addChairStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
          },
        });
      } else if (products[index].productType === 'desk') {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productType,
          ...restParams
        } = products[index];
        if (restParams.hasDeskTop && !restParams.topSketchUrl)
          restParams.topSketchUrl = `${protocol}://${host}/${await drawDeskTop({
            topLength: restParams.topLength,
            topWidth: restParams.topWidth,
            topThickness: restParams.topThickness,
            topRoundedCorners: restParams.topRoundedCorners,
            topCornerRadius: restParams.topCornerRadius,
            topHoleCount: restParams.topHoleCount,
            topHoleType: restParams.topHoleType,
          })}`;
        await quotation.addDeskStock(stock, {
          through: {
            unitPrice,
            qty,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'accessory') {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        await quotation.addAccessoryStock(stock, {
          through: {
            unitPrice: products[index].productPrice,
            qty: products[index].productAmount,
          },
        });
      }
    }
    res.json({ message: 'Quotation was updated successfully.' });
  } catch (err) {
    next(err);
  }
}

async function updateWithoutStock(id, params) {
  const quotation = await getQuotation(id);
  Object.assign(quotation, params);
  await quotation.save();
}

async function _delete(id) {
  const quotation = await getQuotation(id);
  await quotation.destroy();
}

async function _bulkDelete(where) {
  return await db.Quotation.destroy({ where });
}

//helper function

async function getQuotation(id) {
  const quotation = await db.Quotation.findOne({
    where: { id },
    include: [
      {
        model: db.User,
        as: 'Seller',
        attributes: ['id', 'firstName', 'lastName', 'prefix'],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
      {
        model: db.DeskStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      },
    ],
  });
  if (!quotation) throw 'ChairStock was not found.';
  return quotation;
}
