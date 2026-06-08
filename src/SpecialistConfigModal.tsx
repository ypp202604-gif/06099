import React, { useState, useEffect } from 'react';
import { 
  X,
  Cpu, 
  MapPin, 
  FileCheck, 
  Tv, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  NotebookTabs
} from 'lucide-react';
import { ChangeRequest, Personnel } from './types';

interface SpecialistConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ChangeRequest | null;
  onSaveConfig: (requestId: string, updatedPersonnel: Personnel[], filingDate?: string, filingMaterials?: string) => void;
}

export default function SpecialistConfigModal({ 
  isOpen, 
  onClose, 
  request, 
  onSaveConfig 
}: SpecialistConfigModalProps) {
  
  // Local state for editing personnel fields
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel[]>([]);
  const [filingDate, setFilingDate] = useState(new Date().toISOString().split('T')[0]);
  const [filingMaterials, setFilingMaterials] = useState('');

  useEffect(() => {
    if (isOpen && request) {
      // Initialize with copies from request's addedPersonnel
      setEditingPersonnel(JSON.parse(JSON.stringify(request.addedPersonnel)));
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  // Filter only those candidates where isOM === '是' (Only O&M personnel get these configured)
  const omPersonnel = editingPersonnel;

  const handleUpdateOMField = (personnelId: string, field: keyof Personnel, value: any) => {
    setEditingPersonnel(prev => prev.map(p => {
      if (p.id === personnelId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleSave = () => {
    // Validate that O&M personnel have at least some basic workstation fields
    for (const p of omPersonnel) {
      if (p.isOM === '是') {
        if (!p.terminalAddress?.trim()) {
          alert(`请为【${p.name}】配置合规的内网运维终端IP地址！`);
          return;
        }
      }
      if (!p.attendanceLocation?.trim()) {
        alert(`请为【${p.name}】选择和维护考勤位置！`);
        return;
      }
      if (!p.station?.trim()) {
        alert(`请分配【${p.name}】的物理工位编号！`);
        return;
      }
      if (!p.confidentialitySigned) {
        alert(`请上传【${p.name}】的保密承诺书归档件！`);
        return;
      }
    }

    onSaveConfig(request.id, editingPersonnel, filingDate, filingMaterials);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between rounded-t-xl">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-600 rounded-sm inline-block"></span>
              信通专责 - 批签进场设备及考勤参数分配 (申请单号: {request.id})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              由专门专责维护安规核验后的 <strong>“是否运维=是”</strong> 人员信息。分配专用隔离终端IP、工位卡及安全打卡地。
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full text-xs font-bold transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Warn */}
        <div className="bg-amber-50/70 text-[11px] text-amber-700 px-6 py-2.5 border-b border-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span className="font-medium">请确保收集并上传所有新入职员工的保密承诺书等文件，完成后方可归档。</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3 shadow-sm">
            <div>
              <span className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">归属合同:</span>
              <p className="font-semibold text-blue-600 mt-0.5">{request.contractName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-slate-500 pt-1 border-t border-slate-200">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">补充备案日期 (实际进场日期)</label>
                <input 
                  type="date"
                  value={filingDate}
                  onChange={e => setFilingDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>


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
                    <div className="flex gap-2 text-[10px] text-slate-500 mt-1 flex-wrap">
                      <span>核心工种: {p.coreTrade || '无'}</span>
                      <span>|</span>
                      <span>工作时间: {p.joinWorkDate || '未知'}</span>
                      <span>|</span>
                      <span>安规: <span className="text-emerald-600">已达标</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {omPersonnel.length === 0 ? null : (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pt-1 uppercase tracking-wider">
                <NotebookTabs size={14} className="text-purple-600" />
                <span>待配置维护的人员 ({omPersonnel.length} 人)</span>
              </h4>

              {omPersonnel.map((p, index) => (
                <div key={p.id} className="border border-purple-200 rounded-xl bg-purple-50/30 p-4 shadow-sm hover:border-purple-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-purple-200/60 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-[11px] border border-purple-200">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                          <span className="text-[11px] text-slate-500">({p.companyName})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                          <span>学历/职称: {p.education}/{p.title || '无'}</span>
                          <span className="text-slate-300">|</span>
                          <span>技能级: {p.skillLevel || '无'}</span>
                          <span className="text-slate-300">|</span>
                          <span>核心工种: {p.coreTrade || '无'}</span>
                          <span className="text-slate-300">|</span>
                          <span>工作时间: <span className="font-medium text-slate-700">{p.joinWorkDate || '未知'}</span></span>
                        </div>
                      </div>
                    </div>

                    
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Terminal IP Address */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                        <Tv size={12} className="text-purple-600" />
                        <span>* 运维授权专用内网终端地址 (IP)</span>
                      </label>
                      <input
                        type="text"
                        value={p.terminalAddress || ''}
                        onChange={(e) => handleUpdateOMField(p.id, 'terminalAddress', e.target.value)}
                        placeholder="例如: 10.135.24.116"
                        className="w-full text-xs border border-slate-300 rounded-lg bg-white px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
                        required
                      />
                    </div>

                    {/* Attendance Location */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                        <MapPin size={12} className="text-purple-600" />
                        <span>* 福建信通考勤打卡指定地点</span>
                      </label>
                      <select
                        value={p.attendanceLocation || ''}
                        onChange={(e) => handleUpdateOMField(p.id, 'attendanceLocation', e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="">-- 请选择打卡写考勤地址 --</option>
                        <option value="福州国网信通科技楼A栋">福州国网信通科技楼 A 栋 运维组</option>
                        <option value="福州国网信通科技楼B栋">福州国网信通科技楼 B 栋 通讯中心</option>
                        <option value="厦门路路通综合运营大厅">厦门华亿思明区运营大厅</option>
                        <option value="泉州数字底座集控机房一区">泉州数字底座集控机房一区</option>
                        <option value="三明运维机房备件库">三明运维机房备件库</option>
                      </select>
                    </div>

                    {/* Station No */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                        <Cpu size={12} className="text-purple-600" />
                        <span>* 物理工位卡号/座席编号</span>
                      </label>
                      <input
                        type="text"
                        value={p.station || ''}
                        onChange={(e) => handleUpdateOMField(p.id, 'station', e.target.value)}
                        placeholder="例如: Desk #O-0428-B"
                        className="w-full text-xs border border-slate-300 bg-white rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-semibold text-slate-700"
                        required
                      />
                    </div>

                    {/* Other Memo */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                        <span>其他备注说明 / 账号开通指示</span>
                      </label>
                      <input
                        type="text"
                        value={p.otherInfo || ''}
                        onChange={(e) => handleUpdateOMField(p.id, 'otherInfo', e.target.value)}
                        placeholder="例如: 负责配网系统二期巡检，配备堡垒机双因子账号"
                        className="w-full text-xs border border-slate-300 bg-white rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confidentiality Commitment letter upload panel */}
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-semibold transition"
          >
            取消维护
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg font-bold shadow-sm hover:shadow transition"
          >
            归档
          </button>
        </div>

      </div>
    </div>
  );
}
