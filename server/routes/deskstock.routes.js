const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const deskstockController = require('server/controller/deskstock.controller');

router.post('/create', admin(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    frameColor: Joi.string().guid(),
    backColor: Joi.string().guid(),
    seatColor: Joi.string().guid(),
    withHeadrest: Joi.boolean(),
    deskBrand: Joi.string().guid(),
    deskModel: Joi.string().guid(),
    QTY: Joi.number().required(),
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
  deskstockController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New DeskStock was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  deskstockController
    .getAll()
    .then((deskstocks) => res.json(deskstocks))
    .catch(next);
}

function getById(req, res, next) {
  deskstockController
    .getById(req.params.id)
    .then((deskstock) => res.json(deskstock))
    .catch(next);
}

function update(req, res, next) {
  deskstockController
    .update(req.params.id, req.body)
    .then((deskstock) => res.json(deskstock))
    .catch(next);
}

function _delete(req, res, next) {
  deskstockController
    .delete(req.params.id)
    .then(() => res.json({ message: 'DeskStock was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  deskstockController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} DeskStock${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
