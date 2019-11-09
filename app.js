const express = require('express');
const path = require('path');
const cards = require('./routes/cards');
const users = require('./routes/user');
const allUsers = require('./routes/allUsers');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/cards', cards);
app.use('/users', allUsers);
app.use('/users', users);

// Err 404 Not Found
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
});
