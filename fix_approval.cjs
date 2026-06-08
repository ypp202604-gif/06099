const fs = require('fs');

let code = fs.readFileSync('src/components/ApprovalTab.tsx', 'utf8');

const oldOM = /\{p\.isOM === '是' && \([\s\S]*?<\/>\s*\)\}/g;
const newOM = `{p.isOM === '是' && req.status === '已归档' && (
  <>
    <div className="col-span-3 border-t border-slate-200/50 my-1 pt-2"></div>
    <div className="col-span-2 md:col-span-1"><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">终端地址 (IP)</span> <span className="font-mono text-purple-700 font-bold">{p.terminalAddress || '—'}</span></div>
    <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">考勤打卡地点</span> <span className="text-purple-700">{p.attendanceLocation || '—'}</span></div>
    <div><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">物理工位号</span> <span className="text-purple-700">{p.station || '—'}</span></div>
    <div className="col-span-3"><span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">其他说明</span> <span className="text-slate-600">{p.otherInfo || '无'}</span></div>
  </>
)}`;

code = code.replace(oldOM, newOM);

const oldConfidentiality = /\{p\.confidentialitySigned && \([\s\S]*?✓ 保密书签署[\s\S]*?<\/span>\s*\)\}/g;
const newConfidentiality = `{p.confidentialitySigned && req.status === '已归档' && (
  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
    ✓ 保密书签署
  </span>
)}`;

code = code.replace(oldConfidentiality, newConfidentiality);

fs.writeFileSync('src/components/ApprovalTab.tsx', code);
console.log('Fixed ApprovalTab visibility fields.');
