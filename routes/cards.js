const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, postCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
    .required()
    .regex(/^https?:\/\/(((w{3}\.)?(\w+\.)+[a-zA-Z]{2,6})|((\d{1,3}\.){3}\d{1,3}))(:\d{2,5})?(\/[\w+-.?=]+)*#?$/),
  })
}), postCard);

router.delete('/:id', deleteCard);

module.exports = router;
