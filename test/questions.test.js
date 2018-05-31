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
        console.log(user);
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/questions', function () {
    it.only('should return the questionsObj', function () {
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

});