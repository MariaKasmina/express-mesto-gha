const cardRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  addCard,
  addLike,
  removeLike
} = require('../controllers/cards')


cardRouter.get('/', getCards) // получение карточек

cardRouter.delete('/:cardId', deleteCard) // удаление карточки

cardRouter.post('/', addCard) // добавление карточки

cardRouter.put('/:cardId/likes', addLike) // добавление лайка

cardRouter.delete('/:cardId/likes', removeLike) // удаление лайка

module.exports = cardRouter;