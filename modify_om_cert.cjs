const fs = require('fs');

let code = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

const targetSelectOld = `                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">是否运维 (配置节点)</label>
                            <select value={person.isOM} onChange={(e) => handleUpdateField(index, 'isOM', e.target.value)} className={\`w-full border rounded px-2 py-1.5 text-xs font-bold \${person.isOM === '是' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}\`}>
                              <option value="否">常规人员 (否)</option>
                              <option value="是">系统运维人员 (是)</option>
                            </select>
                          </div>`;

const targetSelectNew = `                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">是否运维 (配置节点)</label>
                            <div className="flex gap-2">
                              <label className={\`flex-1 flex items-center justify-center gap-1 border rounded px-2 py-1 text-[11px] font-bold cursor-pointer transition-all \${person.isOM === '是' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}\`}>
                                <input type="radio" value="是" checked={person.isOM === '是'} onChange={(e) => handleUpdateField(index, 'isOM', e.target.value)} className="hidden" />
                                {person.isOM === '是' && <Check size={12} />}
                                是 (运维)
                              </label>
                              <label className={\`flex-1 flex items-center justify-center gap-1 border rounded px-2 py-1 text-[11px] font-bold cursor-pointer transition-all \${person.isOM === '否' ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}\`}>
                                <input type="radio" value="否" checked={person.isOM === '否'} onChange={(e) => handleUpdateField(index, 'isOM', e.target.value)} className="hidden" />
                                {person.isOM === '否' && <Check size={12} />}
                                否 (常规)
                              </label>
                            </div>
                          </div>`;

const targetCertsOld = `                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-500">本合同要求证书</label>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-mono border border-blue-100">CISAW / ISO27001</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="file" className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" />
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">自动适配成功</span>
                          </div>
                        </div>`;

const targetCertsNew = `                        <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
                          <label className="block text-[10px] font-bold text-slate-500">本合同要求证书</label>
                          
                          {/* Cert 1 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono border border-blue-100 font-bold">CISAW 证书</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="file" className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer" />
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">自动适配成功</span>
                            </div>
                          </div>

                          {/* Cert 2 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono border border-blue-100 font-bold">ISO27001 证书</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="file" className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer" />
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">未上传附件</span>
                            </div>
                          </div>
                        </div>`;

code = code.replace(targetSelectOld, targetSelectNew);
code = code.replace(targetCertsOld, targetCertsNew);

fs.writeFileSync('src/components/AddPersonnelModal.tsx', code);
console.log('Replaced cert and OM');
