'use strict';

const express = require('express');
const router = express.Router();
const jobsController = require('../../../controllers/main/jobsController');

const { index } = jobsController();

router.get('/', index);

module.exports = router;