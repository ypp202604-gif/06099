const fs = require('fs');

let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

code = code.replace(
  /confidentialitySigned: true,\s*confidentialityDate: p\.confidentialityDate \|\| new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\],/g,
  `confidentialitySigned: false,`
);

fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Fixed AddPersonnelModal confidentiality');
