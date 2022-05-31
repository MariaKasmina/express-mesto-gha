const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards')

const {PORT = 3000} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: false
});

app.use(express.json())

app.use((req, res, next) => {
  req.user = {
    _id: '6296494d5888dedc140f6311'
  };
  next();
});

app.use('/users', usersRouter)
app.use('/cards', cardRouter);


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

