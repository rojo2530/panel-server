'use strict';

const Job = require('../../models/Job');

const jobController = () => {
  return {
    /**
     * GET apiv1/main/provinces
     */
    index: async (req, res, next) => {
      try {
        const jobs = await Job.list();

        return res.json({ success: true, jobs });
      } catch(err) {
        next(err);
        
        return;
      }
    }

  }
}

module.exports = jobController;