'use strict';

const infojobsApi = require('../../scrapping/infojobs');

const { getCategories } = infojobsApi();

const categoriesController = () => {
  return {
    /**
     * GET apiv1/infojobs/provinces
     */
    index: async (req, res, next) => {
      try {
        const categories = await getCategories();

        return res.json({ success: true, categories });
      
      } catch(err) {
        next(err);
        
        return;
      }
    }
  }
}

module.exports = categoriesController; 