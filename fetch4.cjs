const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Show some readable contextual strings from the actual App.tsx part
    // Usually custom components have specific strings we can spot
    const matches = data.match(/[^"A-Z]([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9A-Z]+)*)[^"]/g);
    // Let's just find anything resembling the string "Discovery" or "Space"
    console.log(data.substring(data.indexOf("Discovery") - 50, data.indexOf("Discovery") + 200));
  });
});
