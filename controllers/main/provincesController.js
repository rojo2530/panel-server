'use strict';

const Province = require('../../models/Province');

const provinceController = () => {
  return {
    /**
     * GET apiv1/main/provinces
     */
    index: async (req, res, next) => {
      try {
        const provinces = await Province.list();

        return res.json({ success: true, provinces });
      } catch(err) {
        next(err);
        
        return;
      }
    }

  }
}

module.exports = provinceController;