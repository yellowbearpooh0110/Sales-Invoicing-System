const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairstockController = require('server/controller/chairstock.controller');

router.post('/create', admin(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
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
  chairstockController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New ChairStock was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  chairstockController
    .getAll()
    .then((chairstocks) => res.json(chairstocks))
    .catch(next);
}

function getById(req, res, next) {
  chairstockController
    .getById(req.params.id)
    .then((chairstock) => res.json(chairstock))
    .catch(next);
}

function update(req, res, next) {
  chairstockController
    .update(req.params.id, req.body)
    .then((chairstock) => res.json(chairstock))
    .catch(next);
}

function _delete(req, res, next) {
  chairstockController
    .delete(req.params.id)
    .then(() => res.json({ message: 'ChairStock was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  chairstockController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} ChairStock${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
