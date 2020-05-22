'use strict';

const express = require('express');
const router = express.Router();
const jobsController = require('../../../controllers/main/jobsController');

const { index, update } = jobsController();

router.get('/', index);
router.put('/:id', update);

module.exports = router;