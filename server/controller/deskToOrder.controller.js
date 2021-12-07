module.exports = {
  update,
};

async function update(req, res, next) {
  try {
    const deskToOrder = await db.DeskToOrder.findByPk(req.params.id);
    if (!deskToOrder) throw 'DeskOrder was not found.';
    Object.assign(deskToOrder, req.body);
    await deskToOrder.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
