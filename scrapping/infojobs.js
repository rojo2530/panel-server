'use strict'

const puppeteer = require('puppeteer')

const URL = 'https://developer.infojobs.net/test-console/console.xhtml'
const endpoint = 'https://api.infojobs.net/api/7/offer'

// const api = require('./api');

const infojobsApi = () => {
  return {
    getProvinces: async () => {
      const endpoint = 'https://api.infojobs.net/api/1/dictionary/province?parent=17'

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
    },

    getCategories:  async () => {
      const endpoint = 'https://api.infojobs.net/api/1/dictionary/category'

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
    },
  }
}

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
