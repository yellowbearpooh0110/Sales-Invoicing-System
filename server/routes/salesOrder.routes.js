const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sequelize = require('sequelize');

const admin = require('server/middleware/admin');
const salesman = require('server/middleware/salesman');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const salesOrderController = require('server/controller/salesOrder.controller');

router.post('/create', authorize(), createSchema, create);
router.get('/', admin(), getAll);
router.get('/getDelivery', authorize(), getDelivery);
router.get('/current', salesman(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/withoutStock/:id', salesman(), updateSchema, updateWithoutStock);
router.put('/:id', salesman(), createSchema, update);
router.post('/sign', authorize(), signSchema, signDelivery);
router.delete('/:id', salesman(), _delete);
router.delete('/', salesman(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().allow('').required(),
    email: Joi.string().allow('').required(),
    phone: Joi.string().allow('').required(),
    district: Joi.string().allow('').required(),
    street: Joi.string().allow('').required(),
    block: Joi.string().allow('').required(),
    floor: Joi.string().allow('').required(),
    unit: Joi.string().allow('').required(),
    remark: Joi.string().allow('').required(),
    deliveryDate: Joi.date().allow(null).required(),
    products: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    paid: Joi.boolean(),
    finished: Joi.boolean(),
  });
  validateRequest(req, next, schema);
}

function bulkDeleteSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function signSchema(req, res, next) {
  const schema = Joi.object({
    orderId: Joi.string().guid().required(),
    signature: Joi.string()
      // .base64({ paddingRequired: false, urlSafe: true })
      .required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  salesOrderController
    .create({ ...req.body, sellerId: req.user.id })
    .then(() => {
      res.json({ message: 'New SalesOrder was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  salesOrderController
    .getAll()
    .then((salesOrders) =>
      res.json(
        salesOrders.map((item) => {
          item.invoiceNum =
            item.seller.prefix + ('000' + item.invoiceNum).substr(-3);
          return item;
        })
      )
    )
    .catch(next);
}

function getDelivery(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  const deliveryDate = new Date(
    req.query.deliveryDate.replace(/(\d+[/])(\d+[/])/, '$2$1')
  );
  const nextDate = new Date(deliveryDate.getTime() + 24 * 60 * 60 * 1000);

  const where = {
    deliveryDate: {
      [Sequelize.Op.gte]: deliveryDate,
      [Sequelize.Op.lt]: nextDate,
    },
    paid: true,
  };
  salesOrderController
    .getAll(where)
    .then((salesOrders) =>
      res.json(
        salesOrders.map(
          ({
            id,
            invoiceNum,
            clientName,
            clientPhone,
            clientEmail,
            clientDistrict,
            clientStreet,
            clientBlock,
            clientFloor,
            clientUnit,
            clientRemark,
            paid,
            finished,
            signUrl,
            qty,
            stock,
            salesman,
          }) => ({
            id,
            clientName,
            clientPhone,
            clientEmail,
            clientDistrict,
            clientStreet,
            clientBlock,
            clientFloor,
            clientUnit,
            clientRemark,
            paid,
            finished,
            signUrl: signUrl !== '' ? `${protocol}://${host}/${signUrl}` : null,
            qty,
            invoiceNum:
              'C_' + salesman.prefix + ('000' + invoiceNum).substr(-3),
            model: stock.chairModel ? stock.chairModel.name : null,
            frameColor: stock.frameColor ? stock.frameColor.name : null,
          })
        )
      )
    )
    .catch(next);
}

function getCurrent(req, res, next) {
  salesOrderController
    .getAll({ sellerId: req.user.id })
    .then((salesOrders) => res.json(salesOrders))
    .catch(next);
}

function getById(req, res, next) {
  salesOrderController
    .getById(req.params.id)
    .then((salesOrder) => res.json(salesOrder))
    .catch(next);
}

// function getByToken(req, res, next) {
//   req.params.token;
//   salesOrderController
//     .getById(req.params.id)
//     .then((salesOrder) => res.json(salesOrder))
//     .catch(next);
// }

function update(req, res, next) {
  salesOrderController
    .update(req.params.id, req.body)
    .then((salesOrder) => res.json(salesOrder))
    .catch(next);
}

function updateWithoutStock(req, res, next) {
  salesOrderController
    .updateWithoutStock(req.params.id, req.body)
    .then((salesOrder) => res.json(salesOrder))
    .catch(next);
}

function signDelivery(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  salesOrderController
    .signDelivery(req.body.orderId, req.body.signature)
    .then((salesOrder) => {
      res.json({
        success: true,
        url: `${protocol}://${host}/${salesOrder.signUrl}`,
      });
    })
    .catch(next);
}

function _delete(req, res, next) {
  salesOrderController
    .delete(req.params.id)
    .then(() => res.json({ message: 'SalesOrder was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  salesOrderController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} SalesOrder${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
