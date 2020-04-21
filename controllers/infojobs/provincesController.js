'use strict';

const infojobsApi = require('../../scrapping/infojobs');

const { getProvinces } = infojobsApi();

const provincesController = () => {
  return {
    /**
     * GET apiv1/infojobs/provinces
     */
    index: async (req, res, next) => {
      try {
        const provinces = await getProvinces();

        return res.json({ success: true, provinces });
      } catch(err) {
        next(err);
        
        return;
      }
    }
  }
}

module.exports = provincesController; 