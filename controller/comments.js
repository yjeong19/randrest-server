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

//get user comments
router.get('/comments', (req, res) => {
  // const { user_id } = req.body.params;
  // console.log(user_id);
  const { user_id } = req.query;
  console.log('get comments activated: ', req.query)
  db.user.findById({_id: user_id})
  .then(resp => {
    console.log(resp);
    res.send(resp.comments);
  })
  .catch(err => {
    console.log(err);
  })
});

//delete comments
router.delete('/comments', (req, res) => {
  console.log(req.body);
  const { _id } = req.body;

  db.comments.findByIdAndRemove({_id})
  .then(resp => {
    console.log(resp)
    res.send(resp);
  })
  .catch(err => {
    console.log(err)
  })
});

//function to delete from restaurants;
function delComFromRest(rest_id, comm_id) {
  console.log(rest_id, comm_id);
  db.restaurants.findOne({})
};

//testing get request
router.put('/restaurant/del/com', (req, res) => {
  console.log(req.body);
  const { rest_id, comm_id } = req.body;
  db.restaurants.updateOne({restaurant_id: rest_id},
    { $pull: {
      comments: [{
          comm_id
        }]
    }
  }, { safe: true, multi:true })
  .then(resp => {
    console.log(resp);
    res.send(resp)
  })
  .catch(err => {console.log(err)});
});



//post comments
router.post('/comments', (req, res) => {
  const { comment, restaurant_id, user, user_id, restaurant_name, image_url  } = req.body.params;
  console.log(req.body.params)
  db.comments.create({
    comment,
    restaurant_id,
    username: user,
    user_id,
    //add user namd and user id
  })
  .then(data => {
    // console.log(data);
    addCommentToRest(restaurant_id, comment, data._id, user);
    addCommentToUser(user_id, restaurant_id, comment, restaurant_name, image_url, data._id)
    res.json(data);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
});

function addCommentToRest(restaurant_id, comment, comm_id, name) {
  console.log('line 116: ',comm_id)
  db.restaurants.findOneAndUpdate({restaurant_id}, {
    $push: {
      comments: [{
        restaurant_id,
        comment,
        name,
        comm_id,
      }]
    }
  }, {new: true})
  .then(resp => {
    // console.log('line 66 comments.js: ', resp);
    return(resp);
  })
  .catch(err => console.log(err));
};

//create function to add comment to user;
//need user id;
function addCommentToUser(user_id, restaurant_id, comment, restaurant_name, image_url, comm_id){
  console.log('add comment to user: ', user_id, restaurant_id, comment);

  db.user.findOneAndUpdate({_id: user_id}, {
    $push: {
      comments: [{
      restaurant_id,
      comment,
      restaurant_name,
      image_url,
      comm_id,
      }]
    }
  }, { new: true })
  .then(resp => {
    return(resp);
  })
  .catch(err => {
    console.log(err)
    res.send(err);
  })
};


module.exports = router;
