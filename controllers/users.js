const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Err 404: User not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
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
    res.status(400).send({ message: 'Err 400: Invalid email' });
    return;
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
        .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
    })
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Err 401: Incorrect login or/and email.'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new Error('Err 401: Incorrect login or/and email.'));
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
    .catch((err) => res.status(401).send({ message: `${err.message}` }));
};
