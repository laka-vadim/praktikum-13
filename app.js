require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const cards = require('./routes/cards');
const users = require('./routes/users');
const { postUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const pageNotFound = require('./middlewares/pageNotFound');
const MyErrors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');


const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string()
      .required()
      .regex(/^https?:\/\/(((w{3}\.)?(\w+\.)+[a-zA-Z]{2,6})|((\d{1,3}\.){3}\d{1,3}))(:\d{2,5})?(\/[\w+-.?=]+)*#?$/),
  }),
}), postUser);

// Err 403 Authorization Err
app.use(auth);

app.use('/cards', cards);
app.use('/users', users);

// Err 404 Page Not Found
app.use(pageNotFound);

app.use(errorLogger);

app.use(errors());

// Err From Controllers
app.use(MyErrors);

app.listen(PORT);
