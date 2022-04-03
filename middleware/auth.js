module.exports = {
  authenticatorForIndex: (req, res, next) => {
    if(req.isAuthenticated()) {
      return next()
    }
    return res.redirect('/users/login')
  },
  authenticatorForLogin: (req, res, next) => {
    const { password, email } = req.body
    if (!password || !email) {
      req.flash('warning_msg', '請輸入帳號或密碼。')
      return res.redirect('/users/login')
    }
    return next()
  }
}