const fs = require('fs');
const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const uppercaseStrings = data.match(/"[A-Z][a-z]+(\s[A-Z][a-z]+)*"/g) || [];
    const counts = {};
    for (const s of uppercaseStrings) {
        counts[s] = (counts[s] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    console.log(sorted.slice(0, 50));
  });
});
