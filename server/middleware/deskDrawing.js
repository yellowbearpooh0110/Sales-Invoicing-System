const fs = require('fs');
const PImage = require('pureimage');

module.exports = {
  drawDeskTop,
};

function drawDeskTop(params) {
  return new Promise((resolve, reject) => {
    var {
      topLength,
      topWidth,
      topThickness,
      topRoundedCorners,
      topCornerRadius,
      topHoleCount,
      topHoleType,
      topHolePosition,
    } = params;
    var topHolePosition =
      topHoleCount === '1' && topHoleType === 'Rounded'
        ? `${topHolePosition.toLowerCase()}-`
        : '';
    PImage.decodePNGFromStream(
      fs.createReadStream(
        `server/images/sketch/${topRoundedCorners}-RCorner/${topHoleType}Hole/${topHoleCount}-${topHolePosition}hole.png`
      )
    ).then((img) => {
      const fnt = PImage.registerFont(
        'server/fonts/Microsoft Sans Serif.ttf',
        'Microsoft Sans Serif'
      );
      fnt.load(() => {
        const ctx = img.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.font = "40pt 'Microsoft Sans Serif'";
        ctx.textAlign = 'center';
        ctx.fillText(`${topLength}`, 600, 50);
        ctx.fillText(`T=${topThickness}`, 600, 640);
        ctx.save();
        ctx.translate(170, 340);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${topWidth}`, 0, 0);
        ctx.restore();
        if (topRoundedCorners > 0) {
          ctx.translate(1050, 590);
          ctx.rotate((26 * Math.PI) / 180);
          ctx.fillText(`${topRoundedCorners}-R${topCornerRadius}`, 0, 0);
        }
        const uniquePrefix = Date.now();
        PImage.encodePNGToStream(
          img,
          fs.createWriteStream(`server/uploads/sketch/${uniquePrefix}.png`)
        ).then((err) => {
          if (!err) resolve(`uploads/sketch/${uniquePrefix}.png`);
          else reject(err);
        });
      });
    });
  });
}
