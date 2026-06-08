const fs = require('fs');
let code = fs.readFileSync('src/components/SpecialistConfigModal.tsx', 'utf8');

const regex = /\{\/\* Confidentiality Commitment letter viewing panel \(Read-only\) \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const replacement = `{/* Confidentiality Commitment letter upload panel */}
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50">
            <h5 className="text-[11px] font-bold text-blue-800 mb-3 flex items-center gap-1 border-b border-blue-200/50 pb-1.5 uppercase tracking-wider">
              📁 相关承诺书归档
            </h5>
            <div className="space-y-3">
              {editingPersonnel.map(person => (
                <div key={person.id} className="text-[11.5px] bg-white border border-blue-100 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-3">
                  <div>
                    <span className="font-bold text-slate-800">{person.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">身份证: {person.idCard}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file"
                      onChange={(e) => {
                         if (e.target.files && e.target.files.length > 0) {
                           handleUpdateOMField(person.id, 'confidentialitySigned', true);
                           handleUpdateOMField(person.id, 'confidentialityDate', new Date().toISOString().split('T')[0]);
                         }
                      }}
                      className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                    />
                    {person.confidentialitySigned ? (
                      <span className="shrink-0 font-mono text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        ✓ 已上传
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                        ! 待上传
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>`;

code = code.replace(regex, replacement);

const handleUpdateRegex = /const handleUpdateOMField = \(personnelId: string, field: keyof Personnel, value: string\) => \{/g;
code = code.replace(handleUpdateRegex, "const handleUpdateOMField = (personnelId: string, field: keyof Personnel, value: any) => {");

// remove the validation in top info warn
const warnRegex = /<div className="bg-amber-50\/70 text-\[11px\] text-amber-700 px-6 py-2\.5 border-b border-amber-200 flex items-center gap-2">[\s\S]*?<\/div>/;
const warnReplacement = `<div className="bg-amber-50/70 text-[11px] text-amber-700 px-6 py-2.5 border-b border-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span className="font-medium">请确保收集并上传所有新入职员工的保密承诺书等文件，完成后方可归档。</span>
        </div>`;
code = code.replace(warnRegex, warnReplacement);

// remove the automatic confidentiality banner text in omPersonnel map
const bannerRegex = /<div className="text-\[11px\] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full flex items-center gap-1 font-semibold mt-1 sm:mt-0 shadow-sm">[\s\S]*?<\/div>/;
code = code.replace(bannerRegex, "");

// also make sure the submit button requires all files to be uploaded? Not strictly necessary according to the prompt

fs.writeFileSync('src/components/SpecialistConfigModal.tsx', code);
console.log('Fixed Specialist config modal files and pledges');
