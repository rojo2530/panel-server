'use strict'

const infojobsApi = require('../../scrapping/infojobs');
const Job = require('../../models/Job');
const Province = require('../../models/Province');
const Category = require('../../models/Category');
const config = require('../../lib/config');
const moment = require('moment');

const {getProvinces, getJobs} = infojobsApi();

const jobsController = () => {
  return {
    /**
     * GET apiv1/infojobs/provinces
     */
    index: async (req, res, next) => {
      try {
        req.setTimeout(0);

        const jobs = await getJobs('teletrabajo', 10)

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
        req.setTimeout(0);

        const jobs = await getJobs('teletrabajo', 200);

        const offers = []
        let registersUpdated = 0;

        if (jobs) {
          for (let offer of jobs.offers) {
            const province  = await Province.findOne({id: offer.province.id}); 
            const category = await Category.findOne({id: offer.category.id});
            let job = await Job.findOne({id: offer.id});

            const desiredRequirements = `<b>Requisitos deseados</b>\r\n ${offer.desiredRequirements}`;
            const minRequirements = `<b>Requisitos mínimos</b>\r\n ${offer.minRequirements}`;
            //if job exits, then update
            if (job) {
              registersUpdated++;
              console.log('Job Updated', offer.id, offer.updateDate, offer.province);

              job.title = offer.title;
              job.province = province._id || job.province;
              job.link = offer.link || job.link;
              job.category = category._id || job.category;
              job.salaryMin = offer.minPay ? offer.minPay.amount : 0;
              job.salaryMax = offer.maxPay ? offer.maxPay.amount : 0;
              job.salaryDescription = offer.salaryDescription || job.salaryDescription;
              job.published = offer.creationDate;
              job.updated = offer.updateDate;
              job.description = minRequirements + '\r\n\r\n' + desiredRequirements + '\r\n\r\n' + '<b>Descripción</b>\r\n' + offer.description;
              job.companyName = offer.profile.name || job.companyName;
              job.companyLink = offer.profile.web || job.companyLink;
              job.companyLogo = offer.profile.logoUrl || job.companyLogo;
              job.contractType =  offer.contractType.value || job.contractType;

              await job.save();
            
            } else {
              console.log('Job Created', offer.id, offer.updateDate, offer.creationDate);

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
                description: minRequirements + '\r\n\r\n' + desiredRequirements + '\r\n\r\n' + '<b>Descripción</b>\r\n' + offer.description,
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
            lastImport: moment(new Date()).toLocaleString(),
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
