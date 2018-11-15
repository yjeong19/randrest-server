const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

//validtaion
const validateRegisterInput = require('../validator/register');
const validateLoginInput = require('../validator/login');


//this registers users
router.post('/register', (req, res) => {
  // console.log(req.body.email)
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(errors, isValid, req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }
  debugger;
  db.user.findOne({ email: req.body.email })
  .then(user => {
    //checks if user with email exists
    if(user) {
      return res.status(400).json({
        email: 'This email has been used',
      })
    }else{
      //if not, run this code to save info -- salt password
      const newUser = new db.user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, ((err, hash) => {
          if(err) throw err;
          // console.log('hasing activated', newUser.password, hash);
          newUser.password = hash;
          newUser
            .save()
            .then(userInfo => {
              // res.json(userInfo))
              const payload = { id: userInfo.id, name: userInfo.name }
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });
              });
            })
            .catch(err => console.log(err))
        }))
      })
    }
  })
});

//this logs in users
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  // console.log(email, password);

  if(!isValid){
    return res.status(400).json(errors);
  }

  db.user.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(404).json({email: 'the user email does not exist'});
    }

    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
          const payload = {id: user.id, name: user.name};

          jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
              });
            });
        }else{
        return res.status(404).json({password: 'incorrect password'});
      }
    })
  })
});

//create logged in route;
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  // console.log(req)
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
})

module.exports = router;
