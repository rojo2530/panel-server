'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moment = require('moment')

const opts = { toJSON: { virtuals: true } };


const jobSchema = new Schema({  
    /**
    * id unique for job
    */
    id: { type: String, required: true, index: true },

    /**
    * title for offerJob
    */
    title: { type: String, max: 200, required: true, index: true },
    
    /**
    * Province 
    */
    province: { type: mongoose.Schema.Types.ObjectId, ref:'Province', required: true },
    
    /**
    * Link to offer Job
    */
    link: { type: String, max: 100, required: true, index: true },
    
    /**
     * Category for offer job
     */
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, },
    
    /**
     * Min Salary 
     */
    salaryMin: { type: Number },
    
    /**
     * Max Salary 
     */
    salaryMax: { type: Number },

    /**
     * salary description for example , 12000-15000 brutos/año
     */
    salaryDescription: { type: String, max: 200 },

    /**
     * Publish date for Job
     */
    published: { type: Date, required: true, index: true },

    /**
     * Update date for Job
     */
    updated: { type: Date, required: true, index: true },

    /**
     * Migrated
     */
    migrated: { type: Boolean, required: true, index: true, default: false },

    /**
     * Description for jobs
     */
    description: { type: String, required: true, index: true },

    /**
     * Company Name
     */
    companyName: { type: String, max: 150, required: true, index: true },

    /**
     * Company Link
     */
    companyLink: { type: String, max: 150 },

    /**
     * Company Logo 
     */
    companyLogo: { type: String },

    /**
     * remote Type
     */
    remoteType: { type: String , max: 100, required: true, index: true },

    /**
     * Contract Type, for example 'Indefinido
    */
    contractType: { type: String, max: 150},

    /**
     * status: []
     */
    status: { type: String, enum: ['migrado', 'publicado', 'descartado', 'candidato'], required: true, index: true, default: 'migrado' },
  },

opts);

jobSchema.virtual('newJob').get(function() {
  return moment(this.published).isSame(moment(), 'day');
});

jobSchema.statics.list = function ({ filter, limit, sort }) {
  const query = Job.find(filter).populate('province').populate('category');

  query.limit(limit);
  query.sort(sort);

  return query.exec();
}

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;