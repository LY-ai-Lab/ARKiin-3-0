const https = require('https');
https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract HTML strings
    const el = data.match(/<[a-z]{1,10}[^>]*>([^<]+)<\/[a-z]{1,10}>/gi);
    if(el) {
        let texts = el.map(e => e.replace(/<\/?[^>]+(>|$)/g, "")).filter(x => x.trim().length > 3);
        console.log("Texts:", [...new Set(texts)].slice(0, 100));
    }
  });
});
