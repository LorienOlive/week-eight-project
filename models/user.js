const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const passportLocalMongoose = require('passport-local-mongoose');
const relationship = require("mongoose-relationship");

const userSchema = new mongoose.Schema ({
  displayname: String
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
