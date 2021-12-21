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
  updateProducts,
  signDelivery,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getAll(where) {
  return await db.SalesOrder.findAll({
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
  return await getSalesOrder(id);
}

async function create(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const { products, ...restParams } = req.body;
    restParams.sellerId = req.user.id;

    const id = (await db.SalesOrder.create({ ...restParams })).id;

    const salesOrder = await getSalesOrder(id);

    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === 'chair') {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        await salesOrder.addChairStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'desk') {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }

        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        if (restParams.hasDeskTop && !restParams.topSketchUrl) {
          const invoiceNum = `I-${salesOrder.Seller.prefix}${new Date(
            salesOrder.createdAt
          ).getFullYear()}-${('000' + salesOrder.invoiceNum).substr(-3)}`;
          restParams.topSketchUrl = `${protocol}://${host}/${await drawDeskTop({
            invoiceNum,
            ...restParams,
          })}`;
        }
        await salesOrder.addDeskStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'accessory') {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        await salesOrder.addAccessoryStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      }
    }
    res.json({ message: 'New SalesOrder was created successfully.' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const id = req.params.id;
    const salesOrder = await getSalesOrder(id);
    const { ChairStocks, DeskStocks, AccessoryStocks } = salesOrder;
    const { products, ...restParams } = req.body;
    Object.assign(salesOrder, restParams);
    await salesOrder.save();
    for (var index = 0; index < ChairStocks.length; index++) {
      if (!ChairStocks[index].ChairToOrder.preOrder) {
        const stock = await chairStockController.getById(ChairStocks[index].id);
        await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
        await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
      }
      await salesOrder.removeChairStock(ChairStocks[index]);
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      if (!DeskStocks[index].DeskToOrder.preOrder) {
        const stock = await deskStockController.getById(DeskStocks[index].id);
        await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
        await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
      }
      await salesOrder.removeDeskStock(DeskStocks[index].id);
    }
    for (var index = 0; index < AccessoryStocks.length; index++) {
      if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
        const stock = await accessoryStockController.getById(
          AccessoryStocks[index].id
        );
        await stock.increment({
          balance: AccessoryStocks[index].AccessoryToOrder.qty,
        });
        await stock.increment({
          qty: AccessoryStocks[index].AccessoryToOrder.qty,
        });
      }
      await salesOrder.removeAccessoryStock(AccessoryStocks[index].id);
    }
    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === 'chair') {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        await salesOrder.addChairStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'desk') {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }

        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        if (restParams.hasDeskTop && !restParams.topSketchUrl) {
          const invoiceNum = `I-${salesOrder.Seller.prefix}${new Date(
            salesOrder.createdAt
          ).getFullYear()}-${('000' + salesOrder.invoiceNum).substr(-3)}`;
          restParams.topSketchUrl = `${protocol}://${host}/${await drawDeskTop({
            invoiceNum,
            ...restParams,
          })}`;
        }
        await salesOrder.addDeskStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === 'accessory') {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        await salesOrder.addAccessoryStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      }
    }
    res.json({ message: 'SalesOrder was updated successfully.' });
  } catch (err) {
    next(err);
  }
}

async function updateWithoutStock(id, params) {
  const salesOrder = await getSalesOrder(id);
  Object.assign(salesOrder, params);
  await salesOrder.save();
}

async function updateProducts(req, res, next) {
  try {
    const { chairToOrders, deskToOrders, accessoryToOrders } = req.body;
    for (var index = 0; index < chairToOrders.length; index++) {
      const { id, ...params } = chairToOrders[index];
      const chairToOrder = await db.ChairToOrder.findByPk(
        chairToOrders[index].id
      );
      Object.assign(chairToOrder, params);
      await chairToOrder.save();
    }
    for (index = 0; index < deskToOrders.length; index++) {
      const { id, ...params } = deskToOrders[index];
      const deskToOrder = await db.DeskToOrder.findByPk(deskToOrders[index].id);
      Object.assign(deskToOrder, params);
      await deskToOrder.save();
    }
    for (index = 0; index < accessoryToOrders.length; index++) {
      const { id, ...params } = accessoryToOrders[index];
      const accessoryToOrder = await db.AccessoryToOrder.findByPk(
        accessoryToOrders[index].id
      );
      Object.assign(accessoryToOrder, params);
      await accessoryToOrder.save();
    }
    res.json({ message: 'Products were updated successfully.' });
  } catch (err) {
    next(err);
  }
}

async function _delete(id) {
  const salesOrder = await getSalesOrder(id);
  const { ChairStocks, DeskStocks, AccessoryStocks } = salesOrder;
  for (var index = 0; index < ChairStocks.length; index++) {
    if (!ChairStocks[index].ChairToOrder.preOrder) {
      const stock = await chairStockController.getById(ChairStocks[index].id);
      await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
      await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
    }
  }
  for (var index = 0; index < DeskStocks.length; index++) {
    if (!DeskStocks[index].DeskToOrder.preOrder) {
      const stock = await deskStockController.getById(DeskStocks[index].id);
      await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
      await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
    }
  }
  for (var index = 0; index < AccessoryStocks.length; index++) {
    if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
      const stock = await deskStockController.getById(
        AccessoryStocks[index].id
      );
      await stock.increment({
        balance: AccessoryStocks[index].AccessoryToOrder.qty,
      });
      await stock.increment({
        qty: AccessoryStocks[index].AccessoryToOrder.qty,
      });
      await stock.save();
    }
  }
  await salesOrder.destroy();
}

async function _bulkDelete(where) {
  const salesOrders = await getAll(where);
  for (var orderIndex = 0; orderIndex < salesOrders.length; orderIndex++) {
    const { ChairStocks, DeskStocks, AccessoryStocks } = salesOrders[
      orderIndex
    ];
    for (var index = 0; index < ChairStocks.length; index++) {
      if (!ChairStocks[index].ChairToOrder.preOrder) {
        const stock = await chairStockController.getById(ChairStocks[index].id);
        await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
        await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
      }
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      if (!DeskStocks[index].DeskToOrder.preOrder) {
        const stock = await deskStockController.getById(DeskStocks[index].id);
        await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
        await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
      }
    }
    for (var index = 0; index < AccessoryStocks.length; index++) {
      if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
        const stock = await accessoryStockController.getById(
          AccessoryStocks[index].id
        );
        await stock.increment({
          balance: AccessoryStocks[index].AccessoryToOrder.qty,
        });
        await stock.increment({
          qty: AccessoryStocks[index].AccessoryToOrder.qty,
        });
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
  if (!salesOrder) throw 'ChairStock was not found.';
  return salesOrder;
}
