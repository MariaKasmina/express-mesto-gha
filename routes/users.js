const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar, login,
} = require('../controllers/users');

usersRouter.get('/users', getUsers); // получение информации пользователей

usersRouter.get('/users/:userId', getUserById); // получение инфо о пользователе по id

usersRouter.post('/signup', addUser); // добавление пользователя

usersRouter.patch('/users/me', updateUserInfo); // обновление данных текущего пользователя

usersRouter.patch('/users/me/avatar', updateAvatar); // обновление аватара текущего пользователя

usersRouter.post('/signin', login); // получение токена

module.exports = usersRouter;
