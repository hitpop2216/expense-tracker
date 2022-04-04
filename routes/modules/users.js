const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')
const {authenticatorForLogin} = require('../../middleware/auth')
const nodemailer = require('../../config/nodemailer')

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

// 忘記密碼
router.get('/forget', (req, res) => {
  res.render('forget')
})
router.post('/forget', (req, res) => {
  const { email } = req.body
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('warning_msg', '無此使用者。')
        return res.redirect('/users/forget')
      }
      const verificationCode = Math.random().toString(36).slice(-8)
      nodemailer(email, verificationCode)
      return res.render('reset', {verificationCode})
    })
    .catch(err => console.log(err))
})
// 重設密碼
router.get('/reset', (req, res) => {
  res.render('reset')
})
router.post('/reset', (req, res) => {
  const { verificationCode, verificationCodeTrue} = req.body
  // 用驗證碼區分要不要直接進入reset頁面
  if (verificationCode) {
    if (verificationCode !== verificationCodeTrue) {
      req.flash('warning_msg', '驗證碼錯誤，請重寄驗證碼！')
      return res.redirect('/users/forget')
    }
    const verificationState = 'verificationState'
    return res.render('reset', { verificationState })
  } else {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body
    const errors = []
    // 因忘記密碼不會顯示舊密碼，所以用有無舊密碼區分重設密碼以及忘記密碼
    if (oldPassword) {
      if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
        errors.push({ message: '所有欄位必填。' })
      }
      if (newPassword !== confirmNewPassword) {
        errors.push({ message: '新密碼與確認密碼不符。' })
      }
      if (errors.length) {
        return res.render('reset', {
          email,
          oldPassword,
          newPassword,
          confirmNewPassword,
          errors
        })
      }
      User
        .findOne({ email })
        .then(user => {
          if (!user) {
            req.flash('warning_msg', '無此使用者。')
            return res.render('reset', { email })
          }
          bcrypt
            .compare(oldPassword, user.password)
            .then(isMatch => {
              if (!isMatch) {
                req.flash('warning_msg', '舊密碼錯誤。')
                return res.redirect('/users/reset')
              }
              return bcrypt
                .genSalt(10)
                .then(salt => bcrypt.hash(newPassword, salt))
                .then(hash => User.findOneAndUpdate({ email }, { password: hash }))
                .then(() => {
                  req.flash('success_msg', '密碼更改成功！')
                  return res.redirect('/users/login')
                })
                .catch(err => console.log(err))
            })
        })
    } else {
      // 使用者因忘記密碼，所以不用輸入舊密碼
      if (!email || !newPassword || !confirmNewPassword) {
        errors.push({ message: '所有欄位必填。' })
      }
      if (newPassword !== confirmNewPassword) {
        errors.push({ message: '新密碼與確認密碼不符。' })
      }
      if (errors.length) {
        return res.render('reset', {
          email,
          newPassword,
          confirmNewPassword,
          errors
        })
      }
      User
        .findOne({ email })
        .then(user => {
          if (!user) {
            req.flash('warning_msg', '無此使用者。')
            return res.render('reset', { email })
          }
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(newPassword, salt))
            .then(hash => User.findOneAndUpdate({ email }, { password: hash }))
            .then(() => {
              req.flash('success_msg', '密碼更改成功！')
              return res.redirect('/users/login')
            })
            .catch(err => console.log(err))
        })
    }
  }
    
})
module.exports = router