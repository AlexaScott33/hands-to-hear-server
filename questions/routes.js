'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Question = require('./models');
const User = require('../users/models');

// get one question from mLab to test endpoint
// get one question *needs to be specific for user depending on where user left off*
// user.findOne({username}) where {username} = req.user
router.get('/questions', (req, res, next) => {

  const {username} = req.user;

  User.findOne({username})
    .then(user => {
      // console.log('this is the user', user);
      let userQuestion = user.questionsObj;
      return res.json(userQuestion);
    })
    .catch(err => {
      next(err);
    });

});

// post endpoint for when users enter in an answer
// 1. need to check userAnswer with answer stored in db 
// -> give message and correct answer if wrong -> give message 'Correct' if right 
// 2. implement algo so depending on if user got question right or wrong, put it back in list
// 3. change user score 

// update correct and incorrect for user
// switching questions


router.post('/questions', (req, res, next) => {
  const {userAnswer} = req.body;
  const {username} = req.user;

  User.findOne({username})
    .then(user => {
      console.log('this is the user returned', user.questionsObj.questions);
      return res.json(user);
    })
    .catch(err => {
      next(err);
    });

  // User.findOne({username})
  //   .then(user => {
  //     console.log('check the actual answer', user.questions.question.answer);
  //     // need condition to check stored answer with user answer
  //     // if(user.questions.question.answer) {
  //     //   res.json({})
  //     // }
  //     return res.json(user);
  //   });
// ...
  
});


module.exports = router;