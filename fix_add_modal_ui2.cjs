const fs = require('fs');

let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

// The replacement script missed appending some border classes properly or the inputs.
code = code.replace(/py-2 text-xs focus:ring-2 border-slate-300 focus:border-blue-500/g, 'py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none');

// Let's improve the card design overall:
code = code.replace(/bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row/g,
  'bg-white border border-slate-200 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row transition-all hover:border-blue-300/50');

code = code.replace(/w-8 bg-slate-100 border-r border-slate-200 flex flex-col items-center py-4 text-slate-400 font-bold shrink-0/g,
  'w-8 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 text-slate-400 font-bold shrink-0');

code = code.replace(/flex-1 p-5 grid grid-cols-1 md:grid-cols-12 gap-5/g,
  'flex-1 p-5 grid grid-cols-1 lg:grid-cols-12 gap-6');

code = code.replace(/md:col-span-4/g, 'lg:col-span-4');
code = code.replace(/md:col-span-5/g, 'lg:col-span-5');
code = code.replace(/md:col-span-3/g, 'lg:col-span-3');
code = code.replace(/md:border-b-0/g, 'lg:border-b-0');
code = code.replace(/md:border-r/g, 'lg:border-r');
code = code.replace(/md:pb-0/g, 'lg:pb-0');
code = code.replace(/md:pr-4/g, 'lg:pr-5');

fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Fixed CSS');
