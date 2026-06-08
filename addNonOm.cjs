const fs = require('fs');
const content = fs.readFileSync('src/components/SpecialistConfigModal.tsx', 'utf8');

const nonOmPersonnelCards = `
          {editingPersonnel.filter(p => p.isOM !== '是').length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <NotebookTabs size={14} className="text-blue-600" />
                <span>常规人员信息 (只读视图 - {editingPersonnel.filter(p => p.isOM !== '是').length} 人)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editingPersonnel.filter(p => p.isOM !== '是').map(p => (
                  <div key={p.id} className="border border-blue-100 bg-blue-50/30 p-3 rounded-lg flex flex-col gap-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1 text-[13px]">{p.name} <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded">常规</span></span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate" title={p.companyName}>{p.companyName}</div>
                    <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                      <span>核心工种: {p.coreTrade || '无'}</span>
                      <span>|</span>
                      <span>安规: <span className="text-emerald-600">已达标</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
`;

const originalEmptyCheck = `          {omPersonnel.length === 0 ? (
            <div className="text-center py-12 border border-slate-200 rounded-xl bg-slate-50 text-xs">
              <p className="text-slate-400">本次进场人员中无 “是否运维=是” 人员。</p>
              <p className="text-slate-500 font-bold mt-2">点击下方 “确认完成并一键归档” 直接加入常规人员台账。</p>
            </div>
          ) : (`;

let newContent = content.replace(originalEmptyCheck, nonOmPersonnelCards + '\n' + originalEmptyCheck);

// change the button text
newContent = newContent.replace('确认完成维护并一键归档', '归档');

fs.writeFileSync('src/components/SpecialistConfigModal.tsx', newContent);
