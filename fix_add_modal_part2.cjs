const fs = require('fs');

let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

// 1. Remove validation
const valRegex = /if \(\!person\.confidentialitySigned\) \{\s*alert\(`.*?保密承诺书签署！`\);\s*return;\s*\}/g;
code = code.replace(valRegex, '');

// 2. Remove the signing popup
// The popup starts with {/* Embedded Confidentiality... and ends with )}.
// Let's use a simpler way. Just replace everything from the comment to the end of the file except the last few divs. Wait, it's safer to just do string matching.
const lines = code.split('\n');
let newLines = [];
let insidePopup = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Embedded Confidentiality Commitment Agreement Signing Popup')) {
    insidePopup = true;
  }
  
  if (!insidePopup) {
    if (lines[i].includes('onSubmit(newRequest);')) {
      newLines.push(lines[i]);
      newLines.push('    onClose();');
    } else {
      newLines.push(lines[i]);
    }
  }

  if (insidePopup && lines[i].trim() === ')}' && lines[i-1] && lines[i-1].includes('</div>')) {
    // try to just skip the popup logic in a smarter way
  }
}
// Actually, using regex with [\s\S]*? is fine if we match exact end.
const popupRegexContent = /\{\/\* Embedded Confidentiality Commitment Agreement Signing Popup \([\s\S]*?\}\s*<\/div>\s*\)\}/g;
code = code.replace(popupRegexContent, '');
code = code.replace(/onSubmit\(newRequest\);/, 'onSubmit(newRequest);\n    onClose();');
fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Fixed Add modal part 2.');
