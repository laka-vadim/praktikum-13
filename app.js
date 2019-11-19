const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cards = require('./routes/cards');
const users = require('./routes/users');
const { postUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const pageNotFound = require('./middlewares/pageNotFound');
const errors = require('./middlewares/errors');


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

app.post('/signin', login);
app.post('/signup', postUser);

app.use(auth);

app.use('/cards', cards);
app.use('/users', users);

// Err 404 Page Not Found
app.use(pageNotFound);

// Err From Controllers
app.use(errors);

app.listen(PORT);
