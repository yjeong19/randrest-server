const express = require('express');
const router = express.Router();
const db = require('../models');

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
router.post('/comments', (req, res) => {
  const { comment, restaurant_id, username, user_id  } = req.body.params;
  console.log('line 39: comments: ', req.body);
  db.comments.create({
    comment,
    restaurant_id,
    username,
    user_id,
    //add user namd and user id
  })
  .then(data => {
    // console.log(data);
    addCommentToRest(restaurant_id, comment, data._id, username);
    res.json(data);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
});

function addCommentToRest(restaurant_id, comment, user_id, username) {
  db.restaurants.findOneAndUpdate({restaurant_id}, {
    $push: {
      comments: [{
        restaurant_id,
        comment,
        username,
        user_id,
      }]
    }
  }, {new: true})
  .then(resp => {
    console.log('line 66 comments.js: ', resp);
    return(resp);
  })
  .catch(err => console.log(err));
};

//create function to add comment to user;
//need user id;
function addCommentToUser(){};


module.exports = router;
