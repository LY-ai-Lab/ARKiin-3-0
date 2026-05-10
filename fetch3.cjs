const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const strings = data.match(/"([^"\\]{10,200})"/g);
    if (strings) {
      console.log([...new Set(strings)].filter(s => s.includes(' ') && !s.includes('{') && !s.includes('function') && !s.includes('class') && !s.includes('.')).slice(0, 50));
    }
  });
});
