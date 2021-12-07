module.exports = {
  update,
};

async function update(req, res, next) {
  try {
    const chairToOrder = await db.ChairToOrder.findByPk(req.params.id);
    if (!chairToOrder) throw 'ChairOrder was not found.';
    Object.assign(chairToOrder, req.body);
    await chairToOrder.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
