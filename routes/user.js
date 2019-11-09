const router = require('express').Router();
const users = require('../data/users.json');

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const userId = '_id';
  for (let i = 0; i < users.length; i += 1) {
    if (users[i][userId] === id) {
      res.send(users[i]);
      return;
    }
  }
  res.send({ message: 'Нет пользователя с таким id' });
});

module.exports = router;
