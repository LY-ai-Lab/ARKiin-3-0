const https = require('https');

https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Try to find the step definitions. Usually an array with names.
    const chunks = data.split('[');
    for (let c of chunks) {
        if (c.includes('Upload') && c.includes('Context') && c.includes('Lighting')) {
            console.log(c.substring(0, 300));
        }
    }
  });
});
