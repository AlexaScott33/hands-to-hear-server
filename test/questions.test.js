'use strict';

const {app} = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../users/models');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Questions Testing', function(){
  let user;
  let token;

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return chai.request(app)
      .post('/api/users')
      .send({ username:'test', password:'testtest' })
      .then(()=>{
        return chai.request(app)
          .post('/api/login')
          .send({ username:'test', password:'testtest' });
      })
      .then((res)=>{
        token=res.body.authToken;
        const payload = jwt.verify(res.body.authToken, JWT_SECRET);
        user=payload.user;
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/questions', function () {
    it('should return the questionsObj', function () {
      const dbPromise = User.findOne({ username: user.username });
      const apiPromise = chai.request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('correct', 'incorrect', 'questionHead');
        });
    }); 
  });


  describe('POST /api/questions', function () {

    it('should return a new questionHead/change the userQuestionList order so that a is in the 2nd place, then b should go to 2, and then a in the 4th place once a is right again when provided with correct answer each time', function () {
      const answer='a';
      let body;
      User.findOne({ username:user.username }).then(data=>console.log('first find', data.userQuestionList[0]));
      return chai.request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({answer})
        .then(function (res) {
          body = res.body;
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('questionHead', 'correct', 'incorrect');
          expect(body.questionHead.answer).to.equal('b');
          expect(body.questionHead.memVal).to.equal('1');
          expect(body.incorrect).to.equal(0);
          expect(body.correct).to.equal(1);
          return User.findOne({ username:user.username });
        })
        .then(data => {
          //why does this update sometimes and other times, it updates after we look for the user?
          console.log('data', data.userQuestionList[0]);
          expect(body.questionHead.answer).to.equal(data.userQuestionList[0].answer);
          expect(body.questionHead.memVal).to.equal(data.userQuestionList[0].memVal);
          expect(data.userQuestionList[1].answer).to.equal('a');
          expect(data.userQuestionList[1].memVal).to.equal(2);
        })
        .then(()=>{
          return chai.request(app)
            .post('/api/questions')
            .set('Authorization', `Bearer ${token}`)
            .send({answer:'b'});
        })
        .then(function (res) {
          body = res.body;
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('questionHead', 'correct', 'incorrect');
          expect(body.questionHead.answer).to.equal('a');
          expect(body.questionHead.memVal).to.equal(2);
          expect(body.correct).to.equal(2);
          return User.findOne({ username:user.username });
        })
        .then(data => {
          expect(body.questionHead.answer).to.equal(data.userQuestionList[0].answer);
          expect(body.questionHead.memVal).to.equal(data.userQuestionList[0].memVal);
          expect(data.userQuestionList[1].answer).to.equal('b');
          expect(data.userQuestionList[1].memVal).to.equal(2);
        })
        .then(()=>{
          return chai.request(app)
            .post('/api/questions')
            .set('Authorization', `Bearer ${token}`)
            .send({answer:'a'});
        })
        .then(function (res) {
          body = res.body;
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('questionHead', 'correct', 'incorrect');
          expect(body.questionHead.answer).to.equal('b');
          expect(body.questionHead.memVal).to.equal(2);
          expect(body.correct).to.equal(3);
          return User.findOne({ username:user.username });
        })
        .then(data => {
          expect(body.questionHead.answer).to.equal(data.userQuestionList[0].answer);
          expect(body.questionHead.memVal).to.equal(data.userQuestionList[0].memVal);
          expect(data.userQuestionList[3].answer).to.equal('a');
          expect(data.userQuestionList[3].memVal).to.equal(4);
        });
    });

    it('should return a new questionHead/change the userQuestionList order so that a is in the 2nd place when provided a wrong answer', function () {
      const answer='wrong answer';
      let body;
      User.findOne({ username:user.username }).then(data=>console.log(data.userQuestionList[0]));
      return chai.request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({answer})
        .then(function (res) {
          body = res.body;
          console.log('this is body', body);
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('questionHead', 'correct', 'incorrect');
          expect(body.questionHead.answer).to.equal('b');
          expect(body.questionHead.memVal).to.equal('1');
          expect(body.incorrect).to.equal(1);
          expect(body.correct).to.equal(0);
          return User.findOne({ username:user.username });
        })
        .then(data => {
          //why does this update sometimes and other times, it updates after we look for the user?
          console.log('data', data.userQuestionList[0]);
          expect(body.questionHead.answer).to.equal(data.userQuestionList[0].answer);
          expect(body.questionHead.memVal).to.equal(data.userQuestionList[0].memVal);
          expect(data.userQuestionList[1].answer).to.equal('a');
          expect(data.userQuestionList[1].memVal).to.equal(1);
        });
    });
  });

});