
const http = require('https');
const sp = require('serialport');

const UPDATE_TIME = 1000;
let donationsTime = ['0000-00-00 00:00:00'];

const serialPort = new sp('/dev/ttyUSB0', {
  baudRate : 9600
}, (err) => console.log('an error occurred', err));
serialPort.open(() => console.log('Shock therapy open for business.'));

function shockTime() {
  serialPort.write('s', 'ascii', () => console.log('ZZZZZZAPPP BITCH!!!'));
}

function updateDonations() {
  http.get(`https://streamlabs.com/api/donations?access_token=40EF01F0CC32BC680005&limit=10`, (res) => {
    res.on('data', (chunk) => {
      chunk = JSON.parse(chunk);
      chunk = chunk.donations.filter(a => a.created_at > donationsTime[donationsTime.length - 1]).map(a => a.created_at);
      if(chunk.length > 0) {
        console.log('A new donation(s) has been made!');
        donationsTime = chunk;
        shockTime();
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
  setTimeout(updateDonations, UPDATE_TIME);
}
updateDonations();