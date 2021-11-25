const uploadFile = require('server/middleware/upload');

module.exports = {
  upload,
};

async function upload(req, res, next) {
  try {
    await uploadFile(req, res);
    if (req.file === undefined) next(new Error('Please upload a file!'));
    else {
      const host = req.get('host');
      const protocol = req.protocol;

      res.json({
        url: `${protocol}://${host}/${req.file.url}`,
      });
    }
  } catch (err) {
    next(err);
  }
}
