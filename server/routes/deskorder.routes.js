const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const deskorderController = require('server/controller/deskorder.controller');

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
    deskModelId: Joi.string().guid(),
    colorId: Joi.string().guid(),
    armSize: Joi.number(),
    feetSize: Joi.number(),
    beam: Joi.string(),
    akInfo: Joi.string(),
    woodInfo_1: Joi.string(),
    woodInfo_2: Joi.string(),
    melamineInfo: Joi.string(),
    laminateInfo: Joi.string(),
    bambooInfo: Joi.string(),
    deskRemark: Joi.string().allow(''),
    clientName: Joi.string(),
    clientDistrict: Joi.string(),
    clientStreet: Joi.string(),
    clientBlock: Joi.string(),
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
  deskorderController
    .create({ ...req.body, salesmanId: req.user.id })
    .then(() => {
      res.json({ message: 'New DeskOrder was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  deskorderController
    .getAll()
    .then((deskorders) => res.json(deskorders))
    .catch(next);
}

function getCurrent(req, res, next) {
  deskorderController
    .getAll({ salesmanId: req.user.id })
    .then((deskorders) => res.json(deskorders))
    .catch(next);
}

function getById(req, res, next) {
  deskorderController
    .getById(req.params.id)
    .then((deskorder) => res.json(deskorder))
    .catch(next);
}

function update(req, res, next) {
  deskorderController
    .update(req.params.id, req.body)
    .then((deskorder) => res.json(deskorder))
    .catch(next);
}

function _delete(req, res, next) {
  deskorderController
    .delete(req.params.id)
    .then(() => res.json({ message: 'DeskOrder was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  deskorderController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} DeskOrder${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
