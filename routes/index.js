const express = require('express')
const router = express.Router()

const records = require('./modules/records')
const home = require('./modules/home')
const users = require('./modules/users')
const { authenticatorForIndex} = require('../middleware/auth')

router.use('/records', authenticatorForIndex, records)
router.use('/users', users)
router.use('/', authenticatorForIndex, home)

module.exports = router