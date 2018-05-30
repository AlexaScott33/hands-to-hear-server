'use strict';
//old:
router.post('/questions', (req, res, next) => {
  // console.log('req.bod=====', req.body);
  const {userAnswer} = req.body;
  const {username} = req.user;
  const newList = new LinkedList();
  const newQuestionArray=[];
  
  User.findOne({username})
    .then(user => {
      console.log('firssttt', user);
      user.userQuestionList.map(question=>{
        newList.insertLast(question);
      });
      // console.log(newList);
      simple(newList);
      // console.log('after simple', newList);
  
      let currentNode=newList.head;
      while(currentNode!==null){
        newQuestionArray.push(currentNode.value);
        currentNode= currentNode.next;
      }
      // console.log(newQuestionArray);
  
      user.userQuestionList=newQuestionArray;
      console.log(user.userQuestionList);
  
      User.updateOne({username}, {$set: {userQuestionList: user.userQuestionList}})
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

//new:

// post endpoint for when users enter in an answer
// 1. need to check userAnswer with answer stored in db 
// -> give message and correct answer if wrong -> give message 'Correct' if right 
// 2. implement algo so depending on if user got question right or wrong, put it back in list
// 3. change user score 

// update correct and incorrect for user
// switching questions
router.post('/questions', (req, res, next) => {
  // console.log('req.bod=====', req.body);
  const { answer, correct, incorrect } = req.body;
  // console.log('userAnswer', answer);
  const { username } = req.user;
  const newList = new LinkedList();
  const newQuestionArray=[];
  
  User.findOne({username})
    .then(user => {
      user.userQuestionList.map(question=>{
        newList.insertLast(question);
      });
  
      console.log('this is the list before the user answers the question', JSON.stringify(newList, null, 2));
      console.log('>>this is the question taken form newList:', JSON.stringify(newList.head.value, null, 2));
      console.log('>>this is the answer to the question taken from newList:', newList.head.value.answer);
      console.log('>>this is what the user answer is:', answer);
  
      if (newList.head.value.answer.toLowerCase() !== answer.toLowerCase()) {
        console.log('!!!WRONG. the answer was not correct so lets move it back one');
        newList.insertAt(newList.head.value, 3);
  
      } 
      else if (newList.head.value.answer.toLowerCase() === answer.toLowerCase()) {
        console.log('!!!NICE. the answer was correct so lets move it to back of list');
        newList.insertLast(newList.head.value);
      }
  
      simple(newList);
      console.log('look here to find where the question went?!', JSON.stringify(newList, null, 2));
  
      let currentNode=newList.head;
      while(currentNode!==null){
        newQuestionArray.push(currentNode.value);
        currentNode= currentNode.next;
      }
      // console.log(newQuestionArray);
  
      user.userQuestionList=newQuestionArray;
      // console.log(user.userQuestionList);
  
      User.updateOne({username}, {$set: {userQuestionList: user.userQuestionList}})
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
  
  //TODO:
  // const {correct, incorrect} = req.body
  // if(user.questionObj.correct !== correct){
  //   //means incorrect, please change order of linkedlist/array to work
  //algorithm B that changes so incorrect question appears earlier
  //put post in here and just change simple to algorithm b
  // }
  // else if (correct===user.user.questionObj.correct){
  //   //means correct, keep going in order
  // algorithm A where things progress at the correct pace
  //put post in here and just change simple to algorithm a
  
  // }
    
});
  