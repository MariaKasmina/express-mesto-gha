const Card = require('../models/card');
const User = require('../models/user');

function getCards(req, res) {
  Card.find({})
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки не найдены' });
      } else res.send({ card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

function deleteCard(req, res) {
  User.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else res.send({ card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

function addCard(req, res) {
  const { name, link } = req.body;

  if (!name || !link) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

function addLike(req, res) {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    } else res.status(201).send({ card });
  })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

function removeLike(req, res) {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    } else res.status(201).send({ card });
  })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

module.exports = {
  getCards,
  deleteCard,
  addCard,
  addLike,
  removeLike,
};
