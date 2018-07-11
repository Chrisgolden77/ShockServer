
const request = require('request');
const sp = require('serialport');

const URL = 'https://streamlabs.com/api/donations?access_token=';
const TOKEN = '40EF01F0CC32BC680005';

const UPDATE_TIME = 1000;
let donationsTime = ['0000-00-00 00:00:00'];
let donations = 0;

const serialPort = new sp('/dev/ttyUSB0', () => null);
serialPort.open(() => console.log('Shock therapy open for business.'));

function shockTime() {
  serialPort.write('s', 'ascii', () => console.log('ZZZZZZAPPP BITCH!!!'));
}

function updateDonations() {
  request(`${URL}${TOKEN}`, function (err, res, data) {
    if(err) {
      console.log('error:', err);
      return;
    }
    if(res.statusCode !== 200) {
      console.log('statusCode:', res && res.statusCode);
      return;
    }
    let donations = JSON.parse(data);
    donations = donations.donations.filter(a => a.created_at > donationsTime[donationsTime.length - 1]).map(b => b.created_at);
    console.log('last donatiosn time', donationsTime, '\nnew donations??', donations);
    if(donations.length > 0) {
            console.log('A new donation(s) has been made!');
            donationsTime = donations[donations.length -1];
            console.log('latest donation time', donationsTime);
            shockTime();
    }
  });
  setTimeout(updateDonations, UPDATE_TIME);
}
updateDonations();