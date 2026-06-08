const fs = require('fs');
let code = fs.readFileSync('src/components/SpecialistConfigModal.tsx', 'utf8');

// I will just replace the exact broken part.
// The broken part:
// 297:           </div>
// 298:         </div>
// 299:               ))}
// 300:             </div>
// 301:           </div>
// 302: 
// 303:         </div>

const broken = `          </div>
        </div>
              ))}
            </div>
          </div>

        </div>`;

if (code.includes(broken)) {
    code = code.replace(broken, `          </div>
        </div>`);
    fs.writeFileSync('src/components/SpecialistConfigModal.tsx', code);
    console.log("Fixed JSX");
} else {
    // If exact spacing is not matching, let's use regex
    const brokenRegex = /<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>/;
    code = code.replace(brokenRegex, "</div>\n        </div>");
    fs.writeFileSync('src/components/SpecialistConfigModal.tsx', code);
    console.log("Fixed JSX using regex");
}
