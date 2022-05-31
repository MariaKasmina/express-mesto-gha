const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers); // получение информации пользователей

usersRouter.get('/:userId', getUserById); // получение инфо о пользователе по id

usersRouter.post('/', addUser); // добавление пользователя

usersRouter.patch('/me', updateUserInfo); // обновление данных текущего пользователя

usersRouter.patch('/me/avatar', updateAvatar); // обновление аватара текущего пользователя

module.exports = usersRouter;
