const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportSessions = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;
const relationship = require('mongoose-relationship');
const hljs = require('highlight.js');

const auth = require('./routes/auth');
const routes = require('./routes/routes');
const Snippet = require('./models/snippet');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

app.use('/', routes);
app.use('/', auth);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
  console.log(user.username + ' serialized');
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function (err, user) {
    if (err) { return done(err); }
    console.log(user.username + ' deserialized');
    done(null, user);
  });
});

mongoose.connect('mongodb://localhost:27017/snippets');

app.listen(2000, function(){
  console.log("Successfully started express application!")
});

module.exports = app;
