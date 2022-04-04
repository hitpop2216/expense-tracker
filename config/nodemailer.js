const nodemailer = require("nodemailer")
module.exports = (email, verificationCode) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hitpop2216@gmail.com',
      pass: process.env.NODEMAILER_PASS,
    }
  })

  let mailOptions = {
    from: 'hitpop2216@gmail.com',
    to: email,
    subject: '家庭記帳本驗證碼',
    text: `您的驗證碼為：${verificationCode}`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}