const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/errors');
const { NODE_ENV, JWT_SECRET } = process.env;

// const handleAuthError = (res) => {
//   res
//     .status(401)
//     .send({ message: 'Err 401: Authorization required' });
// };

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    // return handleAuthError(res);
    throw new UnauthorizedError('Err 401: Authorization required');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // return handleAuthError(res);
    throw new UnauthorizedError('Err 401: Authorization required');
  }

  req.user = payload;
  return next();
};
