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
  console.log('req.bod=====', req.body);
  const { correct, incorrect } = req.body;
  console.log(correct);

  //NOTE FOR START OF DAY:
  //Need to figure out why correct and incorrect are not coming back in body (req.body = an empty object right now)
  //then the rest of logic below will work once we have those values
  //after logic working: 
  //then add correct and incorrect to updated User in $set method of 
  //to keep track of counts on server and client

  const {username} = req.user;
  const newList = new LinkedList();
  const newQuestionArray=[];
  
  User.findOne({username})
    .then(user => {
      console.log('firssttt', user);
      user.userQuestionList.map(question=>{
        newList.insertLast(question);
      });
      if(correct === user.questionsObj.correct){
        console.log('!!!WRONG. the answer was not correct so lets move it back one');
        const newListHead=newList.head.value;
        simple(newList);
        newList.insertAt(newListHead, 3);
      }
      else if(correct !== user.questionsObj.correct){
        console.log('!!!NICE. the answer was correct so lets move it to back of list');
        const newListHead=newList.head.value;
        simple(newList);
        newList.insertLast(newListHead);
      }
      console.log('look here to find where the question went?!', JSON.stringify(newList, null, 2));
      
      let currentNode=newList.head;
      while(currentNode!==null){
        newQuestionArray.push(currentNode.value);
        currentNode= currentNode.next;
      }
  
      console.log("ARRAAAYYY",  newQuestionArray);

      User.updateOne({username}, {$set: {userQuestionList: newQuestionArray}})
        .then(result => {
          console.log('updating list');
        });
      user.questionsObj.questionHead = user.userQuestionList[0];
      user.questionsObj.questionNext = user.userQuestionList[1];
  
      console.log('finaallll', user.questionsObj);
      return res.json(user.questionsObj);
    })
    .catch(err => {
      next(err);
    });
    
});


module.exports = router;