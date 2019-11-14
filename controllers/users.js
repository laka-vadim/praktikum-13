const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка на сервере: ${err}` }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка на сервере: ${err}` }));
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
  const hash = bcrypt.hash(password, 10);
  User.create({
    email,
    hash,
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};
