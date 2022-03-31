const express = require('express')
const router = express.Router()

const record = require('./modules/record')
const home = require('./modules/home')

router.use('/record', record)
router.use('/', home)

module.exports = router