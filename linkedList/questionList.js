'use strict';
const LinkedList = require('./linkedList');
const questions= require('../db/questions');

const QuestionList= new LinkedList();
questions.map(question=>{
  QuestionList.insertFirst(question);
});
  
module.exports= QuestionList;