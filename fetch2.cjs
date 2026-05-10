const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract text blocks
    const words = data.match(/([A-Z][a-z]+ ){2,}[a-z]+/g);
    if (words) {
      console.log([...new Set(words)].slice(0, 100));
    }
    const htmlStrings = data.match(/(button|div|span|h[1-6]|p)[^>]*>([^<]+)<\/\1>/g);
    if (htmlStrings) {
        console.log(htmlStrings.slice(0, 30));
    }
  });
});
