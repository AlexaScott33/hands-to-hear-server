'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const User = require('../users/models');
const { LinkedList, size } = require('../linkedList/linkedList');
const { displayAndRemove }= require('../linkedList/questionList');

router.get('/questions', (req, res, next) => {
  const {username} = req.user;

  User.findOne({username})
    .then(user => {
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
  const { username } = req.user;
  
  
  User.findOne({ username })
    .then(user => {
      const newList = new LinkedList();
      const newQuestionArray = [];

      // insert all questions in the array into the new linkedlist
      user.userQuestionList.map(question => {
        newList.insertLast(question);
      });

      // don't trust users to have answers without whitespace and take care of case sensitivity
      const userAnswer = answer.toLowerCase().trim();
      const correctAnswer = newList.head.value.answer.toLowerCase().trim();

      let correctCount = user.questionsObj.correct;
      let incorrectCount = user.questionsObj.incorrect;

      // get length of LL to check with memVal
      const lengthofLL = size(newList);

      // check if correct or incorrect:
      if (userAnswer !== correctAnswer){
        incorrectCount = user.questionsObj.incorrect + 1;

        // incorrect resets memVal to 1 and moves question to memVal + 1
        newList.head.value.memVal = 1;

        const newListHead = newList.head.value;
        newList.insertAt(newListHead, newList.head.value.memVal + 1);
      }
      else if (userAnswer === correctAnswer){
        correctCount = user.questionsObj.correct + 1;

        // correct doubles memVal and moves questoin to position of memVal
        newList.head.value.memVal *= 2;

        // checks length of LL against memVal and moves question to end of list 
        if (lengthofLL <= newList.head.value.memVal) {
          newList.head.value.memVal = lengthofLL;
          const newListHead = newList.head.value;
          newList.insertAt(newListHead, newList.head.value.memVal);
        } else {
          const newListHead = newList.head.value;
          newList.insertAt(newListHead, newList.head.value.memVal);
        }
      }
      
      displayAndRemove(newList);
      
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