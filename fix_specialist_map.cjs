const fs = require('fs');

let code = fs.readFileSync('src/components/SpecialistConfigModal.tsx', 'utf8');

// Change omPersonnel to all editing personnel for this screen
code = code.replace(
  /const omPersonnel = editingPersonnel\.filter\(p => p\.isOM === '是'\);/g,
  `const omPersonnel = editingPersonnel;`
);

// Remove the conditional block when there are 0 omPersonnel, since we'll map over all editingPersonnel
code = code.replace(
  /\{omPersonnel\.length === 0 \? \([\s\S]*?\) : \(/,
  `{omPersonnel.length === 0 ? null : (`
);

// Ensure the closing parenthesis is stripped?
// Actually it's easier to just do it via exact replacement.
