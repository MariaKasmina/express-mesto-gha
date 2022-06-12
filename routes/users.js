const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar,
  login,
  getCurrentUserInfo,
} = require('../controllers/users');

usersRouter.get('/users', getUsers); // получение информации пользователей

usersRouter.get('/users/me', getCurrentUserInfo);

usersRouter.get('/users/:userId', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().min(24).max(24),
  }),
}), getUserById); // получение инфо о пользователе по id

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^http[s]*:\/\/[a-z0-9.\-_~:/?#[\]@!$&'()*+,;=]+|www\.[a-z0-9.-_~:?#[\]@!$&'()*+,;=]+/),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), addUser); // добавление пользователя

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo); // обновление данных текущего пользователя

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^http[s]*:\/\/[a-z0-9.\-_~:/?#[\]@!$&'()*+,;=]+|www\.[a-z0-9.-_~:?#[\]@!$&'()*+,;=]+/),
  }),
}), updateAvatar); // обновление аватара текущего пользователя

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login); // получение токена

module.exports = usersRouter;
