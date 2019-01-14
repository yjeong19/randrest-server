const mongoose = require('mongoose');
const keys = require('../config/keys');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;


//below -- module.exports to export mongoose model
module.exports.restaurants = require('./restaurants');
module.exports.user = require('./user');
module.exports.comments = require('./comments');
