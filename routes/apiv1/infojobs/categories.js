'use strict';

const express = require('express');
const router = express.Router();
const categoriesController = require('../../../controllers/infojobs/categoriesController');

const { index } = categoriesController();

router.get('/', index);

module.exports = router;