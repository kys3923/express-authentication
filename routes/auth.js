const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// sign up POST route
router.post('/signup', (req, res) => {
  // findOrCreate a new user based on email(unique item)
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    // if the user was created)
    if (created) {
      console.log(`================================${user.name} was created`)
      // authenticate and redirect to homepage or profile
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Successful account creation'
      })(req, res);
      // res.redirect('/');
    } else {
      // if user wasn't created, there is a user at that email, so they can't sign up
      console.log(`=================================${user.name} already exists`);
      // redirect to /auth/signup
      req.flash('error', 'email already exsists');
      res.redirect('/auth/signup');
    }
  }).catch(err => {
    // if there is an err, it's prob validation err, so we'll return to /auth/signup
    console.log("error found @ creating user");
    console.log(err);
    req.flash('error', err.message);
    res.redirect('/auth/signup');
  })
})

router.get('/login', (req, res) => {
  res.render('auth/login');
});

// make passport do the login stuff

router.post('/login', passport.authenticate('local', { 
  failureRedirect: '/auth/login', 
  successRedirect: '/',
  failureFlash: 'Invalid login credentials',
  successFlash: 'successfully logged In'
}));


// logout route

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
});
module.exports = router;
