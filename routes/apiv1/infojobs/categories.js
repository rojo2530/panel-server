'use strict';

const express = require('express');
const router = express.Router();
const categoriesController = require('../../../controllers/infojobs/categoriesController');

const { index, load } = categoriesController();

router.get('/', index);
router.get('/load', load);

module.exports = router;