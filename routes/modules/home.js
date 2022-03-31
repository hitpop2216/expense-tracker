const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  Record
    .find()
    .lean()
    .then(records => { 
      Promise
        .all(Array.from(records, record=>{
          record.date = record.date.toLocaleDateString()
          Category
            .findOne({ _id: record.categoryId })
            .then(item => {
              record.icon = item.icon
            })
        }))
      return records
    })
    .then(records => {
      res.render('index', { records })
    })
    .catch(err => console.log(err))
})

module.exports = router