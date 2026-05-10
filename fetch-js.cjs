const https = require('https');
https.get('https://arkiin.com/assets/index-BuMf186o.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // looking for text-xxxx-[number] or bg-xxxx-[number] or text-black/bg-black
    const tailwindMatches = data.match(/(?:bg|text|text|border|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+|bg-black|bg-white|text-black|text-white/g) || [];
    const counts = {};
    for (let c of tailwindMatches) counts[c] = (counts[c]||0)+1;
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    console.log("Tailwind Classes:", sorted.slice(0, 30));
  });
});
