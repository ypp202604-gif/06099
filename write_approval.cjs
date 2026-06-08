const fs = require('fs');

let code = fs.readFileSync('src/components/ApprovalTab.tsx', 'utf8');

// I will find the addedPersonnel grid rendering and also replace the removedPersonnel rendering to match it.
// Plus I'll add the extra OM fields to it.

// Let's modify the detail rendering block.
const addedFieldsOld = `                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">工作时间</span> {p.joinWorkDate || '未知'}</div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">安规入库</span> <span className="text-emerald-600 font-medium">考试合格</span></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">业务准入</span> <span className="text-emerald-600 font-medium">线上通过</span></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">证书校验</span> <span className="text-blue-600 font-medium">匹配</span></div>
                        </div>`;

const addedFieldsNew = `                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">工作时间</span> {p.joinWorkDate || '未知'}</div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">安规入库</span> <span className="text-emerald-600 font-medium">考试合格</span></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">业务准入</span> <span className="text-emerald-600 font-medium">线上通过</span></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">证书校验</span> <span className="text-blue-600 font-medium">匹配</span></div>
                          {p.isOM === '是' && (
                            <>
                              <div className="col-span-3 border-t border-slate-200/50 my-1 pt-2"></div>
                              <div className="col-span-2 md:col-span-1"><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">终端地址 (IP)</span> <span className="font-mono text-purple-700 font-bold">{p.terminalAddress || '—'}</span></div>
                              <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">考勤打卡地点</span> <span className="text-purple-700">{p.attendanceLocation || '—'}</span></div>
                              <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">物理工位号</span> <span className="text-purple-700">{p.station || '—'}</span></div>
                              <div className="col-span-3"><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">其他说明</span> <span className="text-slate-600">{p.otherInfo || '无'}</span></div>
                            </>
                          )}
                        </div>`;
code = code.replace(addedFieldsOld, addedFieldsNew);

const removedBlockOld = `                    {selectedRequest.removedPersonnel.map((p) => (
                      <div key={p.id} className="border border-amber-200 rounded-lg p-2.5 bg-amber-50 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-[11px] text-slate-500 ml-2">({p.personnelType})</span>
                          <div className="text-[10px] text-slate-500 mt-0.5">手机号码: {p.phone} | 身份证: {p.idCard}</div>
                        </div>
                        <span className="text-[10px] bg-white text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                          拟退场注销
                        </span>
                      </div>
                    ))}`;

const removedBlockNew = `                    {selectedRequest.removedPersonnel.map((p) => (
                      <div key={p.id} className="border border-amber-200 rounded-lg p-3 bg-amber-50/50 space-y-2 hover:border-amber-400 shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                            <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {p.personnelType}
                            </span>
                            <span className={\`text-[10px] px-1.5 py-0.5 rounded border font-bold \${
                              p.isOM === '是' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }\`}>
                              {p.isOM === '是' ? '系统运维人员' : '常规/分包人员'}
                            </span>
                          </div>
                          
                          <span className="text-[10px] bg-white text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                            拟退场注销
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-slate-600 text-[11px] bg-white border border-amber-100 p-2 rounded">
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">单位</span> <span className="truncate block" title={p.companyName}>{p.companyName}</span></div>
                          <div className="col-span-2 md:col-span-1"><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">身份证</span> <span className="font-mono">{p.idCard}</span></div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">联系电话</span> {p.phone}</div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">学历/职称</span> {p.education} / {p.title || '无'}</div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">技能等级</span> {p.skillLevel || '无'}</div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">核心工种</span> {p.coreTrade || '无'}</div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">工作时间</span> {p.joinWorkDate || '未知'}</div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">安规入库</span> <span className="text-emerald-600 font-medium">曾合格</span></div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">业务准入</span> <span className="text-emerald-600 font-medium">曾通过</span></div>
                          <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">证书校验</span> <span className="text-blue-600 font-medium">适配</span></div>
                          {p.isOM === '是' && (
                            <>
                              <div className="col-span-3 border-t border-amber-100 my-1 pt-2"></div>
                              <div className="col-span-2 md:col-span-1"><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">终端地址 (IP)</span> <span className="font-mono text-slate-800">{p.terminalAddress || '—'}</span></div>
                              <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">考勤打卡地点</span> <span className="text-slate-800">{p.attendanceLocation || '—'}</span></div>
                              <div><span className="text-amber-700/60 block text-[9px] uppercase tracking-wider font-bold mb-0.5">物理工位号</span> <span className="text-slate-800">{p.station || '—'}</span></div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}`;
code = code.replace(removedBlockOld, removedBlockNew);

fs.writeFileSync('src/components/ApprovalTab.tsx', code);
console.log("ApprovalTab.tsx rewritten");
