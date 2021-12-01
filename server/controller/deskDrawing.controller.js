const fs = require('fs');
const gm = require('gm');

module.exports = {
  drawDeskTop,
};

function drawDeskTop(req, res, next) {
  gm(200, 400, '#ddff99f3')
    .drawText(10, 50, 'from scratch')
    .write('server/uploads/brandNewImg.jpg', next);
}
