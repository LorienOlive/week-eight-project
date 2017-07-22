const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const passportLocalMongoose = require('passport-local-mongoose');
const relationship = require('mongoose-relationship');
const User = require('../models/user');

const snippetSchema = new mongoose.Schema({
  title: {type: String, required: true},
  text: String,
  notes: String,
  language: String,
  date: {type: Date, default: Date.now},
  _creator: {type: String, required: true},
  creator: {type: String, required: true},
  tags: [{
    tag: String
  }]
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
