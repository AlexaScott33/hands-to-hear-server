'use strict';
const LinkedList = require('./linkedList');
const questions= require('../db/questions');

const QuestionList= new LinkedList();
questions.map(question => {
  QuestionList.insertLast(question);
});

// console.log(JSON.stringify(QuestionList, null, 2));

function displayFirstQuestion(list) {
  return list.head.values;
}

function simple(list) {
  displayFirstQuestion(list);

  const firstQues = list.head.value;

  
  list.insertLast(firstQues);
  list.remove(firstQues);
  return list;
}

//display(QuestionList);
// simple(QuestionList);
  
module.exports = {QuestionList, simple};