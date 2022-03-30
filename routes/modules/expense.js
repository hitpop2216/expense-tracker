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
    .create({name, amount})
    .then(() => res.render('index', {name, amount}))
    .catch(err => console.log(err))
})

module.exports = router