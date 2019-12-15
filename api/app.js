// Matthew R. Jenkins, Donald Holley
// Senior Project
// 25 September 2019
//
// Server used for backend of website.
// Modified from this guide: 
// https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const auctionRouter = require('./routes/auction');
const artworksRouter = require('./routes/artworks');
const groupsRouter = require('./routes/groups');
const historyRouter = require('./routes/history');
const tradesRouter = require('./routes/trades');
const tradedetailsRouter = require('./routes/tradedetails');
const microresearchRouter = require('./routes/microresearch');
const usersRouter = require('./routes/users');
const ratetableRouter = require('./routes/ratetable')
const messagesRouter = require('./routes/messages')

const uploadRouter = require('./routes/upload');

const app = express();

// set up CORS
const cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use routes
app.use('/auction', auctionRouter);
app.use('/artworks', artworksRouter);
app.use('/groups', groupsRouter);
app.use('/history', historyRouter);
app.use('/trades', tradesRouter);
app.use('/tradedetails', tradedetailsRouter);
app.use('/microresearch', microresearchRouter);
app.use('/users', usersRouter);
app.use('/ratetable', ratetableRouter);
app.use('/messages', messagesRouter);

app.use('/upload', uploadRouter);

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
