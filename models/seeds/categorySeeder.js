const db = require('../../config/mongoose')
const Category = require('../category')
const CATEGORY = require('../category.json')
db.once('open', () => {
  Promise
    .all(Array.from(CATEGORY, category => {
      return Category.create({
        name: category.name,
        icon: category.icon
      })
    }))
    .then(() => {
      console.log('Done!')
      process.exit()
    })
    .catch(err => console.log(err))
})