const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    let index = data.indexOf("ARK");
    while(index !== -1 && index < 100000) {
      console.log(data.substring(index - 20, index + 100));
      index = data.indexOf("ARK", index + 1);
    }
  });
});
