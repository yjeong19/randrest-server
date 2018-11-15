const mongoose = require('mongoose');
const keys = require('../config/keys');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});
console.log('line 4 models/index.js', keys.mongoURI);
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;


//below -- module.exports to export mongoose model
module.exports.restaurants = require('./restaurants');
module.exports.user = require('./user');
