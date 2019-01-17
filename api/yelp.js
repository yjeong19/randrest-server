const yelp = require('yelp-fusion');
require('dotenv').config();
const client = yelp.client(process.env.MYAPIKEY);
const express = require('express');
const router = express.Router();

//creating search through yelp api
router.get('/search', (req, res) => {
  console.log('/search activated')
  //postman request is req.query
  //when adding front end, check what the request comes as
  console.log('line 12 yelp: ', req.query)
  client.search({
    term: req.query.term,
    location: req.query.location,
    categories: req.query.categories,
    price: parseInt(req.query.price),
    limit: 50,
  }).then(response => {
    res.send(response.jsonBody.businesses);
  }).catch(e => {
    console.log(e);
    res.send(e)
  });
});

//create a random restaurant fetch method
router.get('/random', (req, res) => {
  console.log(req.query);
  console.log('/random activated');
  client.search({
    term: req.query.term,
    location: req.query.location,
    categories: req.query.categories,
    price: parseInt(req.query.price),
    // price: req.query.price,
    limit: req.query.limit,
  }).then(response => {
    //put algo here to return random restaurant
    // console.log(response.jsonBody.businesses);
    //right now, only 5 businesses are returned -- try to get more.
    let randomInt = (length) => {
      return Math.floor(Math.random() * Math.floor(length));
    }
    //below returns random restaurant
    res.json(response.jsonBody.businesses[randomInt(response.jsonBody.businesses.length)]);
  }).catch(err => {
    console.log(err);
    res.send(err);
  })
});

// router.get('/single', (req,res) => {
//   console.log(req.query);
//   client.businessMatch('lookup', {
//     name:
//   })
// });


module.exports = router;
