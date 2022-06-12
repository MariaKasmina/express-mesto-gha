const Card = require('../models/card');

function getCards(req, res) {
  return Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function deleteCard(req, res) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        if(req.user._id === card.owner){ // проверяем - является ли пользователь владельцем
          res.send({ card });
        } else res.status(403).send({message: 'Ошибка прав доступа'})
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function addCard(req, res) {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function addLike(req, res) {
  if (!req.params.cardId) {
    return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    } res.status(200).send({ card });
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function removeLike(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    } else res.status(200).send({ card });
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

module.exports = {
  getCards,
  deleteCard,
  addCard,
  addLike,
  removeLike,
};
