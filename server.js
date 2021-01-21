require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn')
const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(helmet());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// init passport config MUST happen after session config
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Write custom middleware to access the user on every response
app.use((req, res, next) => {
  let alerts = req.flash();
  console.log(alerts);
  res.locals.alerts = alerts;
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  req.session.testVar = 'fire!!!'
  res.render('index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  console.log(req.session.testVar);
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));
// app.use('/dino', isLoggedIn, require('./routes/dinos)); <- if whole route is authorized

var server = app.listen(process.env.PORT || 8000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 8000}🎧`));

module.exports = server;
