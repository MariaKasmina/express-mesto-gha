const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCard,
  addCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards); // получение карточек

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard); // удаление карточки

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^http[s]*:\/\/[a-z0-9.\-_~:/?#[\]@!$&'()*+,;=]+|www\.[a-z0-9.-_~:?#[\]@!$&'()*+,;=]+/).required(),
  }),
}), addCard); // добавление карточки

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),addLike); // добавление лайка

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),removeLike); // удаление лайка

module.exports = cardRouter;
