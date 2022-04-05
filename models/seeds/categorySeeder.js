const db = require('../../config/mongoose')
const Category = require('../category')
const CATEGORY = require('../category.json')
db.once('open', () => {
  Category
    .find()
    .then(categories => {
      if(categories.length) {
        console.log('已經建立過類別。')
        process.exit()
      }
      return Promise
        .all(Array.from(CATEGORY, category => {
          return Category.create({
            name: category.name,
            icon: category.icon
          })
        }))
        .then(() => {
          console.log('類別初始化成功!')
          process.exit()
        })
        .catch(err => console.log(err))
    })
})