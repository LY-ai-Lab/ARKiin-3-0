const https = require('https');
https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Find where the word "Design Alternatives" appears 
    const ix = data.indexOf('bg-card border-b border-border');
    if (ix !== -1) {
        console.log(data.substring(ix - 500, ix + 2000));
    }
  });
});
