const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// remove lines 124 and 125 extra bracket
app = app.replace(
  `        }
      }
      }
      return req;`,
  `        }
      }
      return req;`
);

fs.writeFileSync('src/App.tsx', app);
