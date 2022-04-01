const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 新增
router.get('/new', (req, res) => {
  Category
    .find()
    .lean()
    .then(categories => {
      return res.render('new', {categories})
    })
    .catch(err => console.log(err))
})
router.post('/new', (req, res) => {
  const { name, amount, date, category } = req.body
  if(category === '類別') {
    console.log('請選擇類別。')
    return res.render('new', { name, amount, date })
  }
  return Category
    .findOne({ _id: category})
    .then(category => {
      return Record.create({name, amount, date, categoryId: category})
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  return Record
    .findOne({_id})
    .lean()
    .then(record => {
      return Category
        .find()
        .lean()
        .then(categories => {
          record.date = record.date.toISOString().slice(0, 10)
          categories = categories.filter(category => {
            if (category._id.toString() === record.categoryId.toString()) {
              record.categoryName = category.name
            }
            return record.categoryName !== category.name
          })
          return res.render('edit', { record, categories})
        })
    })
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const { name, amount, date, category } = req.body
  const _id = req.params.id
  Record
    .findOneAndUpdate({_id}, {name, amount, date, categoryId: category})
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