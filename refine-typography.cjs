const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the typo "drop-"
code = code.replace(/drop-/g, '');

// Typography refinement
code = code.replace(/font-black/g, 'font-bold');
code = code.replace(/text-8xl/g, 'text-5xl tracking-tight');
code = code.replace(/text-7xl/g, 'text-4xl tracking-tight');
code = code.replace(/text-6xl/g, 'text-3xl tracking-tight');
code = code.replace(/text-5xl/g, 'text-2xl tracking-tight');
code = code.replace(/text-4xl/g, 'text-2xl');
code = code.replace(/text-\[12rem\]/g, 'text-7xl tracking-widest text-[#E5E5E5]');

// Make the app main padding match the design (e.g., pt-14)
code = code.replace(/pt-20/g, 'pt-14');
code = code.replace(/h-20/g, 'h-14'); // For nav bars if any are left
code = code.replace(/min-h-\[calc\(100vh-80px\)\]/g, 'min-h-[calc(100vh-56px)]');

fs.writeFileSync('src/App.tsx', code);
