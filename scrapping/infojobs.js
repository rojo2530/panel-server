'use strict'

const Job = require('../models/Job')
const moment = require('moment')


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
      const endpoint = 'https://api.infojobs.net/api/7/offer'

      //Select date today in format rfc3339
      const today = new Date()
      today.setHours('00', '00')
      let todayRFC339 = today.toISOString().split('.')[0] + 'Z'

      console.log(todayRFC339)
;
      todayRFC339 = '2020-05-21T22:00:24Z';
      
      console.log('Fecha: ', new Date().toLocaleString());

      try {
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()

        console.log('-------------START------------------------')
        console.log('Trayendo ofertas del día de Infojobs...')

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

          const jobs = JSON.parse(result)

          console.log('Total Ofertas del día: ', jobs.offers.length);

          //Remove jobs justs exits in Mongo with same date updated

          if (!jobs.offers) {
            return []
          }

          const offersFilter = []

          for (let offer of jobs.offers) {
            const job = await Job.findOne({id: offer.id});

            if (job === null || !moment(job.updated).isSame(offer.updated)) {
              offersFilter.push(offer)
            }
          }

          console.log('Total ofertas a importar: ', offersFilter.length)
          console.log('Total ofertas existentes en Mongo: ', jobs.offers.length - offersFilter.length)

          console.log('\n');
          console.log('Trayendo los detalles de las ofertas...');

          let count = 1;

          for (let offer of offersFilter) {
            console.log(count + '.- ' + offer.id + ' ' + offer.title);

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
            count++;
          }

          await browser.close()

          return {
            totalResults: jobs.totalResults,
            currentResults: jobs.currentResults,
            updatedOrNewRegisters: offersFilter.length,
            existRegistersInMongo: jobs.totalResults - offersFilter.length,
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

// const {getJobs} = infojobsApi();

// (async () => {
//   try {
//     const result = await getJobs();

//     process.exit(0)
//   } catch (error) {
//     console.log(error)
//     process.exit(1)
//   }
// })()

module.exports = infojobsApi
