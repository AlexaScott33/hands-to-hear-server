'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Question = require('./models');
const { LinkedList, size} = require('../linkedList/linkedList');
const User = require('../users/models');
const { simple }= require('../linkedList/questionList');

// get one question from mLab to test endpoint
// get one question *needs to be specific for user depending on where user left off*
// user.findOne({username}) where {username} = req.user
router.get('/questions', (req, res, next) => {

  // if quesHead and quesNext are empty then populate
  const {username} = req.user;

  User.findOne({username})
    .then(user => {
      // console.log('this is user', user);
      if (!user.questionsObj.questionHead) {
        user.questionsObj.questionHead = user.userQuestionList[0];
        user.questionsObj.questionNext = user.userQuestionList[1];
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
  
  //NOTE FOR START OF DAY:
  //Need to figure out why not getting anything off req body

  const { username } = req.user;
  
  
  User.findOne({ username })
    .then(user => {
      const newList = new LinkedList();
      const newQuestionArray = [];

      //insert all the array into the new linkedlist
      user.userQuestionList.map(question => {
        newList.insertLast(question);
      });

      console.log('this is the newList before question was answered:', JSON.stringify(newList, null, 2));

      //don't trust users to have answers without whitespace//same case:
      const userAnswer = answer.toLowerCase().trim();
      const correctAnswer = newList.head.value.answer.toLowerCase().trim();

      let correctCount = user.questionsObj.correct;
      let incorrectCount = user.questionsObj.incorrect;

      // get length of LL to check with memVal
      const lengthofLL = size(newList);

      //check if correct or incorrect:
      if (userAnswer !== correctAnswer){
        incorrectCount = user.questionsObj.incorrect + 1;
        console.log('!!!WRONG. the answer was not correct so lets move it back one');

        // incorrect os reset memVal to 1
        newList.head.value.memVal = 1;
        console.log('LOOK HER FOR MEMVAL WHEN INCORRECT', newList.head.value.memVal);

        const newListHead = newList.head.value;
        newList.insertAt(newListHead, newList.head.value.memVal + 1);
      }
      else if (userAnswer === correctAnswer){
        correctCount = user.questionsObj.correct + 1;
        console.log('!!!NICE. the answer was correct so lets move it to back of list');

        // correct so double memVal
        newList.head.value.memVal *= 2;
        console.log('LOOK HER FOR MEMVAL WHEN CORRECT', newList.head.value.memVal);

        if (lengthofLL <= newList.head.value.memVal) {
          console.log('condition checking length. memval before', newList.head.value.memVal);
          newList.head.value.memVal = lengthofLL;
          const newListHead = newList.head.value;
          newList.insertAt(newListHead, newList.head.value.memVal);
          console.log('memVal after', newList.head.value.memVal);
        } else {
          const newListHead = newList.head.value;
          newList.insertAt(newListHead, newList.head.value.memVal);
        }
      }
      
      
      //adding the head question to the last spot and then deleteing the head
      simple(newList);

      console.log('look here to find where the question went?!', JSON.stringify(newList, null, 2));
      
      let currentNode = newList.head;
      while (currentNode !== null) {
        newQuestionArray.push(currentNode.value);
        currentNode= currentNode.next;
      }
  
      user.userQuestionList = newQuestionArray;
      user.questionsObj.correct = correctCount;
      user.questionsObj.incorrect = incorrectCount;

      User.updateOne({ username }, 
        {
          $set: {
            userQuestionList: newQuestionArray,
            questionsObj: {
              questionHead: user.questionsObj.questionHead,
              correct: correctCount,
              incorrect: incorrectCount 
            }
          }
        })
        .then(result => {
          console.log('updating list');
        });

      user.questionsObj.questionHead = user.userQuestionList[0];
      user.questionsObj.questionNext = user.userQuestionList[1];
  
      return res.json(user.questionsObj);
    })
    .catch(err => {
      next(err);
    });
    
});


module.exports = router;