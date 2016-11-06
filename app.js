const express = require('express');
const bodyParser = require('body-parser');

const formidable = require('formidable');

const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/db_chat');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});

const User = require('./user-model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', function (req, res) {
  res.status(200).json({ hi: 'hello world' });
});

app.post('/sign-in', signIn);

function signIn(req, res) {

  // var ee = JSON.parse(req.body);
  console.log(req);

  for ( property in req.body ) {
    console.log( property ); // Outputs: foo, fiz or fiz, foo
  }

  if (!req.body) {
    return res.status(200).json({
      message: 'Wrong formar'
    });
  }

  // console.log(req.body.username);
  User.find({
    username: req.body.username
    ,password: req.body.password
  },function (err, users) {

    // console.log(req.body);
    if (users.length < 1) {
      return res.status(200).json({
        input: req.body,
        output: 'username and password not match'
      })
    }

    User.find( {username: {$ne: req.body.username}} , function (err2, usersException) {
      res.status(200).json({
        input: req.body,
        output: usersException
      });
    })

  });
}

app.listen(1212, function () {
  console.log('listen to 1212');
});
