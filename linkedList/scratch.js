'use strict';

const questionsArr = [
  {
    'img': 'https://lingojam.com/img/ASL_signs/a.png',
    'answer': 'a'
  },
  {
    'img': 'https://ih0.redbubble.net/image.171914409.3994/flat,1000x1000,075,f.u1.jpg',
    'answer': 'b'
  },
  {
    'img': 'https://i.pinimg.com/originals/3a/5d/35/3a5d355b147e16363bad086eba3ba101.png',
    'answer': 'c'
  }
];

const LinkedList = require('./linkedList');

const QuestionList = new LinkedList();



function test() {
  const newList = questionsArr.map(question => QuestionList.insertLast(question));
  // console.log(JSON.stringify(newList));
}

// test();