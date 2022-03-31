const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

router.get('/', (req, res) => {
  Expense
    .find()
    .lean()
    .then(expenses => {
      expenses.forEach(expense => {
        expense.date = expense.date.toLocaleDateString()
      })
      res.render('index', { expenses })
    })
    .catch(err => console.log(err))
})

module.exports = router