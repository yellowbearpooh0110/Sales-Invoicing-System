const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('server/middleware/validate-request');
const authorize = require('server/middleware/authorize');
const userController = require('server/controller/user.controller');

// routes
router.post('/login', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  userController
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    selfieUrl: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  userController
    .create(req.body)
    .then(() => {
      res.json({ message: 'Registration successful' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  userController
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userController
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    username: Joi.string().empty(''),
    password: Joi.string().min(6).empty(''),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userController
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userController
    .delete(req.params.id)
    .then(() => res.json({ message: 'User deleted successfully' }))
    .catch(next);
}
