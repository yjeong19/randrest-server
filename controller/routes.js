const express = require('express');
const router = express.Router();
const db = require('../models');

//gets all restaurants in db
router.get('/restaurant/find', (req, res) => {
  req.params.id
  db.restaurants.find(JSON.stringify({
    restaurant: {
      id
    }
  }))
  .then(data => {
    console.log(data);
    res.json(data.restaurant)
  });
});

//adding to likes
router.put('/restaurant/likes', (req,res) => {
  let { id, like } = req.body;
  let condition = {restaurant_id: `${id}`};
  console.log(like, 'line23------');
  let update = like === 'likes' ? {$inc: {"likes.likes": 1}} : {$inc: {"likes.dislikes": 1}};
  // console.log(req.body, 'line 23 ============')
  db.restaurants.findOneAndUpdate(condition, update, {new: true})
  .then(data => {
    console.log(data.likes);
    res.json(data.likes);
  })
  .catch(err => {
    console.log(err)
    res.json(err);
  })
});

//updates existing db and add comments on submit
router.put('/restaurant/comment', (req,res) => {
  let { params } = req.body;
  let { id, comment, user } = req.body.params;
  let condition = {restaurant_id: `${id}`};
  console.log(comment, id, condition)
  console.log(req.body, 'line 43-----------------')
  //temporarily sending name and comment -- change based on auth later on
  db.restaurants.findOneAndUpdate(condition, {
    $push: {
      comments: [
        {
          id,
          user,
          comment
        }
      ]
    }
  }, {new: true})
  .then(data => {
    // console.log(data.comments[(data.comments.length - 1)])
    //this will only return the most recent comment.
    //will this cause any issues if i am just pulling last comment -- does it need to be found by id?
    res.json(data.comments[data.comments.length - 1]);
  })
  .catch(err => {
    console.log(err)
    res.json(err);
  })
});

//get comments from db based on restaurant id
router.get('/restaurant/comments', (req, res) => {
  // let { params } = req.body;
  let { id } = req.query;
  console.log(id, 'line 49 ============');
  let condition = {restaurant_id: `${id}`}

  db.restaurants.find(condition)
  .then(response => {
    console.log(response);
    res.json(response);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })

})

//findOneandUpdate createone if data dne: set {upsert: true};
//when user selects a restaurant, it updates db with new restaurant or returns existing one.
router.put('/restaurant/selected', (req, res) => {
  let { params } = req.body;
  let { id } = req.body.params;
  console.log(params.id, 'find one and update testing method');
  let condition = {restaurant_id: `${id}`}
  let update = {
    restaurant_id: params.id,
    restaurant: {
      // id: params.id,
      name: params.name,
      location: {
        address1: params.location.address1,
        address2: params.location.address2,
        city: params.location.city,
        state: params.location.state,
        zipcode: params.location.zip_code,
        country: params.location.country,
      },
      type: 'restaurant',
      rating: params.rating,
      price: params.price,
      url: params.url,
      phone: params.phone,
      likes: {
      }
    }
  };

  db.restaurants.findOneAndUpdate(condition, update, {upsert: true, new: true})
    .then(data => {
      console.log('line 53 routes.js ====================================')
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    })

})


//this just creates new restaurant -- obsolete since findOneAndUpdate creates new.
//is this still needed? -- method above creates new one if object does not exist. -- temporarily keeping.
router.post('/restaurant', (req, res) => {
  let { params } = req.body;
  console.log(params, 'object literal test')
  // console.log('line 14 route.js', req.body.params.name)
  db.restaurants.create(
    {
      restaurant: {
        id: params.id,
        name: params.name,
        location: {
          address1: params.location.address1,
          address2: params.location.address2,
          city: params.location.city,
          state: params.location.state,
          zipcode: params.location.zip_code,
          country: params.location.country,
        },
        type: 'restaurant',
        rating: params.rating,
        price: params.price,
        url: params.url,
        phone: params.phone,
        likes: {

        }
      }
  })
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});


module.exports = router;
