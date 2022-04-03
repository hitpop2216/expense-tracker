const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')
const {authenticatorForLogin} = require('../../middleware/auth')

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword){
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword
    })
  }
  if (password !== confirmPassword) {
    errors.push({message: '密碼和確認密碼不相符。'})
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  return User
    .findOne({email})
    .then(user => {
      if(user) {
        errors.push({ message: '此 email 已註冊。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name, 
          email,
          password: hash
        }))
        .then(() => res.redirect('/users/login'))
    })
    .catch(err => console.log(err))
})

// 登入
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', authenticatorForLogin, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureMessage: true,
  failureFlash: true,
}))

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已登出成功。')
  res.redirect('/users/login')
})
module.exports = router