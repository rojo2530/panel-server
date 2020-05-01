'use strict';

const infojobsApi = require('../../scrapping/infojobs');
const Category = require('../../models/Category');

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
    },

    /**
     * Load Categories from Infojobs to Mongo
     */

    load: async (req, res, next) => {
      try {
        const categories = await getCategories();

        if (categories) {
          const reg = await Category.insertMany(categories);
          
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

module.exports = categoriesController; 