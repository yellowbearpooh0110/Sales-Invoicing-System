require('rootpath')();
require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('server/middleware/error-handler');
require('server/whatsapp/main.js');

global.db = require('server/helper/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));

// api routes
router.use('/chairBrand', require('server/routes/chairbrand.routes'));
router.use('/chairModel', require('server/routes/chairmodel.routes'));
router.use('/chairStock', require('server/routes/chairstock.routes'));
router.use('/chairOrder', require('server/routes/chairorder.routes'));
router.use('/deskModel', require('server/routes/deskmodel.routes'));
router.use('/deskStock', require('server/routes/deskstock.routes'));
router.use('/deskOrder', require('server/routes/deskorder.routes'));
router.use('/productColor', require('server/routes/productcolor.routes'));
router.use('/user', require('server/routes/user.routes'));
router.use('/email', require('server/routes/email.routes'));
router.use('/whatsapp', require('server/routes/whatsapp.routes'));
app.use('/api', router);

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
