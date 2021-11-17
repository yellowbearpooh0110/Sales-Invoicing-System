const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sequelize = require('sequelize');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairorderController = require('server/controller/chairorder.controller');

router.post('/create', authorize(), createSchema, create);
router.get('/', admin(), getAll);
router.get('/getDelivery', authorize(), getDelivery);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
// router.get('/chairinvoice/:token', getByToken);
router.put('/withoutStock/:id', admin(), updateSchema, updateWithoutStock);
router.put('/:id', admin(), createSchema, update);
router.post('/sign', authorize(), signSchema, signDelivery);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    chairBrandId: Joi.string().guid().allow(null).required(),
    chairModelId: Joi.string().guid().allow(null).required(),
    frameColorId: Joi.string().guid().allow(null).required(),
    backColorId: Joi.string().guid().allow(null).required(),
    seatColorId: Joi.string().guid().allow(null).required(),
    withHeadrest: Joi.boolean().required(),
    withAdArmrest: Joi.boolean().required(),
    chairRemark: Joi.string().allow('').required(),
    clientName: Joi.string().allow('').required(),
    clientEmail: Joi.string().allow('').required(),
    clientPhone: Joi.string().allow('').required(),
    clientDistrict: Joi.string().allow('').required(),
    clientStreet: Joi.string().allow('').required(),
    clientBlock: Joi.string().allow('').required(),
    clientFloor: Joi.string().allow('').required(),
    clientUnit: Joi.string().allow('').required(),
    clientRemark: Joi.string().allow('').required(),
    deliveryDate: Joi.date().required(),
    unitPrice: Joi.number().required(),
    QTY: Joi.number().required(),
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
  chairorderController
    .create({ ...req.body, salesmanId: req.user.id })
    .then(() => {
      res.json({ message: 'New ChairOrder was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  chairorderController
    .getAll()
    .then((chairorders) =>
      res.json(
        chairorders.map((item) => {
          item.invoiceNum =
            'C_' + item.salesman.prefix + ('000' + item.invoiceNum).substr(-3);
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
  };
  chairorderController
    .getAll(where)
    .then((chairorders) =>
      res.json(
        chairorders.map(
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
            signURL,
            QTY,
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
            signURL: signURL !== '' ? `${protocol}://${host}/${signURL}` : null,
            QTY,
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
  chairorderController
    .getAll({ salesmanId: req.user.id })
    .then((chairorders) => res.json(chairorders))
    .catch(next);
}

function getById(req, res, next) {
  chairorderController
    .getById(req.params.id)
    .then((chairorder) => res.json(chairorder))
    .catch(next);
}

// function getByToken(req, res, next) {
//   req.params.token;
//   chairorderController
//     .getById(req.params.id)
//     .then((chairorder) => res.json(chairorder))
//     .catch(next);
// }

function update(req, res, next) {
  chairorderController
    .update(req.params.id, req.body)
    .then((chairorder) => res.json(chairorder))
    .catch(next);
}

function updateWithoutStock(req, res, next) {
  chairorderController
    .updateWithoutStock(req.params.id, req.body)
    .then((chairorder) => res.json(chairorder))
    .catch(next);
}

function signDelivery(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  chairorderController
    .signDelivery(req.body.orderId, req.body.signature)
    .then((chairorder) => {
      res.json({
        success: true,
        url: `${protocol}://${host}/${chairorder.signURL}`,
      });
    })
    .catch(next);
}

function _delete(req, res, next) {
  chairorderController
    .delete(req.params.id)
    .then(() => res.json({ message: 'ChairOrder was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  chairorderController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} ChairOrder${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
