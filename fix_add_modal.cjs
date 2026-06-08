const fs = require('fs');
let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

// 1. Remove headcount block
const headcountRegex = /\{selectedContractId && \(\s*<div className="mt-3 text-xs bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between">\s*<span className="text-slate-500 font-medium">当前该合同在岗人数<\/span>\s*<span className="font-bold text-slate-800 text-sm">\{\(activePersonnel\[selectedContractId\] \|\| \[\]\).length\} 人<\/span>\s*<\/div>\s*\)\}/g;
code = code.replace(headcountRegex, '');

// 2. Remove text explanation after added personnel
const explanationRegex = /<p className="text-\[10px\] text-slate-500 mt-0\.5">一个人数据同区域维护，自动同步业务、安规及证书结果。<\/p>/g;
code = code.replace(explanationRegex, '');

// 3. Replace confidentiality section with certificate upload
const confidentialityRegex = /<div className="pt-3 mt-3 border-t border-slate-100">\s*\{person.confidentialitySigned \? \([\s\S]*?\) : \([\s\S]*?\}\s*<\/div>/g;

const certUploadHtml = `<div className="pt-2 mt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-500">本合同要求证书</label>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-mono border border-blue-100">CISAW / ISO27001</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="file" className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" />
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">自动适配成功</span>
                          </div>
                        </div>`;

code = code.replace(confidentialityRegex, certUploadHtml);

fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Fixed AddPersonnelModal.tsx');
