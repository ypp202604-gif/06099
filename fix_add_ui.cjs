const fs = require('fs');

let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

// replace label blocks
code = code.replace(/text-\[10px\] font-bold text-slate-500 mb-1/g, 'text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide');
code = code.replace(/text-\[10px\] font-bold text-slate-500/g, 'text-[11px] font-bold text-slate-500 uppercase tracking-wide');
code = code.replace(/py-1\.5 text-[^\s]+ focus:ring-1/g, 'py-2 text-xs focus:ring-2 border-slate-300 focus:border-blue-500');

// space-y-3 to space-y-4
code = code.replace(/space-y-3/g, 'space-y-4');

// padding on the main card body
code = code.replace(/flex-1 p-4 grid/g, 'flex-1 p-5 grid');

fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Fixed Add UI');
