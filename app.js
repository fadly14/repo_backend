const express = require('express');
const bodyParser = require('body-parser');

const formidable = require('formidable');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const app = express();

const logger = require('morgan')

mongoose.connect('mongodb://127.0.0.1:27017/db_chat');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});

const User = require('./user-model');

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(allowCrossDomain);

app.get('/test', function (req, res) {
  res.status(200).json({ hi: 'hello world' });
});

app.post('/sign-in', signIn);

// app.get('/friend-list/:userId', friendList);

function signIn(req, res) {
  // console.log(req);
  if (!req.body.username || !req.body.password) {
    return _returnSignIn(res, 200, 'Wrong format');
  }

  User.find({
    username: req.body.username
  },function (err, users) {

    var status = 200;
    var message = 'success';
    if (users.length < 1) {
      status = 401;
      message = 'username not found';
      return _returnSignIn(res, status, message);
    }

    if (req.body.password !== users[0].password) {
      status = 401;
      message = 'password not match';
      return _returnSignIn(res, status, message);
    }

    return _returnSignIn(res, status, {userId: users[0].id});

  });
}

// function friendList(req, res) {
//   console.log(req.params);
// }

function _returnSignIn(res, status, message) {
  return res.status(status).json({
    output: message
  });
}

app.listen(1212, function () {
  console.log('listen to 1212');
});
