const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, postCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
    .pattern(/^https?:\/\/(((w{3}\.)?(\w+\.)+[a-zA-Z]{2,6})|((\d{1,3}\.){3}\d{1,3}))(:\d{2,5})?(\/[\w+-.?=]+)*#?$/)
    .required(),
  })
}), postCard);

router.delete('/:id', deleteCard);

module.exports = router;
