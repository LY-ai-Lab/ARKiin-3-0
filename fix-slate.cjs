const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/border-slate-[0-9]+/g, 'border-[#222222]');
code = code.replace(/from-slate-950/g, 'from-[#0A0A0A]');
code = code.replace(/from-slate-900/g, 'from-[#0F0F0F]');
code = code.replace(/to-slate-950/g, 'to-[#0A0A0A]');
code = code.replace(/text-slate-100/g, 'text-[#E5E5E5]');
code = code.replace(/text-slate-200/g, 'text-[#E5E5E5]');
code = code.replace(/text-slate-800/g, 'text-[#333333]');

fs.writeFileSync('src/App.tsx', code);
