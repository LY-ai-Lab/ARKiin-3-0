const https = require('https');
https.get('https://arkiin.com/assets/index-DZZmF-ZV.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.substring(0, 500));
  });
});
