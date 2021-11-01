const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('server/helper/db');

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ email, password }) {
  const user = await db.User.scope('withPassword').findOne({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw 'Email or password is incorrect';

  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
  return { ...omitPassword(user.get()), token };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10);
  }

  // save user
  await db.User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitPassword(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
