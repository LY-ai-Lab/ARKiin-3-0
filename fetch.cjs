const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract strings that look like step names or UI elements
    const matches = data.match(/"([^"]{3,50})"/g);
    if (matches) {
      const unique = [...new Set(matches)];
      console.log(unique.filter(x => x.includes('Step') || x.includes('Upload')).slice(0, 50));
    }
  });
});
