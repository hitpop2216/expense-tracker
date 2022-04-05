const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const bcrypt = require('bcryptjs')
const Category = require('../category')
const SEED_USER = {
  name: 'user',
  email: 'user@example.com',
  password: '12345678',
  records: [
    {
      name: '房租',
      amount: '6500',
      category: '家居物業'
    },
    {
      name: '伙食費',
      amount: '500',
      category: '餐飲食品'
    },
    {
      name: '車票',
      amount: '300',
      category: '交通出行'
    }
  ]
}
db.once('open', () => {
  User
    .findOne({email:SEED_USER.email})
    .then(user => {
      if (user) {
        console.log('已經建立過user帳號。')
        return user
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USER.password, salt))
        .then(hash => User.create({
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: hash
        }))
    })
    .then(user => {
      return Promise.all(Array.from(SEED_USER.records, record=>{
         return Category
          .findOne({ name: record.category })
          .lean()
          .then(category=>{
            return Record.create({
              name: record.name,
              amount: record.amount,
              userId: user._id,
              categoryId : category._id
            })
          })
      }))
    })
    .then(() => {
      console.log('建立user支出成功!')
      process.exit()
    })
    .catch(err => console.log(err))
})