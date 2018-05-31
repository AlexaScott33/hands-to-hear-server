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


describe('Login Testing', function (){
  const username='user';
  const password='password123';
  //   const fullName='Test User';

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
  });
    
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });

  describe('Hands to Hear /api/login', function () {
    it.only('Should return a valid auth token', function () {
      return chai.request(app)
        .post('/api/users')
        .send({ username, password })
        .then(()=>{
          return chai.request(app)
            .post('/api/login')
            .send({ username, password });
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.authToken).to.be.a('string');

          const payload = jwt.verify(res.body.authToken, JWT_SECRET);

          expect(payload.user).to.not.have.property('password');
          expect(payload.user).to.have.keys( 'username', 'fullName', 'id', 'questionsObj', 'userQuestionList' );
        });
    });

  });



});