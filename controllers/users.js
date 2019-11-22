const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Err 404: User not found');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.postUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Err 400: Invalid email');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Err 401: Incorrect login or/and email.');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new UnauthorizedError('Err 401: Incorrect login or/and email.');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            }).end();
        });
    })
    .catch(next);
};
