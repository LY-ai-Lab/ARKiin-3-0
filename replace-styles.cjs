const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
code = code.replace(/bg-slate-950/g, 'bg-[#0A0A0A]');
code = code.replace(/bg-slate-900/g, 'bg-[#0F0F0F]');
code = code.replace(/bg-slate-800/g, 'bg-[#1A1A1A]');
code = code.replace(/bg-slate-700/g, 'bg-[#222222]');
// code = code.replace(/bg-slate-[0-9]+(?:\/\d+)?/g, 'bg-[#121212]');
code = code.replace(/border-slate-900/g, 'border-[#1A1A1A]');
code = code.replace(/border-slate-800/g, 'border-[#222222]');
// code = code.replace(/border-slate-[0-9]+(?:\/\d+)?/g, 'border-[#222222]');
code = code.replace(/text-slate-400/g, 'text-[#888888]');
code = code.replace(/text-slate-500/g, 'text-[#666666]');
code = code.replace(/text-slate-600/g, 'text-[#555555]');
code = code.replace(/text-slate-700/g, 'text-[#444444]');
// code = code.replace(/text-slate-[0-9]+/g, 'text-[#E5E5E5]');
code = code.replace(/text-slate-950/g, 'text-[#000000]');

// Add specific edge cases
code = code.replace(/text-white/g, 'text-[#E5E5E5]');
code = code.replace(/border-white(\/\d+)?/g, 'border-[#222222]');

// Rounding constraints to match Elegant Dark
code = code.replace(/rounded-\[.*?\]/g, 'rounded-md');
code = code.replace(/rounded-3xl/g, 'rounded-md');
code = code.replace(/rounded-2xl/g, 'rounded-sm');
code = code.replace(/rounded-xl/g, 'rounded');
code = code.replace(/rounded-full/g, 'rounded-full'); // Except for circles which usually stay rounded-full

// Removing oversized shadows & blurs to match the flat UI
code = code.replace(/shadow-\[.*?\]/g, '');
code = code.replace(/shadow-2xl/g, '');
code = code.replace(/shadow-xl/g, '');
code = code.replace(/shadow-lg/g, '');
code = code.replace(/drop-shadow-2xl/g, '');
code = code.replace(/drop-shadow-\[.*?\]/g, '');
code = code.replace(/blur-\[.*?\]/g, 'blur-xl');

// Accent usage adjustments for aesthetic elegance
code = code.replace(/bg-ark-accent/g, 'bg-[#8B5CF6]');
code = code.replace(/text-ark-accent/g, 'text-[#8B5CF6]');
code = code.replace(/border-ark-accent/g, 'border-[#8B5CF6]');

fs.writeFileSync('src/App.tsx', code);
console.log('Styles replaced successfully');
