'use strict';

const Job = require('../../models/Job');
const config = require('../../lib/config');

const jobController = () => {
  return {
    /**
     * GET apiv1/main/provinces
     */
    index: async (req, res, next) => {
      try {
        const start = typeof req.query.start === 'undefined' ? config.START : parseInt(req.query.start);
        const limit = typeof req.query.limit === 'undefined' ? config.LIMIT : parseInt(req.query.limit);
        
        const filter = {};
        
        const { id, status, title, published, updated, description, companyName, contractType, remoteType } = req.query;

        if (id) {
          filter.id = id;
        }

        if (status) {
          filter.status = status;
        }

        const jobs = await Job.list({ filter });

        return res.json({ success: true, totalResults: jobs.length, jobs });
      } catch(err) {
        next(err);
        
        return;
      }
    }

  }
}

module.exports = jobController;