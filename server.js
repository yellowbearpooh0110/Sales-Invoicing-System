require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('server/middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/chairbrand', require('server/routes/chairbrand.routes'));
app.use('/chairmodel', require('server/routes/chairmodel.routes'));
app.use('/chairstock', require('server/routes/chairstock.routes'));
app.use('/chairorder', require('server/routes/chairorder.routes'));
app.use('/deskmodel', require('server/routes/deskmodel.routes'));
app.use('/deskstock', require('server/routes/deskstock.routes'));
app.use('/deskorder', require('server/routes/deskorder.routes'));
app.use('/productcolor', require('server/routes/productcolor.routes'));
app.use('/user', require('server/routes/user.routes'));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
