const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../errors/errors');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Err 404: User not found');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.postUser = (req, res) => {
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

module.exports.login = (req, res) => {
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
            'some-secret-key',
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
