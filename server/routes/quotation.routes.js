const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sequelize = require('sequelize');

const admin = require('server/middleware/admin');
const salesman = require('server/middleware/salesman');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const quotationController = require('server/controller/quotation.controller');

router.post('/create', authorize(), createSchema, create);
router.get('/', admin(), getAll);
router.get('/current', salesman(), getCurrent);
router.get('/:id', getById);
router.put('/withoutStock/:id', salesman(), updateSchema, updateWithoutStock);
router.put('/:id', salesman(), createSchema, update);
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
    timeLine: Joi.number().integer().min(0).required(),
    products: Joi.array().required(),
    paid: Joi.boolean().required(),
    paymentTerms: Joi.string().allow('').required(),
    dueDate: Joi.date().allow(null).required().messages({
      'any.required': `Shipment Date field is required.`,
      'date.base': `Shipment Date should be a valid date type.`,
    }),
    discount: Joi.number().min(0).max(100).required(),
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

function create(req, res, next) {
  quotationController
    .create({ ...req.body, sellerId: req.user.id })
    .then(() => {
      res.json({ message: 'New Quotation was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  quotationController
    .getAll()
    .then((quotations) =>
      res.json(
        quotations.map((item) => {
          item.quotationNum =
            item.Seller.prefix + ('000' + item.quotationNum).substr(-3);
          return item;
        })
      )
    )
    .catch(next);
}

function getCurrent(req, res, next) {
  quotationController
    .getAll({ SellerId: req.user.id })
    .then((quotations) => res.json(quotations))
    .catch(next);
}

function getById(req, res, next) {
  quotationController
    .getById(req.params.id)
    .then((quotation) => res.json(quotation))
    .catch(next);
}

// function getByToken(req, res, next) {
//   req.params.token;
//   quotationController
//     .getById(req.params.id)
//     .then((quotation) => res.json(quotation))
//     .catch(next);
// }

function update(req, res, next) {
  quotationController
    .update(req.params.id, req.body)
    .then((quotation) => res.json(quotation))
    .catch(next);
}

function updateWithoutStock(req, res, next) {
  quotationController
    .updateWithoutStock(req.params.id, req.body)
    .then((quotation) => res.json(quotation))
    .catch(next);
}

function _delete(req, res, next) {
  quotationController
    .delete(req.params.id)
    .then(() => res.json({ message: 'Quotation was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  quotationController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} Quotation${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
