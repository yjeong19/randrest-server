const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
//bcrypt and stuff here for passwords

const userSchema = new Schema({
  username: {
    name: String,
    // required: true,
    type: String,
    // unique: true,
  },
  email: {
    address: String,
    required: true,
    unique: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: Array,
  //do passwords later
});

module.exports = mongoose.model('user', userSchema);
