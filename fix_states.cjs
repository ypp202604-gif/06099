const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// replace the state name
app = app.replace(/'待专责配置'/g, "'待专责归档'");

// use regex to replace the complex block
app = app.replace(
  /\/\/ Check if there are O&M personnel in this request[\s\S]*?specialistConfigCompleted: true\s*\}\s*;\s*\}\s*\}/,
  `// Always go to specialist configuration
          return {
            ...req,
            status: '待专责归档',
            approverOpinion: opinion,
            approverName,
            approvalDate: new Date().toISOString().split('T')[0]
          };
        }
      }`
);

fs.writeFileSync('src/App.tsx', app);

let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(/'待专责配置'/g, "'待专责归档'");
fs.writeFileSync('src/types.ts', types);

let data = fs.readFileSync('src/data.ts', 'utf8');
data = data.replace(/'待专责配置'/g, "'待专责归档'");
fs.writeFileSync('src/data.ts', data);

let tab = fs.readFileSync('src/components/ApprovalTab.tsx', 'utf8');
tab = tab.replace(/'待专责配置'/g, "'待专责归档'");
fs.writeFileSync('src/components/ApprovalTab.tsx', tab);
console.log('Fixed app logic');
