'use strict';

const express = require('express');
const router = express.Router();

const User = require('./models');

// get users mLab
//test mLab - url

router.get('/users', (req, res) => {
  User.find()
    .then(results => {
      res.json(results);
    });
  
});

module.exports = router;