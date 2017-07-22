const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const passportSessions = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

router.get('/', function (req, res) {
  res.redirect('/signup');
})

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res, next) {
    User.register(new User({ username: req.body.username,
    displayname: req.body.displayname }),
    req.body.password,
    function(err, user) {
        if (err) {
            console.log(user);
            console.log(err);
            return res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, function () {

            user.save()
            .then(function (user) {
            req.session.userId = user._id
            req.session.displayname = user.displayname
            console.log("new user successfully authenticated")
            res.redirect('/home');
            })
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  })
  .then(function (user) {
    req.session.userId = user._id
    req.session.displayname = user.displayname
    console.log("existing user successfully authenticated")
    res.redirect('/home');
  })
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/home');
});

module.exports = router;
