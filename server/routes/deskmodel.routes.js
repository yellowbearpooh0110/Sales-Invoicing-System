const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const deskmodelController = require('server/controller/deskmodel.controller');

router.post('/create', admin(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
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
  deskmodelController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New DeskModel was created successfully.' });
    })
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function getAll(req, res, next) {
  deskmodelController
    .getAll()
    .then((deskmodels) => res.json(deskmodels))
    .catch(next);
}

function getById(req, res, next) {
  deskmodelController
    .getById(req.params.id)
    .then((deskmodel) => res.json(deskmodel))
    .catch(next);
}

function update(req, res, next) {
  deskmodelController
    .update(req.params.id, req.body)
    .then((deskmodel) => res.json(deskmodel))
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function _delete(req, res, next) {
  deskmodelController
    .delete(req.params.id)
    .then(() => res.json({ message: 'DeskModel was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  deskmodelController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} DeskModel${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
