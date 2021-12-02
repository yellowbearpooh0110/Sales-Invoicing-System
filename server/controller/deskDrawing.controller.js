const fs = require('fs');
const PImage = require('pureimage');

module.exports = {
  drawDeskTop,
};

function drawDeskTop(req, res, next) {
  PImage.decodePNGFromStream(
    fs.createReadStream('server/images/sketch/1-RCorner/3-hole.png')
  ).then((img) => {
    //get context
    console.log(img.width);
    console.log(img.height);
    var fnt = PImage.registerFont(
      'server/fonts/Microsoft Sans Serif.ttf',
      'Microsoft Sans Serif'
    );
    fnt.load(() => {
      const ctx = img.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.font = "40pt 'Microsoft Sans Serif'";
      ctx.textAlign = 'center';
      ctx.fillText('1200', 600, 50);
      ctx.fillText('T=1200', 600, 640);
      ctx.save();
      ctx.translate(170, 340);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('600', 0, 0);
      ctx.restore();
      ctx.translate(1050, 590);
      ctx.rotate((26 * Math.PI) / 180);
      ctx.fillText('1-R50', 0, 0);
      PImage.encodePNGToStream(
        img,
        fs.createWriteStream('server/uploads/sketch/out.png')
      ).then((err) => {
        if (!err) res.json({ success: true });
        else next(err);
      });
    });
  });
}
