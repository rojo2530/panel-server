'use strict'

const infojobsApi = require('../../scrapping/infojobs');
const Job = require('../../models/Job');
const Province = require('../../models/Province');
const Category = require('../../models/Category');

const {getProvinces, getJobs} = infojobsApi()

const jobsController = () => {
  return {
    /**
     * GET apiv1/infojobs/provinces
     */
    index: async (req, res, next) => {
      try {
        const jobs = await getJobs('teletrabajo', 2)

        return res.json({success: true, jobs})
      } catch (err) {
        next(err)

        return
      }
    },
    /**
     * Load Provinces from Infojobs to Mongo
     */

    load: async (req, res, next) => {
      try {
        const jobs = await getJobs('teletrabajo', 1)

        const offers = []

        if (jobs) {
          for (let offer of jobs.offers) {
            const province  = await Province.find({id: offer.province.id}); 
            const category = await Category.find({id: offer.category.id});
            console.log('hola', offer.category.id);
            
            offers.push({
              id: offer.id,
              title: offer.title,
              province: province._id,
              link: offer.link,
              category: category._id,
              salaryMin: offer.minPay ? offer.minPay.amount : 0,
              salaryMax: offer.maxPay ? offer.maxPay.amount : 0,
              salaryDescription: offer.salaryDescription,
              published: offer.creationDate,
              updated: offer.updateDate,
              description: offer.minRequirements + '\n\n\n' + offer.description,
              companyName: offer.profile.name,
              companyLink: offer.profile.web,
              companyLogo: offer.profile.logoUrl || '',
              contractType: offer.contractType.value,
              remoteType: 'Teletrabajo parcial',
            });
          }

          // const reg = await Job.insertMany(offers);

          return res.json({success: true, TotalResults: jobs.TotalResults, newRegisters: offers})
        }

        return res.json({success: false})
      } catch (err) {
        next(err)

        return
      }
    },
  }
}

module.exports = jobsController
