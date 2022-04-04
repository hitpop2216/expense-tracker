const express = require('express')
const router = express.Router()
const passport = require('passport')

// Facebook auth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }))

// Google auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login',
  successRedirect: '/'
}))

module.exports = router