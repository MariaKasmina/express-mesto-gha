const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователи не найдены' });
      } else res.send({ user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else res.send({ user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

const addUser = (req, res) => {
  const { name, avatar, about } = req.body;

  if (!name || !about) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  if (typeof name !== 'string' || typeof about !== 'string') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else res.send({ user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

function updateAvatar(req, res) {
  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
  }

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else res.send({ user });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUserInfo,
  updateAvatar,
};
