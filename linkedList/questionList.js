'use strict';
const LinkedList = require('./linkedList');
const questions= require('../db/questions');

const QuestionList= new LinkedList();
questions.map(question => {
  QuestionList.insertLast(question);
});

// console.log(JSON.stringify(QuestionList, null, 2));

function displayFirstQuestion(list) {
  //console.log('!!!!!!!!!!!!!!!!!!', JSON.stringify(list.head.value));
  console.log(list.head.value);
  return list.head.values;
}

function simple(list) {
  console.log('old list', JSON.stringify(list, null, 2));
  displayFirstQuestion(list);

  const firstQues = list.head.value;
  console.log('this is the first question:', firstQues);

  
  list.insertLast(firstQues);
  list.remove(firstQues);
  console.log('this is the new list after putting questoin to end of list', JSON.stringify(list, null, 2));
}

//display(QuestionList);
simple(QuestionList);
  
module.exports = QuestionList;