const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsModel = new Schema({
  restaurant_id: String,
  user_id: String,
  comment: String,
  username: String,
});

module.exports = mongoose.model('comments', commentsModel);
