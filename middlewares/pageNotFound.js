module.exports = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};
