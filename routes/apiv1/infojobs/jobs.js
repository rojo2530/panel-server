'use strict'

const express = require('express')
const router = express.Router()
const jobsController = require('../../../controllers/infojobs/jobsController')

const {index, load} = jobsController()

router.get('/', index)
router.get('/load', load)

module.exports = router
