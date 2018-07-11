const http = require('https');
const UPDATE_TIME = 1000;
let donationsTime = ['0000-00-00 00:00:00'];

function updateDonations() {
  http.get(`https://streamlabs.com/api/donations?access_token=40EF01F0CC32BC680005&limit=10`, (res) => {
    res.on('data', (chunk) => {
      chunk = JSON.parse(chunk);
      chunk = chunk.donations.filter(a => a.created_at > donationsTime[donationsTime.length - 1]).map(a => a.created_at);
      if(chunk.length > 0) {
        donationsTime = chunk;
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
  setTimeout(updateDonations, UPDATE_TIME);
}
updateDonations();