var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var appointmentRouter = require('./routes/appointment');
var hospitalRouter = require('./routes/hospital');
const connectToDB = require('./adapter/mongo');

var app = express();

(function(){
  app.use(logger('dev'));
  app.use(express.json()); //accept json body
  app.use(express.urlencoded({ extended: false })); //accept form body
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/appointment', appointmentRouter);
  app.use('/hospital', hospitalRouter);
  connectToDB();
})()

module.exports = app;
