const express = require('express');
const router = express.Router();
const Joi = require('joi');

const authorize = require('server/middleware/authorize');
const deliveryController = require('server/controller/delivery.controller');
const validateRequest = require('server/middleware/validate-request');

router.get('/chair', authorize(), deliveryController.getChairDelivery);
router.get('/desk', authorize(), deliveryController.getDeskDelivery);
router.post('/sign', authorize(), signSchema, deliveryController.signDelivery);

function signSchema(req, res, next) {
  const schema = Joi.object({
    productType: Joi.string().valid('chair', 'desk', 'accessory'),
    deliveryId: Joi.string().uuid().allow(null),
    signature: Joi.string().allow(''),
  });
  validateRequest(req, next, schema);
}

module.exports = router;
