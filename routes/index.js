const express = require('express')
const router = express.Router()

const expense = require('./modules/expense')
const home = require('./modules/home')

router.use('/expense', expense)
router.use('/', home)

module.exports = router