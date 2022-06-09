const express = require('express');

const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const login = require('./routes/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use('/signin', login);
app.use('/signup', usersRouter);

app.use(auth);
// запросы ниже требуют авторизации

app.use('/', usersRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
