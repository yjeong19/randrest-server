const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantsModel = new Schema({
  restaurant_id: String,
  restaurant: {
    id: String,
    name: String,
    location: {
      address1: String,
      address2: String,
      city: String,
      state: String,
      zipcode: Number,
      country: String,
    },
    rating: Number,
    price: String,
    url: String,
    phone: String,
  },
  likes: {
    likes: Number,
    dislikes: Number,
    percentage: Number,
  },
  comments: Array,

});

module.exports = mongoose.model('restaurants', restaurantsModel)
