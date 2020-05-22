'use strict';

const Job = require('../../models/Job');
const Province = require('../../models/Province');
const Category = require('../../models/Category');
const config = require('../../lib/config');
const moment = require('moment');
const isKeyValueInArrayObject = require('../../lib/utils');

const TODAY = 'today';
const LAST_2_DAYS = 'last_2_days';
const LAST_3_DAYS = 'last_3_days';
const LAST_WEEK = 'last_week';

const TIME_DATE = [
  {
    key: TODAY,
    value: 'Hoy',
    daysSubtract: 0,
  },
  {
    key: LAST_2_DAYS,
    value: 'Últimos 2 días',
    daysSubtract: 1,
  },
  {
    key: LAST_3_DAYS,
    value: 'Últimos 3 días',
    daysSubtract: 2,
  },
  {
    key: LAST_WEEK,
    value: 'Última semana',
    daysSubtract: 6,
  }
];

function getFilterDate(date = 'today') {
  const [{daysSubtract: days}] = TIME_DATE.filter(timeDate => timeDate.key === date);

  console.log('days', days);
  
  console.log('here')
  if (days === undefined) {
    return undefined;
  }

  const today = moment().subtract(days, 'days').startOf('day');
 
  const todayStart = today.toDate();
  const todayEnd = moment().endOf('day').toDate();

  return {
    $gte: todayStart,
    $lte: todayEnd,
  }
}

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
        
        const { id, status, published, updated, description, province, category, companyName, contractType, remoteType, date, newJob } = req.query;

        let { sort } = req.query;

        
        (id) && (filter.id = id);

        (status) && (filter.status = status);

        (companyName) && (filter.companyName = new RegExp('^' + companyName, 'i'));
        
        if (province) {
          const provinceRegister = await Province.findOne({ key: province });

          (provinceRegister) && (filter.province = provinceRegister._id);
        }

        if (category) {
          const categoryRegister = await Category.findOne({ key: category });

          (categoryRegister) && (filter.category = categoryRegister._id);
        }

        (remoteType) && (filter.remoteType = remoteType);

        (description) && (filter.description = new RegExp('.*' + description , 'i'));

        if (!sort) {
          sort = '-updated';
        }

        if (newJob && newJob === 'true') {
          filter.published = getFilterDate();
        } 


        if (isKeyValueInArrayObject(TIME_DATE, date)) {
          console.log('Entra aquí');
          filter.updated = getFilterDate(date);
          console.log(filter.updated);
        }

        console.log(filter);

        const jobs = await Job.list({ filter, limit, sort });

        return res.json({ success: true, totalResults: jobs.length, jobs, filter });
      } catch(err) {
        next(err);
        
        return;
      }
    },

    update: async (req, res, next) => {
      try {
        const { status } = req.body;

        if (!status) {
          res.json({ success: false, error: 'field status not defined'});
        }

        const job = await Job.findById(req.params.id);
        
        if (job) {
          job.status = status ? status : job.status;
         
          // Guardo anuncio en mongoDB
          const jobUpdated = await job.save();
          
          res.json({ success: true, result: jobUpdated });
          
          return;
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        const err = new Error('Not Advert found');
        err.status = 404;
        
        next(err);
      } catch (error) {
        
      }

    }

  }
}

module.exports = jobController;