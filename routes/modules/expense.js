const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

// 新增
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/new', (req, res) => {
  const {name, amount} = req.body
  Expense
    .create({ name, amount })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  Expense
    .findOne({_id})
    .lean()
    .then(expense => res.render('edit', {expense}))
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const { name, amount } = req.body
  const _id = req.params.id
  Expense
    .findOneAndUpdate({_id}, {name, amount})
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  Expense
    .findOneAndRemove({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router