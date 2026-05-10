const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove duplicates in class names using a tiny regex replacer (primitive but functional for identical words)
code = code.replace(/className="([^"]+)"/g, (match, classes) => {
    const arr = classes.split(/\s+/);
    const unique = [...new Set(arr)].join(' ');
    // handle edge cases where tracking-tight and tracking-tighter are both present, keep tighter
    let finalClasses = unique;
    if (finalClasses.includes('tracking-tight') && finalClasses.includes('tracking-tighter')) {
        finalClasses = finalClasses.replace('tracking-tight ', '').replace(' tracking-tight', '');
    }
    // handle text-[#E5E5E5] multiple times? set takes care of exact match
    return `className="${finalClasses}"`;
});

fs.writeFileSync('src/App.tsx', code);
