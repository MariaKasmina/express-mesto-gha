const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar, login,
} = require('../controllers/users');

usersRouter.get('/users', getUsers); // получение информации пользователей

usersRouter.get('/users/:userId', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUserById); // получение инфо о пользователе по id

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), addUser); // добавление пользователя

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), updateUserInfo); // обновление данных текущего пользователя

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar); // обновление аватара текущего пользователя

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login); // получение токена

module.exports = usersRouter;
