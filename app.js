var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// require mongoose init to connect to mongodb database
require('./models').init();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup session and passport
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Ahmead',
  store: new MongoStore({url: 'mongodb://localhost/utech', autoReconnect: true}),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));
app.use(passport.initialize());
app.use(passport.session());
// express validator middleware
app.use(expressValidator())


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
app.use('/auth', authRouter)
app.use('/', indexRouter);

app.use(function (err, req, res, next) {
  res.status(500);
  res.send({ Error: err });
})

// In production enviment make the send the react version
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  console.log('Passing the if statemnt');
  const path = require("path");
  app.get("*", (req, res) => {
    console.log('Routing handling');
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
