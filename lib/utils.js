'use strict';

const isKeyValueInArrayObject = (array, key) => array.some(obj => obj.key === key);

module.exports = isKeyValueInArrayObject;

