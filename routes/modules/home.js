const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 瀏覽首頁
router.get('/', (req, res) => {
  const categoryInfo = req.query.categoryInfo || '全部&'
  const categoryName = categoryInfo.split('&')[0]
  const categoryId = categoryInfo.split('&')[1]
  let categoryDropdown = []
  let filteredRecord = []
  let amountTotal = 0
  Record
    .find()
    .lean()
    .then(records => {
      filteredRecord = records.filter(record => record.categoryId.toString() === categoryId)
      if (categoryName === '全部' || categoryName === '') {
        return records
      }
      return filteredRecord
    })
    .then(records => {
      return Category
        .find()
        .lean()
        .then(categories => {
          categoryDropdown = categories
          return Promise.all(Array.from(records, record => {
            amountTotal += record.amount
            record.date = record.date.toISOString().slice(0, 10)
            return categories.find(category => {
              if (record.categoryId.toString() === category._id.toString()){
                record.icon = category.icon
                return record
              }
            })
          }))
        })
        .then(() => res.render('index', { records, categoryDropdown, categoryName, amountTotal }))
    })
    .catch(err => console.log(err))
})

module.exports = router