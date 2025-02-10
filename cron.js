const cron = require('node-cron');
const { config } = require("dotenv");

config({ path: "./.env.local" });

const currentYear = new Date().getFullYear();
const startYear = 2013;

const yearsArray = [];

for (let year = startYear; year <= currentYear; year++) {
  yearsArray.push(year);
}
// Define the cron schedule every minute
// const cronSchedule = '*/1 * * * *';

// Every Sunday
const cronSchedule = '0 0 * * 0';

// Function to hit the specified endpoints
const hitEndpoints = async () => {
  try {
    for (const year of yearsArray) {
      const response1 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/age?year=${year}`);
      const response2 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/disability?year=${year}`);
      const response3 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/gender?year=${year}`);
      const response4 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/school?year=${year}`);
      const response5 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/special?year=${year}`);
      const response6 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/states?year=${year}`);
      const response7 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/statistics?year=${year}`);
      const response8 = await fetch(`${process.env.APP_URL}/api/v1/dashboard/teacher?year=${year}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

console.log("Cron Job online...");
// Schedule the cron job
cron.schedule(cronSchedule, () => {
  console.log('Running cron job...');
  hitEndpoints();
});
