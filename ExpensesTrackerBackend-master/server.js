require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const { MONGO_DB_KEY } = process.env;
const MongoURI = `mongodb://127.0.0.1/expenses?retryWrites=true&w=majority`
//                                  ^Insert password here     ^Insert db name here

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(res => console.log('Database Connected'));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5000', 'http://localhost:5000']
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

//Routes
app.use(require('./routes'));

app.listen(PORT, console.log(`Server running on ${PORT}`))
