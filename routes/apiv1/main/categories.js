'use strict';

const express = require('express');
const router = express.Router();
const categoriesController = require('../../../controllers/main/categoriesController');

const { index } = categoriesController();

router.get('/', index);

module.exports = router;