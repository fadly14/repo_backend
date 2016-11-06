const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  name: String,
  password: String
},{collection: 'user'});

var User = mongoose.model('User', userSchema);

module.exports = User;
