const https = require('https');
https.get('https://arkiin.com/assets/index-DZZmF-ZV.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const colors = data.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
    const counts = {};
    for (let c of colors) c = c.toLowerCase(), counts[c] = (counts[c]||0)+1;
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    console.log("Colors:", sorted.slice(0,20));
  });
});
