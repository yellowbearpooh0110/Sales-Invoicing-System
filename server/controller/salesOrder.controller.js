const chairStockController = require('./chairStock.controller');
const deskStockController = require('./deskStock.controller');
const chairToOrderController = require('./chairToOrder.controller');
const deskToOrderController = require('./deskToOrder.controller');

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
  return await db.SalesOrder.findAll({
    where,
    order: ['createdAt'],
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
    ],
  });
}

async function getById(id) {
  return await getSalesOrder(id);
}

async function create(params) {
  const { products, ...restParams } = params;

  const salesOrder = await db.SalesOrder.create({ ...restParams });

  for (var index = 0; index < products.length; index++) {
    if (products[index].productType === 'chair') {
      const stock = await chairStockController.getById(
        products[index].productId
      );
      let preOrder = true;
      if (stock.balance >= products[index].productAmount) {
        stock.balance -= products[index].productAmount;
        stock.qty -= products[index].productAmount;
        preOrder = false;
        await stock.save();
      }
      await salesOrder.addChairStock(stock, {
        through: {
          unitPrice: products[index].unitPrice,
          qty: products[index].productAmount,
          preOrder,
        },
      });
    } else if (products[index].productType === 'desk') {
      const stock = await deskStockController.getById(
        products[index].productId
      );
      let preOrder = true;
      if (stock.balance >= products[index].productAmount) {
        stock.balance -= products[index].productAmount;
        stock.qty -= products[index].productAmount;
        preOrder = false;
        await stock.save();
      }
      await salesOrder.addDeskStock(stock, {
        through: {
          unitPrice: products[index].unitPrice,
          qty: products[index].productAmount,
          preOrder,
        },
      });
    }
  }
}

async function update(id, params) {
  const salesOrder = await getSalesOrder(id);
  const { ChairStocks, DeskStocks } = salesOrder;
  const { products, ...restParams } = params;
  Object.assign(salesOrder, restParams);
  await salesOrder.save();
  for (var index = 0; index < ChairStocks.length; index++) {
    if (!ChairStocks[index].ChairToOrder.preOrder) {
      const stock = await chairStockController.getById(ChairStocks[index].id);
      stock.balance += ChairStocks[index].ChairToOrder.qty;
      stock.qty += ChairStocks[index].ChairToOrder.qty;
      await stock.save();
    }
    salesOrder.removeChairStock(ChairStocks[index]);
  }
  for (var index = 0; index < DeskStocks.length; index++) {
    if (!DeskStocks[index].DeskToOrder.preOrder) {
      const stock = await deskStockController.getById(DeskStocks[index].id);
      stock.balance += DeskStocks[index].DeskToOrder.qty;
      stock.qty += DeskStocks[index].DeskToOrder.qty;
      await stock.save();
    }
    salesOrder.remove(DeskStocks[index].id);
  }
  for (var index = 0; index < products.length; index++) {
    if (products[index].productType === 'chair') {
      const stock = await chairStockController.getById(
        products[index].productId
      );
      let preOrder = true;
      if (stock.balance >= products[index].productAmount) {
        stock.balance -= products[index].productAmount;
        stock.qty -= products[index].productAmount;
        preOrder = false;
        await stock.save();
      }
      await salesOrder.addChairStock(stock, {
        through: {
          unitPrice: products[index].unitPrice,
          qty: products[index].productAmount,
          preOrder,
        },
      });
    } else if (products[index].productType === 'desk') {
      const stock = await deskStockController.getById(
        products[index].productId
      );
      let preOrder = true;
      if (stock.balance >= products[index].productAmount) {
        stock.balance -= products[index].productAmount;
        stock.qty -= products[index].productAmount;
        preOrder = false;
        await stock.save();
      }
      await salesOrder.addDeskStock(stock, {
        through: {
          unitPrice: products[index].unitPrice,
          qty: products[index].productAmount,
          preOrder,
        },
      });
    }
  }
}

async function updateWithoutStock(id, params) {
  const salesOrder = await getSalesOrder(id);
  Object.assign(salesOrder, params);
  await salesOrder.save();
}

async function _delete(id) {
  const salesOrder = await getSalesOrder(id);
  const { ChairStocks, DeskStocks } = salesOrder;
  for (var index = 0; index < ChairStocks.length; index++) {
    if (!ChairStocks[index].ChairToOrder.preOrder) {
      const stock = await chairStockController.getById(ChairStocks[index].id);
      stock.balance += ChairStocks[index].ChairToOrder.qty;
      stock.qty += ChairStocks[index].ChairToOrder.qty;
      await stock.save();
    }
  }
  for (var index = 0; index < DeskStocks.length; index++) {
    if (!DeskStocks[index].DeskToOrder.preOrder) {
      const stock = await deskStockController.getById(DeskStocks[index].id);
      stock.balance += DeskStocks[index].DeskToOrder.qty;
      stock.qty += DeskStocks[index].DeskToOrder.qty;
      await stock.save();
    }
  }
  await salesOrder.destroy();
}

async function _bulkDelete(where) {
  const salesOrders = await getAll(where);
  for (var orderIndex = 0; orderIndex < salesOrders.length; orderIndex++) {
    const { ChairStocks, DeskStocks } = salesOrders[orderIndex];
    for (var index = 0; index < ChairStocks.length; index++) {
      if (!ChairStocks[index].ChairToOrder.preOrder) {
        const stock = await chairStockController.getById(ChairStocks[index].id);
        stock.balance += ChairStocks[index].ChairToOrder.qty;
        stock.qty += ChairStocks[index].ChairToOrder.qty;
        await stock.save();
      }
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      if (!DeskStocks[index].DeskToOrder.preOrder) {
        const stock = await deskStockController.getById(DeskStocks[index].id);
        stock.balance += DeskStocks[index].DeskToOrder.qty;
        stock.qty += DeskStocks[index].DeskToOrder.qty;
        await stock.save();
      }
    }
  }
  return await db.SalesOrder.destroy({ where });
}

async function signDelivery(id, signature) {
  const salesOrder = await getSalesOrder(id);
  if (salesOrder.finished) throw 'This Order is already finished!';
  const dirpath = 'uploads/signature';
  const filepath = `${dirpath}/${Date.now()}.png`;
  fs.writeFileSync(`server/${filepath}`, signature, 'base64');
  Object.assign(salesOrder, { signUrl: filepath, finished: true });
  await salesOrder.save();
  return salesOrder.get();
}

//helper function

async function getSalesOrder(id) {
  const salesOrder = await db.SalesOrder.findOne({
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
          attributes: ['unitPrice', 'qty', 'preOrder'],
        },
      },
      {
        model: db.DeskStock,
        through: {
          attributes: ['unitPrice', 'qty', 'preOrder'],
        },
      },
    ],
  });
  if (!salesOrder) throw 'ChairStock was not found.';
  return salesOrder;
}
