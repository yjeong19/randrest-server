const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsModel = new Schema({
  restaurant_id: String,
  user_id: String,
  comment: String,
  username: String,
  restaurant_name: String,
  image_url: String,
});


module.exports = mongoose.model('comment', commentsModel);
