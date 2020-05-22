'use strict';

const Job = require('../models/Job');
const moment = require('moment');


const puppeteer = require('puppeteer')

const URL = 'https://developer.infojobs.net/test-console/console.xhtml'
const endpoint = 'https://api.infojobs.net/api/7/offer'

// const api = require('./api');

const infojobsApi = () => {
  return {
    getProvinces: async () => {
      const endpoint =
        'https://api.infojobs.net/api/1/dictionary/province?parent=17'

      try {
        const browser = await puppeteer.launch({headless: true})

        const page = await browser.newPage()

        await page.goto(URL, {waitUntil: 'domcontentloaded'})

        await page.focus('#apiuri')

        await page.keyboard.type(endpoint)

        await page.$eval('#apiexecutionform', (form) => form.submit())
        await page.waitFor(1000)

        const result = await page.evaluate(() => {
          return document.getElementById('responseBody').textContent
        })

        const provinces = JSON.parse(result)

        const provincesResult = provinces.map(
          ({parent, ...province}) => province,
        )

        return provincesResult
      } catch (error) {
        console.log(error)
      }
    },

    getCategories: async () => {
      const endpoint = 'https://api.infojobs.net/api/1/dictionary/category'

      try {
        const browser = await puppeteer.launch({headless: true})

        const page = await browser.newPage()

        await page.goto(URL, {waitUntil: 'domcontentloaded'})

        await page.focus('#apiuri')

        await page.keyboard.type(endpoint)

        await page.$eval('#apiexecutionform', (form) => form.submit())
        await page.waitFor(1000)

        const result = await page.evaluate(() => {
          return document.getElementById('responseBody').textContent
        })

        return JSON.parse(result)
      } catch (error) {
        console.log(error)
      }
    },

    getJobs: async (search = 'teletrabajo', maxResults = 200) => {
      const endpoint = 'https://api.infojobs.net/api/7/offer';

      //Select date today in format rfc3339
      const today = new Date()
      today.setHours('00', '00')
      let todayRFC339 = today.toISOString().split('.')[0] + 'Z';


      console.log(todayRFC339);

      try {
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage();
        
        console.log('Entra en getJobs de InfoAPI (Scrapping)');

        const jobsDetail = []

        await page.goto(URL, {waitUntil: 'domcontentloaded', timeout: 0})

        await page.focus('#apiuri')

        if (search) {
          await page.keyboard.type(
            endpoint +
              '?q=' +
              search +
              '&order=updated-desc&' +
              'publishedMin=' +
              todayRFC339 +
              '&maxResults=' +
              maxResults,
          )

          await page.$eval('#apiexecutionform', (form) => form.submit())
          await page.waitFor(700)

          const result = await page.evaluate(() => {
            const jobsIds = document.getElementById('responseBody')
            return jobsIds.textContent
          })

          const jobs = JSON.parse(result);

          //Remove jobs justs exits in Mongo with same date updated

          if (!jobs.offers) {
            return [];
          }

          const offersFilter = [];
 
          for (let offer of jobs.offers) {
            const job = await Job.findOne({id: offer.id});

            if (job && moment(job.updated).isSame(offer.updated)) {
              console.log('Ya existe la oferta y ya esta actualizada');
                           
            } else {
              console.log('Añadimos');
              offersFilter.push(offer);
            }

          }

          console.log(jobs.offers.length);

          if (!jobs.offers) {
            return [];
          }


          for (let offer of offersFilter) {
            console.log(offer.id, offer.updated);
            
            await page.focus('#apiuri')
            const input = await page.$('#apiuri')
            await input.click({clickCount: 3})
            await page.keyboard.type(endpoint + '/' + offer.id)

            await page.$eval('#apiexecutionform', (form) => form.submit())
            await page.waitFor(700)

            const jobDetail = await page.evaluate(() => {
              const job = document.getElementById('responseBody')
              return job.textContent
            })

            jobsDetail.push(JSON.parse(jobDetail))
          }

          await browser.close()

          return {
            currentPage: jobs.currentPage,
            pageSize: jobs.pageSize,
            totalResults: jobs.totalResults,
            currentResults: jobs.currentResults,
            totalPages: jobs.totalPages,
            updatedOrNewRegisters: offersFilter.length, 
            offers: jobsDetail,
          }
        } else {
          return []
        }
      } catch (error) {
        console.log(error)
      }
    },
  }
}

const {getJobs} = infojobsApi()

;(async () => {
  const jobs = await getJobs('100% remoto', 3)
  console.log(jobs)
})()

module.exports = infojobsApi

// const { createJob } = api();

// async function getJobsRecent(search = null, maxResults = 10) {
//   try {
//     const browser = await puppeteer.launch({headless: true})
//     const page = await browser.newPage()

//     const jobsExtensions = [];

//     await page.goto(URL, {waitUntil: 'domcontentloaded'})

//     await page.focus('#apiuri')

//     if (search) {
//       await page.keyboard.type(
//         endpoint +
//           '?q=' +
//           search +
//           '&order=updated-desc&' +
//           'maxResults=' +
//           maxResults,
//       )
//     } else {
//       await page.keyboard.type(
//         endpoint + '?order=updated-desc&' + 'maxResults=' + maxResults,
//       )
//     }

//     await page.$eval('#apiexecutionform', (form) => form.submit())
//     await page.waitFor(1000)

//     const result = await page.evaluate(() => {
//       const jobsIds = document.getElementById('responseBody')
//       return jobsIds.textContent
//     })

//     // await browser.close();
//     // return JSON.parse(result)

//     const jobs = JSON.parse(result)
//     const id = jobs.offers[0].id;
//     console.log(jobs.offers.length);
//   //  jobs.offers.forEach(async offer => {
//     for (let offer of jobs.offers) {
//       await page.focus('#apiuri');
//       const input = await page.$('#apiuri');
//       await input.click({clickCount: 3});
//       await page.keyboard.type(endpoint + '/' + offer.id);

//       await page.$eval('#apiexecutionform', (form) => form.submit());
//       await page.waitFor(1000);

//       const jobExtension = await page.evaluate(() => {
//         const job = document.getElementById('responseBody')
//         return job.textContent
//       });

//       jobsExtensions.push(JSON.parse(jobExtension));
//    // })
//     }
//     await browser.close()

//     return jobsExtensions;
//   } catch (err) {
//     console.log(err)
//   }
// }

// (async () => {
//   const jobs = await getJobsRecent('react teletrabajo', 1)
//   console.log('Pasando Job a Wordpress', jobs);

//   const job = {
//   title: jobs[0].title,
//   content: jobs[0].description,
//   meta: {
//     _job_location: jobs[0].province.value,
//     _application: jobs[0].link,
//     _company_name: jobs[0].profile.name,
//     _company_website: jobs[0].profile.web,
//   },
//   "job-categories": [30],
//   "job-types": [6],
// }

//   const result = await createJob(job);
//   console.log(result);
// })()

// module.exports = getJobsRecent
