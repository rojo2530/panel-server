const infojobsApi = require('./infojobs');



const {getJobs} = infojobsApi();

(async () => {
  try {
    const result = await getJobs();

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()