'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({  
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

categorySchema.statics.list = function () {
  const query = Category.find({});

  return query.exec();
}

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
