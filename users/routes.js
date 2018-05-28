'use strict';

const express = require('express');
const router = express.Router();

const User = require('./models');

// get all users from mLab
router.get('/users', (req, res) => {
  User.find()
    .then(results => {
      res.json(results);
    });
  
});

module.exports = router;