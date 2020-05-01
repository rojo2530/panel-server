'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const provinceSchema = new Schema({  
    /**
    * id unique for province
    */
    id: { type: Number, required: true, index: true },
    /**
    * value name for Province
    */
    value: { type: String, max: 100, required: true, index: true },
    /**
    * order 
    */
    order: { type: Number, required: true },
    /**
    * key
    */
    key: { type: String, max: 100, required: true, index: true },
  },
  {
    /**
    * Add updated at and created at
    */
    timestamps: true,
  }    
);

provinceSchema.statics.list = function () {
  const query = Province.find({});

  return query.exec();
}

const Province = mongoose.model('Province', provinceSchema);

module.exports = Province;
