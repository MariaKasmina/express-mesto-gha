const mongoose = require('mongoose');

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
  },
  owner: { // id владельца
    type: mongoose.ObjectId,
    required: true,
  },
  likes: { // массив лайков
    type: [mongoose.ObjectId],
    default: [],
  },
  createdAt: { // дата создания
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
