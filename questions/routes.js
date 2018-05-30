'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Question = require('./models');
const LinkedList = require('../linkedList/linkedList');
const User = require('../users/models');
const {simple}= require('../linkedList/questionList');

// get one question from mLab to test endpoint
// get one question *needs to be specific for user depending on where user left off*
// user.findOne({username}) where {username} = req.user
router.get('/questions', (req, res, next) => {

  // if quesHead and quesNext are empty then populate
  const {username} = req.user;

  User.findOne({username})
    .then(user => {
      if (!user.questionsObj.questionHead) {
        user.questionsObj.questionHead = user.userQuestionList[0];
        user.questionsObj.questionNext = user.userQuestionList[1];
        user.questionsObj.correct=0;
        user.questionsObj.incorrect=0;
        console.log('this is firstQues', user.questionsObj.questionHead);
        return res.json(user.questionsObj);
      }
      else{
        return res.json(user.questionsObj);
      }
    })
    .catch(err => {
      next(err);
    });

});


router.post('/questions', (req, res, next) => {
  const { answer } = req.body;
  console.log(answer);
  
  //NOTE FOR START OF DAY:
  //Need to figure out why not getting anything off req body

  const { username } = req.user;
  
  
  User.findOne({ username })
    .then(user => {
      const newList = new LinkedList();
      const newQuestionArray = [];
      // console.log('firssttt', user);
      
      //insert all the array into the new linkedlist
      user.userQuestionList.map(question => {
        newList.insertLast(question);
      });

      console.log('this is the newList before question was answered:', JSON.stringify(newList, null, 2));

      //don't trust users to have answers without whitespace//same case:
      const userAnswer = answer.toLowerCase().trim();
      const correctAnswer = newList.head.value.answer.toLowerCase().trim();

      //check if correct or incorrect:
      if (userAnswer !== correctAnswer){
        console.log('!!!WRONG. the answer was not correct so lets move it back one');
        const newListHead=newList.head.value;
        newList.insertAt(newListHead, 3);
      }
      else if (userAnswer === correctAnswer){
        console.log('!!!NICE. the answer was correct so lets move it to back of list');
        const newListHead=newList.head.value;
        newList.insertLast(newListHead);
      }
      //adding to head question to the last spot and then deleteing the head
      simple(newList);
      console.log('look here to find where the question went?!', JSON.stringify(newList, null, 2));
      
      let currentNode = newList.head;
      while (currentNode !== null) {
        newQuestionArray.push(currentNode.value);
        currentNode= currentNode.next;
      }
  
      user.userQuestionList= newQuestionArray;
      // console.log("ARRAAAYYY",  newQuestionArray);

      User.updateOne({ username }, {$set: {userQuestionList: newQuestionArray}})
        .then(result => {
          console.log('updating list');
        });
      user.questionsObj.questionHead = user.userQuestionList[0];
      user.questionsObj.questionNext = user.userQuestionList[1];
  
      // console.log('finaallll', user.questionsObj);
      return res.json(user.questionsObj);
    })
    .catch(err => {
      next(err);
    });
    
});


module.exports = router;