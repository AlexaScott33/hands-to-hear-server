'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('./models');
const QuestionList=require('../linkedList/questionList');

// get all users from mLab to test endpoint
router.get('/users', (req, res) => {
  User.find()
    .then(results => {
      res.json(results);
    }).catch(err=> console.log(err));
});

//register a user
router.post('/users', jsonParser, (req, res, next) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  //Find where a field (username, password, etc...) in the req body 
  //is not a string
  const stringFields = ['username', 'password', 'fullName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  //Make sure that the trimmed version of a field matches the original version
  //to double check no whitespace (this is also set on the client side to throw 
  //an error at the user to warn them)
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );
  
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const fieldSizes = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };

  const tooSmall = Object.keys(fieldSizes).find(
    field =>
      'min' in fieldSizes[field] &&
            req.body[field].trim().length < fieldSizes[field].min
  );
  const tooBig = Object.keys(fieldSizes).find(
    field =>
      'max' in fieldSizes[field] &&
            req.body[field].trim().length > fieldSizes[field].max
  );

  //Note to self: find a field in the fieldsizes and compare that to a trimmed version of the field being inputted
  //in min it finds ones that are smaller than our set minimum characters
  //in max it finds ones that go over our maximum characters

  if (tooSmall || tooBig) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmall
        ? `Must be at least ${fieldSizes[tooSmall]
          .min} characters long`
        : `Must be at most ${fieldSizes[tooBig]
          .max} characters long`,
      location: tooSmall || tooBig
    });
  }

  let {username, password, fullName = ''} = req.body;
  fullName = fullName.trim();


  return User.find({username})
    .count()
    .then(usersWithThatUsername => {
      console.log('this is usersWithThatUsername:', usersWithThatUsername);
      if (usersWithThatUsername > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hashedPassword => {
      console.log('this is hasedPassword', hashedPassword);
      return User.create({
        username,
        password: hashedPassword,
        fullName
      });
    })
    .then(user => {
      console.log('this is user:', user);
      return res.status(201).location(`/api/users/${user.id}`).json(user.serialize());
    })
    .catch(err => {
      console.log('this is err:', err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


module.exports = router;