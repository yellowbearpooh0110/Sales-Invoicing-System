const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairorderController = require('server/controller/chairorder.controller');

router.post('/create', authorize(), createSchema, create);
router.get('/', admin(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    chairBrandId: Joi.string().guid(),
    chairModelId: Joi.string().guid(),
    frameColorId: Joi.string().guid(),
    backColorId: Joi.string().guid(),
    seatColorId: Joi.string().guid(),
    withHeadrest: Joi.boolean(),
    withAdArmrest: Joi.boolean(),
    chairRemark: Joi.string().allow(''),
    clientName: Joi.string().allow(''),
    clientDistrict: Joi.string().allow(''),
    clientStreet: Joi.string().allow(''),
    clientBlock: Joi.string().allow(''),
    clientFloor: Joi.number(),
    clientUnit: Joi.number(),
    clientRemark: Joi.string(),
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
    .then((chairorders) => res.json(chairorders))
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

function update(req, res, next) {
  chairorderController
    .update(req.params.id, req.body)
    .then((chairorder) => res.json(chairorder))
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
