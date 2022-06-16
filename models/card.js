const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { // ссылка на картинку
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  owner: { // id владельца
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ // массив лайков
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  }],
  createdAt: { // дата создания
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
