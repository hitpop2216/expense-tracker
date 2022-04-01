const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  Record
    .find()
    .lean()
    .then(records => { 
      return Promise
        .all(Array.from(records, record=>{
          record.date = record.date.toISOString().slice(0, 10)
          return Category
            .findOne({ _id: record.categoryId })
            .then(item => {
              record.icon = item.icon
              return record
            })
        }))
    })
    .then(records => {
      res.render('index', { records })
    })
    .catch(err => console.log(err))
})



module.exports = router