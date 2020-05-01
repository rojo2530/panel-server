
'use strict';

const express = require('express');
const router = express.Router();
const provincesController = require('../../../controllers/infojobs/provincesController');

const { index, load } = provincesController();

router.get('/', index);
router.get('/load', load);

module.exports = router;


