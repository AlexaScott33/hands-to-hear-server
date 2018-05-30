'use strict';

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