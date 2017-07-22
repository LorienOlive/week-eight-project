const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const expressValidator = require("express-validator");
const passport = require('passport');
const passportSessions = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
const hljs = require('highlight.js');

const Snippet = require('../models/snippet');
const User = require('../models/user');


router.get('/home', function (req, res) {
  Snippet.find({})
  .then(function (snippet) {
      res.render('home', {currentUser: req.session.displayname, snippet: snippet})
    })
})

router.post('/home', function(req, res) {
  if (req.body.snippet) {
    const newSnippet = new Snippet({
      title: req.body.title,
      text: req.body.snippet,
      notes: req.body.notes,
      language: req.body.language,
      date: new Date(),
      _creator: req.session.userId,
      creator: req.session.displayname,
      })
      newSnippet.save()
      .then(function (newSnippet) {
        console.log("new snippet added to db");
        res.redirect('/home');
      }).catch(function (err) {
        res.send("something went wrong", err);
        console.log(err);
      })
   } else if (req.body.deleteButton) {
     Snippet.deleteOne({
       _id: req.body.deleteButton
     })
     .then( function (snippet) {
        res.redirect('/home');
     })
   }
})


router.post('/home/addTags/:id', function(req, res) {
  Snippet.findById(req.params.id)
  .then(function (snippet) {
    snippet.tags.push({
      tag: req.body.tags
      })
      snippet.save()
        .then(function (snippet) {
          res.redirect('/home');
      })
  })
})

router.get('/home/searchByTag/:tag', function(req, res) {
  Snippet.find({ 'tags.tag': req.params.tag})
  .then(function(snippet) {
    res.render('home', { currentUser: req.session.displayname, snippet: snippet })
  })
})

router.get('/home/findByUser/:_creator', function(req, res) {
  Snippet.find({ _creator: req.params._creator })
  .then(function(snippet) {
    res.render('home', { currentUser: req.session.displayname, snippet: snippet })
  })
})

router.get('/home/findByLanguage/:language', function(req, res) {
  Snippet.find({ language: req.params.language })
  .then(function(snippet) {
    res.render('home', { currentUser: req.session.displayname, snippet: snippet })
  })
})

router.get('/snippet/:id', function(req, res) {
  Snippet.findOne({ _id: req.params.id })
  .then(function(snippet) {
    if (snippet._creator === req.session.userId) {
      snippet.editable = true;
    } else {
      snippet.editable = false;
    }
    res.render('snippets', { currentUser: req.session.displayname, snippet: snippet })
  })
})

router.post('/snippet/:id', function(req, res) {
  Snippet.findOne({ _id: req.params.id })
  .then(function(snippet) {
    snippet.edit = true;
    res.render('snippets', { currentUser: req.session.displayname, snippet: snippet })
  })
})

router.post('/snippet/addTags/:id', function(req, res) {
  Snippet.findById(req.params.id)
  .then(function(snippet) {
    snippet.tags.push({
      tag: req.body.tags
      })
      snippet.save()
        .then(function (snippet) {
          res.redirect('/snippet/' + req.params.id);
      })
  })
})

router.post('/snippet/:id/edit', function(req, res) {
  Snippet.findById(req.params.id)
  .then(function(snippet) {
    snippet.title = req.body.title;
    snippet.text = req.body.snippet;
    snippet.notes = req.body.notes,
    snippet.language = req.body.language,
    snippet.date = new Date()
    snippet.save()
      .then(function(snippet) {
        console.log("snippet has been updated");
        res.redirect('/snippet/' + req.params.id);
      })
   })
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signup');
});

module.exports = router;
