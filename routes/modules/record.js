const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const CATEGORY = require('../../models/category.json')

// 新增
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/new', (req, res) => {
  const { name, amount, date, category} = req.body
  const categoryData = CATEGORY.find(item => item.id.toString() === category)
  Category
    .findOne({ name: categoryData.name })
    .then(category => {
      const categoryId = category._id
      return Record
        .create({name, amount, date, categoryId})
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id

  Record
    .findOne({_id})
    .lean()
    .then(record => {
      record.date = record.date.toLocaleDateString()
      res.render('edit', { record })
    })
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const { name, amount, date, category } = req.body
  const _id = req.params.id
  Record
    .findOneAndUpdate({_id}, {name, amount, date, category})
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  Record
    .findOneAndRemove({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router