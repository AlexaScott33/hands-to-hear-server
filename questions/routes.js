'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Question = require('./models');

// get all questions from mLab to test endpoint
router.get('/protected', (req, res) => {
  Question.find()
    .then(results => {
      res.json(results);
    }).catch(err=> console.log(err));
});

module.exports = router;