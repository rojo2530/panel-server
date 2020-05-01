'use strict';

const Category = require('../../models/Category');

const categoryController = () => {
  return {
    /**
     * GET apiv1/main/provinces
     */
    index: async (req, res, next) => {
      try {
        const categories = await Category.list();

        return res.json({ success: true, categories });
      } catch(err) {
        next(err);
        
        return;
      }
    }

  }
}

module.exports = categoryController;