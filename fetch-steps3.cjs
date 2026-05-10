const https = require('https');
https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Find where the word "Design Alternatives" appears 
    const ix = data.indexOf('"Design Alternatives"');
    if (ix !== -1) {
        console.log(data.substring(ix - 1000, ix + 1000));
    }
  });
});
