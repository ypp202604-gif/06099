const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');
code = code.replace(/status: '已退场'\s*\}/g, "status: '已退场',\n      confidentialitySigned: false\n    }");
fs.writeFileSync('src/data.ts', code);
