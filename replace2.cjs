const fs = require('fs');
const content = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

// 1. Change max-w-4xl to max-w-6xl
let newContent = content.replace('max-w-4xl', 'max-w-6xl');

// 2. Wrap selected contract and headcount in a grid row
const contractSectionOld = `          {/* Section 1: Choose Contract (Mandatory first action) */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
              <span className="text-red-500 font-bold">*</span> 关联及变更的目标合同
            </label>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              required
            >
              <option value="" disabled>-- 请选择目标合同 --</option>
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.year}年/{c.type}] {c.name} (乙方: {c.partyB})
                </option>
              ))}
            </select>
            
            {selectedContractId && (
              <div className="mt-3 text-xs bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">当前该合同在岗人数</span>
                <span className="font-bold text-slate-800 text-sm">{(activePersonnel[selectedContractId] || []).length} 人</span>
              </div>
            )}
          </div>`;

const contractSectionNew = `          {/* Section 1: Choose Contract (Mandatory first action) */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-9">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                <span className="text-red-500 font-bold">*</span> 关联及变更的目标合同
              </label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                required
              >
                <option value="" disabled>-- 请选择目标合同 --</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.year}年/{c.type}] {c.name} (乙方: {c.partyB})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              {selectedContractId ? (
                <div className="text-xs bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between h-[38px]">
                  <span className="text-slate-500 font-medium">在岗人数</span>
                  <span className="font-bold text-slate-800 text-sm">{(activePersonnel[selectedContractId] || []).length} 人</span>
                </div>
              ) : (
                <div className="text-xs bg-blue-50/50 p-2 rounded-lg border border-transparent flex items-center justify-between h-[38px]">
                  <span className="text-blue-400 font-medium">在岗人数</span>
                  <span className="font-bold text-blue-400 text-sm">- 人</span>
                </div>
              )}
            </div>
          </div>`;

newContent = newContent.replace(contractSectionOld, contractSectionNew);

// 3. Remove info strings:
// <p className="text-[10px] text-slate-500 mt-0.5">一个人数据同区域维护，自动同步业务、安规及证书结果。</p>
newContent = newContent.replace(
  '<p className="text-[10px] text-slate-500 mt-0.5">一个人数据同区域维护，自动同步业务、安规及证书结果。</p>',
  ''
);

// We should also replace the right side of the card
const oldSyncResults = `                        <div className="pt-3 mt-3 border-t border-slate-100">
                          {person.confidentialitySigned ? (
                            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded p-2 flex flex-col items-center">
                              <span className="font-bold text-[11px] flex items-center gap-1"><Check size={12} /> 保密承诺书已签署</span>
                              <span className="text-[9px] mt-0.5 opacity-80">{person.confidentialityDate}</span>
                            </div>
                          ) : (
                            <button type="button" onClick={() => openSigningModal(index)} className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 font-bold hover:text-amber-800 rounded transition-all text-[11px]">
                              点击签署保密协议
                            </button>
                          )}
                        </div>`;

const newSyncResults = `                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1" title="本合同要求证书: CISAW / ISO27001">要求证书上传 (建议 PDF/JPG)</label>
                          <input type="file" className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                        </div>`;

newContent = newContent.replace(oldSyncResults, newSyncResults);

fs.writeFileSync('src/components/AddPersonnelModal.tsx', newContent);
console.log('replaced successfully');
