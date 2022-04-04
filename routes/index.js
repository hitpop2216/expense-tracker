const express = require('express')
const router = express.Router()

const records = require('./modules/records')
const home = require('./modules/home')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticatorForIndex } = require('../middleware/auth')

router.use('/records', authenticatorForIndex, records)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticatorForIndex, home)

module.exports = router