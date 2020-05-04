'use strict'

const infojobsApi = require('../../scrapping/infojobs');
const Job = require('../../models/Job');
const Province = require('../../models/Province');
const Category = require('../../models/Category');
const config = require('../../lib/config');

const {getProvinces, getJobs} = infojobsApi();

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
        const jobs = await getJobs('teletrabajo');

        console.log('jobs', jobs);
        const offers = []
        let registersUpdated = 0;

        if (jobs) {
          for (let offer of jobs.offers) {
            const province  = await Province.findOne({id: offer.province.id}); 
            const category = await Category.findOne({id: offer.category.id});
            let job = await Job.findOne({id: offer.id});

            //if job exits, then update
            if (job) {
              registersUpdated++;
              
              job.title = offer.title || job.title;
              job.province = province._id || job.province;
              job.link = offer.link || job.link;
              job.category = category._id || job.category;
              job.salaryMin = offer.minPay ? offer.minPay.amount : 0;
              job.salaryMax = offer.maxPay ? offer.maxPay.amount : 0;
              job.salaryDescription = offer.salaryDescription || job.salaryDescription;
              job.published = offer.published || job.published;
              job.updated = offer.updated || job.updated;
              job.description = offer.minRequirements + '\n\n\n' + offer.description;
              job.companyName = offer.profile.name || job.companyName;
              job.companyLink = offer.profile.web || job.companyLink;
              job.companyLogo = offer.profile.logoUrl || job.companyLogo;
              job.contractType =  offer.contractType.value || job.contractType;

              await job.save();
            
            } else {
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
          }

          const reg = await Job.insertMany(offers);

          return res.json({
            success: true, 
            newRegisters: reg.length || 0,
            updatedRegisters: registersUpdated,  
            TotalResults: jobs.totalResults, 
            offers: offers
           
          });
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
