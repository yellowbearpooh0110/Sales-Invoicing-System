const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const chairbrandController = require('server/controller/chairbrand.controller');

router.post('/create', admin(), chairbrandSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), chairbrandSchema, update);
router.delete('/:id', admin(), _delete);

module.exports = router;

function chairbrandSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  chairbrandController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New ChairBrand was created successfully.' });
    })
    .catch(next);
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
    .catch(next);
}

function _delete(req, res, next) {
  chairbrandController
    .delete(req.params.id)
    .then(() => res.json({ message: 'ChairBrand was deleted successfully.' }))
    .catch(next);
}
