const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedRequestError = require('../errors/unauthorized-request-err');
const ConflictError = require('../errors/conflict-err');

const getUsers = (req, res, next) => User.find({})
  .then((user) => {
    res.send({ user });
  })
  .catch(next);

const getUserById = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else res.send({ user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
    }
    next(err);
  }).catch(next);

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else res.send({ user });
  })
    .catch(next);
};

const addUser = (req, res, next) => {
  const {
    name, avatar, about, password, email,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }) // чтобы не возвращался хеш пароля описываем поля, которые нужны в ответе
    .then((user) => res.status(201).send({ id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
      if (err.code === 11000) {
        throw new ConflictError('Такой пользователь уже существует');
      }
    }).catch(next));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
      next(err);
    }).catch(next);
};

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
  }

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
      next(err);
    }).catch(next);
}

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    }).catch(() => {
      // возвращаем ошибку аутентификации
      throw new UnauthorizedRequestError('Неверный пароль или почта');
    }).catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar,
  login,
  getCurrentUserInfo,
};
