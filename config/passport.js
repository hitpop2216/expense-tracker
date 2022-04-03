const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true},(req,email, password, done) => {
    User
      .findOne({email})
      .then(user => {
        if(!user) done(null, false, req.flash('warning_msg', '無此使用者。'))
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) done(null, false, req.flash('warning_msg', '帳號或密碼錯誤。'))
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User
      .findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))
  })
}