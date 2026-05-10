const https = require('https');
https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
     let strings = data.match(/\"([A-Za-z0-9\s.,'?!-]{20,})\"/g);
     if(strings) {
         console.log(strings.slice(0, 100));
     }
  });
});
