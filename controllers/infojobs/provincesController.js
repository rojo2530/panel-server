'use strict';

const infojobsApi = require('../../scrapping/infojobs');
const Province = require('../../models/Province');

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
    },
    /**
     * Load Provinces from Infojobs to Mongo
     */

    load: async (req, res, next) => {
      try {
        const provinces = await getProvinces();

        if (provinces) {
          const reg = await Province.insertMany(provinces);
          
          return res.json({ success: true, newRegisters: reg.length });
        }

        return res.json({ success: false });

      } catch(err) {
        next(err);

        return;
      }
    }
  }
}

module.exports = provincesController; 