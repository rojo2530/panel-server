
'use strict';

const express = require('express');
const router = express.Router();
const provincesController = require('../../../controllers/infojobs/provincesController');

const { index } = provincesController();

router.get('/', index);

module.exports = router;


