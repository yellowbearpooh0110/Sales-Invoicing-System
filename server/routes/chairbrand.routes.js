const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairbrandController = require('server/controller/chairbrand.controller');

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
  chairbrandController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New ChairBrand was created successfully.' });
    })
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function getAll(req, res, next) {
  chairbrandController
    .getAll()
    .then((chairbrands) => res.json(chairbrands))
    .catch(next);
}

function getById(req, res, next) {
  chairbrandController
    .getById(req.params.id)
    .then((chairbrand) => res.json(chairbrand))
    .catch(next);
}

function update(req, res, next) {
  chairbrandController
    .update(req.params.id, req.body)
    .then((chairbrand) => res.json(chairbrand))
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function _delete(req, res, next) {
  chairbrandController
    .delete(req.params.id)
    .then(() => res.json({ message: 'ChairBrand was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  chairbrandController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} ChairBrand${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
