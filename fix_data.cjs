const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');
code = code.replace(/status: '离开'/g, "status: '已退场'");
fs.writeFileSync('src/data.ts', code);
