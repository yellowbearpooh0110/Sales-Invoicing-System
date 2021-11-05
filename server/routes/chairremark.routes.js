const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairremarkController = require('server/controller/chairremark.controller');

router.post('/create', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    detail: Joi.string().required(),
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
  chairremarkController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New ChairRemark was created successfully.' });
    })
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function getAll(req, res, next) {
  chairremarkController
    .getAll()
    .then((chairremarks) => res.json(chairremarks))
    .catch(next);
}

function getById(req, res, next) {
  chairremarkController
    .getById(req.params.id)
    .then((chairremark) => res.json(chairremark))
    .catch(next);
}

function update(req, res, next) {
  chairremarkController
    .update(req.params.id, req.body)
    .then((chairremark) => res.json(chairremark))
    .catch((err) => {
      if (err.original) next(new Error(err.original.sqlMessage));
      else next(err);
    });
}

function _delete(req, res, next) {
  chairremarkController
    .delete(req.params.id)
    .then(() => res.json({ message: 'ChairRemark was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  chairremarkController
    .bulkDelete({ id: req.body.ids })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} ChairRemark${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
