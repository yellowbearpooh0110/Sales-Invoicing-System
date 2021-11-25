const chairStockController = require('./chairStock.controller');
const deskStockController = require('./deskStock.controller');
const accessoryStockController = require('./accessoryStock.controller');

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
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'prefix'],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
      {
        model: db.DeskStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
    ],
  });
}

async function getById(id) {
  return await getQuotation(id);
}

async function create(params) {
  const { products, ...restParams } = params;

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
      await quotation.addDeskStock(stock, {
        through: {
          unitPrice: products[index].productPrice,
          qty: products[index].productAmount,
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
}

async function update(id, params) {
  const quotation = await getQuotation(id);
  const { ChairStocks, DeskStocks, AccessoryStocks } = quotation;
  const { products, ...restParams } = params;
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
      await quotation.addDeskStock(stock, {
        through: {
          unitPrice: products[index].productPrice,
          qty: products[index].productAmount,
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
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'prefix'],
      },
      {
        model: db.ChairStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
      {
        model: db.DeskStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: ['unitPrice', 'qty'],
        },
      },
    ],
  });
  if (!quotation) throw 'ChairStock was not found.';
  return quotation;
}
