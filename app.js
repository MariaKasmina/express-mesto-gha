const express = require('express');

const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const login = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6296494d5888dedc140f6311',
  };
  next();
});

app.use('/signin', login);
app.use('/signup', usersRouter);

app.use('/', usersRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
