const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Cards.findById(req.params.id).populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Err 404: Card not found' });
        return;
      }
      if (card.owner._id.toString() !== req.user._id) {
        res.status(403).send({ message: 'Err 403: You havent permission for this' });
        return;
      }
      Cards.findByIdAndRemove(req.params.id)
        .then((obj) => res.send({ data: obj }))
        .catch((err) => res.status(500).send({ message: `Err 500: Server error. Server answer: ${err}` }));
    })
    .catch((err) => res.status(400).send({ message: `Err 400: Incorrect data. Server answer: ${err}` }));
};
