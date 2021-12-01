var express = require('express');
var router = express.Router();

const deskDrawingController = require('server/controller/deskDrawing.controller');

module.exports = router;

router.get('/', deskDrawingController.drawDeskTop);
