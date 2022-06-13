const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

function getCards(req, res, next) {
  return Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    }).catch(next);
}

/**
 * Проверка прав на удаление конкретной карточки
 * @param cardId
 * @param currUserId
 * @param next
 */
function hasRemoveCardAccess(cardId, currUserId, next) {
  Card.findById(cardId).then((card) => {
    if (card) {
      if (currUserId !== card.owner.toString()) {
        throw new ForbiddenError('Ошибка прав доступа');
      }
    }
  }).catch(next);
  return true;
}

const deleteCard = (req, res, next) => {
  if (hasRemoveCardAccess(req.params.cardId, req.user._id, next)) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка с указанным _id не найдена.');
        }
        res.send({ card });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные при создании карточки.');
        }
        next(err);
      }).catch(next);
  }
};

function addCard(req, res, next) {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    }).catch(next);
}

function addLike(req, res, next) {
  if (!req.params.cardId) {
    throw new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.');
  }

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    res.status(200).send({ card });
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
      next(err);
    }).catch(next);
}

function removeLike(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    } else res.status(200).send({ card });
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
      next(err);
    }).catch(next);
}

module.exports = {
  getCards,
  deleteCard,
  addCard,
  addLike,
  removeLike,
};
