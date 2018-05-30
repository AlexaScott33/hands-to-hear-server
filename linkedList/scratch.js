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
      console.log('!!!!!!!!', user.questionsObj.incorrect);

      //check if correct or incorrect:
      if (userAnswer !== correctAnswer) {
        incorrectCount = user.questionsObj.incorrect + 1;
        console.log('!!!WRONG. the answer was not correct so lets move it back one');

        
          const newListHead = newList.head.value;
          // condition -> with memValue
          // insertAt memVal of question
          newList.insertAt(newListHead, 3);
        
        
      }
      else if (userAnswer === correctAnswer){
        correctCount = user.questionsObj.correct + 1;
        console.log('!!!NICE. the answer was correct so lets move it to back of list');
        // console.log('questions Mval', newLis)
        const newListHead = newList.head.value;
        newList.insertLast(newListHead);
      }
      // check condition to see if memVal reaches node with next point -> null --> insert at end

      //adding to head question to the last spot and then deleteing the head
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