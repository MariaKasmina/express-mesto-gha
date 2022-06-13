const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const login = require('./routes/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.post('/signin', login);
app.post('/signup', usersRouter);

// app.use(auth);
// запросы ниже требуют авторизации

app.use('/', auth, usersRouter);
app.use('/cards', auth, cardRouter);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Ошибка по умолчанию.'
        : message,
    });

  next(err);
});

app.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
