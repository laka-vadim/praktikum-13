const Cards = require('../models/cards');
const { NotFoundError, ForbiddenError } = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Cards.findById(req.params.id).populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Err 404: Card not found');
      }
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Err 403: You havent permission for this');
      }
      Cards.findByIdAndRemove(req.params.id)
        .then((obj) => res.send({ data: obj }))
        .catch(next);
    })
    .catch(next);
};
