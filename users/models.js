'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const QuestionList = require('../linkedList/questionList');
const questions = require('../db/questions');


const userSchema = new mongoose.Schema({
  fullName: {type: String},
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userQuestionList: { type: Object, default: questions },
  questionsObj: {
    questionHead: { type: Object, default: null },
    // questionNext: { type: Object, default: null },
    // answered: { type: Boolean },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  }
});

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    userId: this._id,
    fullName: this.fullName || ''
  };
};

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};


module.exports = mongoose.model('User', userSchema);