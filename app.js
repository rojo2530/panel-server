var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Enable Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

/**
 * Conexion a la base de datos
 */
const mongooseConnection = require('./lib/connectMongoose');

/**
 * API Routes
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apiv1/infojobs/provinces', require('./routes/apiv1/infojobs/provinces'));
app.use('/apiv1/infojobs/categories', require('./routes/apiv1/infojobs/categories'));
app.use('/apiv1/main/provinces', require('./routes/apiv1/main/provinces'));
app.use('/apiv1/main/categories', require('./routes/apiv1/main/categories'));
app.use('/apiv1/main/jobs', require('./routes/apiv1/main/jobs'));
app.use('/apiv1/infojobs/jobs', require('./routes/apiv1/infojobs/jobs'));







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
