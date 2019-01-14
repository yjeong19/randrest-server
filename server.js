const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8081;
// dotenv.config()
// const dotenv = require('dotenv');
require('dotenv').config();
const yelp = require('yelp-fusion');
const yelpAPI = require('./api/yelp');
const routes = require('./controller/routes');
const users = require('./controller/users');
const comments = require('./controller/comments');
// const comments = require('./controller/comments');``
const passport = require('passport');
require('./config/passport')(passport);

//pinging heroku to prevent server/client sleeping
const http = require("http");
setInterval(function() {
    http.get("http://randrest-server.herokuapp.com");
    http.get("http://randrest-client.herokuapp.com");
}, 600000); // every 10 minutes (600000)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize());

//yelp routes
app.use('/yelp', yelpAPI);
//api Routes
app.use('/', routes);
//registration routes
app.use('/users', users);
//comments
app.use('/', comments);



app.listen(PORT, ()=>{
  console.log(`app listening on port ${PORT}`);
});
