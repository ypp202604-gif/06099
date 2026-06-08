import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Check, 
  UploadCloud, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Contract, Personnel, ChangeRequest } from './types';

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: Contract[];
  activePersonnel: Record<string, Personnel[]>;
  onSubmit: (newRequest: ChangeRequest) => void;
}

export default function AddPersonnelModal({ 
  isOpen, 
  onClose, 
  contracts, 
  activePersonnel, 
  onSubmit 
}: AddPersonnelModalProps) {
  
  // Choose contract
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [requestDescription, setRequestDescription] = useState('新增人员进场备案说明');
  const [requestDate, setRequestDate] = useState('2026-06-08');
  const [entryMaterials, setEntryMaterials] = useState('人员简历及信息安全承诺书等.zip');
  
  // New entry roster state
  const [addedRoster, setAddedRoster] = useState<Partial<Personnel>[]>([]);

  // Leaving roster state
  const [selectedLeavingIds, setSelectedLeavingIds] = useState<string[]>([]);
  
  // Sync animation states for individual buttons
  const [syncingIndex, setSyncingIndex] = useState<Record<string, boolean>>({});

  // Reset selected contract on open
  useEffect(() => {
    if (isOpen) {
      setSelectedContractId('');
      setAddedRoster([]);
      setSelectedLeavingIds([]);
    }
  }, [isOpen]);

  // Update company names when contract changes
  useEffect(() => {
    if (selectedContractId) {
      const contract = contracts.find(c => c.id === selectedContractId);
      if (contract) {
        setAddedRoster(prev => prev.map(p => ({
          ...p,
          companyName: contract.partyB
        })));
      }
    }
  }, [selectedContractId, contracts]);

  if (!isOpen) return null;

  const currentContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const handleAddRow = () => {
    const newId = `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setAddedRoster([
      ...addedRoster,
      {
        id: newId,
        name: '',
        companyName: currentContract?.partyB || '',
        personnelType: '专业分包人员',
        phone: '',
        idCard: '',
        education: '大学本科',
        title: '设计师',
        skillLevel: '中级工',
        joinWorkDate: '2021-05-10',
        coreTrade: '信息系统运维工',
        isOM: '否',
        businessResult: '未考试',
        safetyResult: '未考试',
        certResult: '审核中',
        confidentialitySigned: false
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setAddedRoster(addedRoster.filter((_, idx) => idx !== index));
  };

  const handleUpdateField = (index: number, field: keyof Personnel, value: any) => {
    const updated = [...addedRoster];
    updated[index] = { ...updated[index], [field]: value };
    setAddedRoster(updated);
  };

  // Synchronize business access, safety regulations, and credentials!
  const triggerSyncSync = (index: number) => {
    const item = addedRoster[index];
    const key = `${index}`;
    
    setSyncingIndex(prev => ({ ...prev, [key]: true }));

    // Simulate standard Government API syncing
    setTimeout(() => {
      setSyncingIndex(prev => ({ ...prev, [key]: false }));
      
      const updated = [...addedRoster];
      updated[index] = {
        ...updated[index],
        businessResult: '通过',
        safetyResult: '通过',
        certResult: '适配'
      };
      setAddedRoster(updated);
    }, 1200);
  };

  const handleLeavingSelectToggle = (personnelId: string) => {
    setSelectedLeavingIds(prev => 
      prev.includes(personnelId) 
        ? prev.filter(id => id !== personnelId) 
        : [...prev, personnelId]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!selectedContractId) {
      alert('请选择关联合同！');
      return;
    }

    if (addedRoster.length === 0 && selectedLeavingIds.length === 0) {
      alert('请添加至少一条变更信息！');
      return;
    }

    // Verify roster details
    for (const [idx, person] of addedRoster.entries()) {
      if (!person.name?.trim()) {
        alert(`第 ${idx + 1} 行新进人员姓名不能为空！`);
        return;
      }
      if (!person.phone?.trim()) {
        alert(`第 ${idx + 1} 行新进人员联系方式不能为空！`);
        return;
      }
      if (!person.idCard?.trim() || person.idCard.length < 15) {
        alert(`第 ${idx + 1} 行新进人员身份证号码无效！`);
        return;
      }
      
    }

    // Build lists
    const finalAdded: Personnel[] = addedRoster.map((p, idx) => ({
      id: `P_NEW_${Date.now()}_${idx}`,
      name: p.name!,
      companyName: p.companyName || currentContract.partyB,
      personnelType: p.personnelType || '专业分包人员',
      phone: p.phone!,
      idCard: p.idCard!,
      education: p.education || '大学本科',
      title: p.title || '工程师',
      skillLevel: p.skillLevel || '中级工',
      joinWorkDate: p.joinWorkDate || '2024-01-01',
      coreTrade: p.coreTrade || '开发工程师',
      isOM: p.isOM as '是' | '否' || '否',
      businessResult: p.businessResult as any || '未考试',
      safetyResult: p.safetyResult as any || '未考试',
      certResult: p.certResult as any || '适配',
      confidentialitySigned: false,
      status: '待审核'
    }));

    // Find removed records
    const peopleForContract = activePersonnel[selectedContractId] || [];
    const finalRemoved = peopleForContract.filter(p => selectedLeavingIds.includes(p.id));

    if (finalAdded.length === 0 && finalRemoved.length === 0) {
      alert('请至少新增一名人员或添加一名退场人员！');
      return;
    }

    const newRequest: ChangeRequest = {
      id: `CR_${Date.now()}`,
      contractId: selectedContractId,
      contractName: currentContract?.name || '',
      requestDescription,
      requestDate,
      entryMaterials,
      addedPersonnel: finalAdded,
      removedPersonnel: finalRemoved,
      status: '待数字化部审批',
      approverOpinion: ''
    };

    onSubmit(newRequest);
    onClose();
    onClose();

    // Reset local
    setAddedRoster([]);
    setSelectedLeavingIds([]);
  };

  // Find users available for exit under chosen contract
  const availableLeavingUsers = activePersonnel[selectedContractId] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end font-sans transition-opacity">
      <div className="bg-white shadow-2xl w-full max-w-4xl flex flex-col h-full animate-fade-in-right overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-sm inline-block"></span>
              新增人员进场及变更申请
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">创建项目新员工准入档案，自动关联安全、业务及证书适配。支持批量退场选择。</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Choose Contract (Mandatory first action) */}
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
            
            
          </div>

          {selectedContractId && (
            <>
              {/* Section 2: Request Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-6 text-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <FileText size={16} className="text-blue-500" />
                  变更申请说明及附件
                </h4>
                <div className="space-y-5">
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"><span className="text-red-500 mr-1">*</span>变更申请说明</label>
                     <input type="text" value={requestDescription} onChange={e => setRequestDescription(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"><span className="text-red-500 mr-1">*</span>申请日期</label>
                       <input type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white" required />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">相关附件</label>
                       <input type="file" className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-white border border-slate-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

          {/* Section 3: New Entering Personnel (新进人员列表) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-500 rounded-sm"></span>
                  新进场人员配置区
                </h4>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-4 py-2 hover:bg-slate-50 bg-white border border-slate-300 text-slate-700 rounded-md font-bold transition-all shadow-sm flex items-center gap-1.5 text-sm"
              >
                <Plus size={16} /> 新增人员卡片
              </button>
            </div>

            <div className="space-y-6">
              {addedRoster.map((person, index) => {
                const syncKey = `${index}`;
                const isSyncing = syncingIndex[syncKey];

                return (
                  <div key={person.id} className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row transition-all hover:border-blue-300/50">
                    <div className="w-8 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 text-slate-400 font-bold shrink-0">
                      <span>{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="mt-auto text-slate-400 hover:text-rose-500 hover:bg-white rounded p-1 transition-colors"
                        title="删除该条记录"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                      <div className="flex-1 p-5 lg:p-6 flex flex-col gap-6">
                        {/* Header of Card */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                          <span className="text-sm font-bold text-slate-800">
                            人员资料详情 #{index + 1}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={() => triggerSyncSync(index)} 
                              disabled={isSyncing} 
                              className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${isSyncing ? 'text-blue-400 border-slate-200' : 'text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-50'}`}
                            >
                                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                                {isSyncing ? '比对拉取中...' : '一键拉取校对'}
                            </button>
                          </div>
                        </div>

                        {/* Top Section: 资质比对结果 */}
                        <div className="space-y-3">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1 h-3 bg-emerald-400 rounded-sm"></span>
                            资质比对结果
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-300 transition-colors">
                              <span className="text-[13px] font-bold text-slate-700">业务准入比对</span>
                              <span className={`px-2.5 py-1 rounded text-xs font-bold ${person.businessResult === '通过' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{person.businessResult}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-300 transition-colors">
                              <span className="text-[13px] font-bold text-slate-700">安规红牌核查</span>
                              <span className={`px-2.5 py-1 rounded text-xs font-bold ${person.safetyResult === '通过' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{person.safetyResult}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-300 transition-colors">
                              <span className="text-[13px] font-bold text-slate-700">本合同证书核查</span>
                              <span className={`px-2.5 py-1 rounded text-xs font-bold ${person.certResult === '适配' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{person.certResult}</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Section: 基本信息 */}
                        <div className="pt-4 border-t border-dashed border-slate-200/50 space-y-4">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1 h-3 bg-blue-400 rounded-sm"></span>
                            基本信息
                          </h5>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5"><span className="text-red-500 mr-1">*</span>姓名</label>
                              <input 
                                type="text" 
                                value={person.name || ''} 
                                onChange={(e) => handleUpdateField(index, 'name', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-slate-800" 
                                required 
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">所属单位</label>
                              <div className="text-sm text-slate-600 border border-slate-100 bg-slate-50 rounded-lg px-3 py-2 truncate" title={person.companyName}>
                                {person.companyName || '关联所属单位'}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5"><span className="text-red-500 mr-1">*</span>人员类型</label>
                              <select 
                                value={person.personnelType || '专业分包人员'} 
                                onChange={(e) => handleUpdateField(index, 'personnelType', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="专业分包人员">专业分包人员</option>
                                <option value="劳务分包人员">劳务分包人员</option>
                                <option value="运维保障人员">运维保障人员</option>
                                <option value="项目外协人员">项目外协人员</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5"><span className="text-red-500 mr-1">*</span>联系方式</label>
                              <input 
                                type="text" 
                                maxLength={11} 
                                value={person.phone || ''} 
                                onChange={(e) => handleUpdateField(index, 'phone', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-slate-800" 
                                required 
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5"><span className="text-red-500 mr-1">*</span>身份证号码</label>
                              <input 
                                type="text" 
                                maxLength={18} 
                                value={person.idCard || ''} 
                                onChange={(e) => handleUpdateField(index, 'idCard', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-slate-800" 
                                required 
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">学历</label>
                              <select 
                                value={person.education || '大学本科'} 
                                onChange={(e) => handleUpdateField(index, 'education', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="博士">博士</option>
                                <option value="硕士研究生">硕士研究生</option>
                                <option value="大学本科">大学本科</option>
                                <option value="专科">专科</option>
                                <option value="高中/中专">高中/中专</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">参加工作时间</label>
                              <input 
                                type="date" 
                                value={person.joinWorkDate || ''} 
                                onChange={(e) => handleUpdateField(index, 'joinWorkDate', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800" 
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">职称</label>
                              <select 
                                value={person.title || '工程师'} 
                                onChange={(e) => handleUpdateField(index, 'title', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="高级工程师">高级工程师</option>
                                <option value="工程师">工程师</option>
                                <option value="助理工程师">助理工程师</option>
                                <option value="技术员">技术员</option>
                                <option value="高级项目经理">高级项目经理</option>
                                <option value="项目经理">项目经理</option>
                                <option value="无职称">无职称</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">核心工种</label>
                              <select 
                                value={person.coreTrade || '信息系统运维'} 
                                onChange={(e) => handleUpdateField(index, 'coreTrade', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="信息系统运维">信息系统运维</option>
                                <option value="网络安全运维">网络安全运维</option>
                                <option value="系统开发设计">系统开发设计</option>
                                <option value="软件工程测试">软件工程测试</option>
                                <option value="数据保障应用">数据保障应用</option>
                                <option value="智能化工程保障">智能化工程保障</option>
                                <option value="运行保障技术">运行保障技术</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">技能等级</label>
                              <select 
                                value={person.skillLevel || '中级工'} 
                                onChange={(e) => handleUpdateField(index, 'skillLevel', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="高级技师">高级技师</option>
                                <option value="技师">技师</option>
                                <option value="高级工">高级工</option>
                                <option value="中级工">中级工</option>
                                <option value="初级工">初级工</option>
                                <option value="无">无等级</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">是否运维</label>
                              <div className="flex gap-2 h-[38px]">
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateField(index, 'isOM', '是')} 
                                  className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold border rounded-lg transition-all ${person.isOM === '是' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm ring-1 ring-blue-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {person.isOM === '是' && <Check size={14} />}
                                  是
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateField(index, 'isOM', '否')} 
                                  className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold border rounded-lg transition-all ${person.isOM === '否' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-sm ring-1 ring-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {person.isOM === '否' && <Check size={14} />}
                                  否
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section: 岗位所需证书上传 */}
                        <div className="pt-4 border-t border-dashed border-slate-200/50 space-y-4">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1 h-3 bg-indigo-400 rounded-sm"></span>
                            岗位所需证书上传（对应合同要求全部证书）
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <span className="block text-[13px] font-bold text-slate-700 truncate">CISAW 信息安全保障证书</span>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">适配</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">有效日期</span>
                                  <input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 w-32 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5" defaultChecked />
                                    <span className="text-xs text-slate-600">长期有效</span>
                                  </label>
                                </div>
                              </div>
                              <div className="mt-1 pt-3 border-t border-slate-200/60">
                                <input type="file" className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <span className="block text-[13px] font-bold text-slate-700 truncate">ISO27001 专业认证证书</span>
                                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 shrink-0">不适配</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">有效日期</span>
                                  <input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 w-32 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5" />
                                    <span className="text-xs text-slate-600">长期有效</span>
                                  </label>
                                </div>
                              </div>
                              <div className="mt-1 pt-3 border-t border-slate-200/60">
                                <input type="file" className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <span className="block text-[13px] font-bold text-slate-700 truncate">CISP 注册信息安全人员证书</span>
                                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 shrink-0">不适配</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">有效日期</span>
                                  <input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 w-32 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5" />
                                    <span className="text-xs text-slate-600">长期有效</span>
                                  </label>
                                </div>
                              </div>
                              <div className="mt-1 pt-3 border-t border-slate-200/60">
                                <input type="file" className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Section 4: Leaving Personnel Picker (退场人员) */}
          <div className="border border-amber-200 rounded-xl p-6 bg-orange-50/50">
            <h4 className="text-base font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-sm inline-block"></span>
              选择退场人员 (直接选择项目中已进场的人员)
            </h4>
            <p className="text-sm text-amber-700/80 mb-5">点击列表可以直接从当前项目现执勤团队中多选，提交审批后会在其审批通过时作退场注销处理。</p>
            
            {availableLeavingUsers.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-lg border border-slate-200 text-sm text-slate-500">
                该合同下目前无在职进场人员，无法选择退场。
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableLeavingUsers.map(person => {
                  const isSelected = selectedLeavingIds.includes(person.id);
                  return (
                    <div 
                      key={person.id}
                      onClick={() => handleLeavingSelectToggle(person.id)}
                      className={`cursor-pointer p-4 rounded-xl border text-sm font-medium relative select-none flex flex-col justify-between transition-all ${
                        isSelected 
                          ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md ring-2 ring-amber-300' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base">{person.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${person.isOM === '是' ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          {person.isOM === '是' ? '运维' : '常规'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 truncate" title={person.companyName}>
                        {person.companyName}
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-1">
                        {person.phone}
                      </div>

                      {/* Selected check flag */}
                      {isSelected && (
                        <div className="absolute -top-2.5 -right-2.5 bg-amber-600 text-white rounded-full p-1.5 shadow-lg">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {selectedLeavingIds.length > 0 && (
              <div className="mt-5 text-sm bg-white p-3 md:p-4 rounded-lg border border-amber-200 text-amber-900 font-bold shadow-sm">
                ✓ 已经确认选择离开的退场人员人员共有 ({selectedLeavingIds.length}) 名：
                <span className="ml-2 text-rose-600">
                  {selectedLeavingIds.map(id => availableLeavingUsers.find(u => u.id === id)?.name).join(' 、 ')}
                </span>
              </div>
            )}
          </div>
          </>
          )}
          
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between rounded-b-xl">
          <div className="text-xs text-slate-400">
            * 提交后进场状态为 <strong>待审核</strong> 状态，需由数字化部负责人完成审批。
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 transition"
            >
              关闭
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm hover:shadow transition"
            >
              提交审批件
            </button>
          </div>
        </div>
      </div>

      {/* Editing Personnel Modal */}
      {false && (() => {
        const index = 0;
        const person = {} as any;
        const syncKey = `${index}`;
        const isSyncing = false;
        return (
          <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4 font-sans animate-fade-in">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                   <h3 className="font-bold text-lg text-slate-800">编辑人员资料 <span className="text-slate-400 text-sm font-normal ml-2">#{index + 1}</span></h3>
                   <button type="button" onClick={() => {}} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-4">
                      <h5 className="text-lg font-bold text-slate-800">人员详细信息</h5>
                      <button type="button" onClick={() => triggerSyncSync(index)} disabled={isSyncing} className={`px-5 py-2.5 rounded-lg border shadow-sm ${isSyncing ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'} text-sm font-bold flex items-center justify-center gap-2 transition-all`}>
                        <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                        {isSyncing ? '校对中...' : '一键拉取校对'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                      {/* Left: Basic Info */}
                      <div className="space-y-6 lg:border-r border-slate-100 lg:pr-8 xl:pr-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5"><span className="text-red-500 mr-1">*</span>姓名</label>
                            <input type="text" value={person.name} onChange={(e) => handleUpdateField(index, 'name', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" required />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5"><span className="text-red-500 mr-1">*</span>人员类型</label>
                            <select value={person.personnelType} onChange={(e) => handleUpdateField(index, 'personnelType', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white">
                              <option value="专业分包人员">专业分包人员</option>
                              <option value="劳务分包人员">劳务分包人员</option>
                              <option value="运维保障人员">运维保障人员</option>
                              <option value="项目外协人员">项目外协人员</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5"><span className="text-red-500 mr-1">*</span>联系方式</label>
                            <input type="text" maxLength={11} value={person.phone} onChange={(e) => handleUpdateField(index, 'phone', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" required />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5"><span className="text-red-500 mr-1">*</span>身份证号码</label>
                            <input type="text" maxLength={18} value={person.idCard} onChange={(e) => handleUpdateField(index, 'idCard', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5">单位名称</label>
                            <div className="text-sm text-slate-600 border border-slate-100 bg-slate-50 rounded-lg px-4 py-3 truncate leading-normal" title={person.companyName || currentContract?.partyB}>
                              {person.companyName || currentContract?.partyB || '关联所属单位'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5">是否运维 (配置节点)</label>
                            <div className="flex gap-3 h-[46px]">
                              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 text-sm font-bold cursor-pointer transition-all ${person.isOM === '是' ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm ring-1 ring-blue-400' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                <input type="radio" value="是" checked={person.isOM === '是'} onChange={(e) => handleUpdateField(index, 'isOM', e.target.value)} className="hidden" />
                                {person.isOM === '是' && <Check size={16} />}
                                是 (运维)
                              </label>
                              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 text-sm font-bold cursor-pointer transition-all ${person.isOM === '否' ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-sm ring-1 ring-slate-400' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                <input type="radio" value="否" checked={person.isOM === '否'} onChange={(e) => handleUpdateField(index, 'isOM', e.target.value)} className="hidden" />
                                {person.isOM === '否' && <Check size={16} />}
                                否 (常规)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Work Details */}
                      <div className="space-y-6 lg:border-r border-slate-100 lg:pr-8 xl:pr-12">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2.5">学历与职称</label>
                          <div className="flex gap-4">
                            <select value={person.education} onChange={(e) => handleUpdateField(index, 'education', e.target.value)} className="w-[45%] border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white">
                              <option value="博士">博士</option>
                              <option value="硕士研究生">硕士</option>
                              <option value="大学本科">大学本科</option>
                              <option value="专科">大专</option>
                              <option value="高中/中专">高中/中专</option>
                            </select>
                            <input type="text" placeholder="职称 (选填)" value={person.title || ''} onChange={(e) => handleUpdateField(index, 'title', e.target.value)} className="w-[55%] border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5">技能等级</label>
                            <input type="text" placeholder="如: 高级工" value={person.skillLevel || ''} onChange={(e) => handleUpdateField(index, 'skillLevel', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2.5">核心工种</label>
                            <input type="text" placeholder="如: 开发测试" value={person.coreTrade || ''} onChange={(e) => handleUpdateField(index, 'coreTrade', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2.5">参加工作时间</label>
                          <input type="date" value={person.joinWorkDate || ''} onChange={(e) => handleUpdateField(index, 'joinWorkDate', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white" />
                        </div>
                      </div>

                      {/* Right: Sync Results */}
                      <div className="space-y-5">
                        <label className="block text-sm font-bold text-slate-700 mb-2">资质与安全准入系统比对</label>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-inner">
                          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                            <span className="text-slate-700 font-medium">业务准入</span>
                            <span className={`font-bold tracking-wide ${person.businessResult === '通过' ? 'text-emerald-600' : 'text-slate-400'}`}>{person.businessResult}</span>
                          </div>
                          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                            <span className="text-slate-700 font-medium">安规红牌</span>
                            <span className={`font-bold tracking-wide ${person.safetyResult === '通过' ? 'text-emerald-600' : 'text-slate-400'}`}>{person.safetyResult}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">证书适配</span>
                            <span className={`font-bold tracking-wide ${person.certResult === '适配' ? 'text-blue-600' : 'text-slate-400'}`}>{person.certResult}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Certifications */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <label className="block text-base font-bold text-slate-800 mb-4">本合同要求证书</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                        {/* Cert 1 */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-mono border border-blue-100 font-bold tracking-wide">CISAW 证书</span>
                          </div>
                          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white file:text-slate-700 hover:file:bg-slate-200 cursor-pointer transition-colors" />
                            <span className="text-sm text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 shrink-0 self-start xl:self-auto whitespace-nowrap">自动适配成功</span>
                          </div>
                        </div>

                        {/* Cert 2 */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-mono border border-blue-100 font-bold tracking-wide">ISO27001 证书</span>
                          </div>
                          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white file:text-slate-700 hover:file:bg-slate-200 cursor-pointer transition-colors" />
                            <span className="text-sm text-slate-500 font-medium shrink-0 self-start xl:self-auto bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 whitespace-nowrap">未上传附件</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                   <button type="button" onClick={() => {}} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm">完成编辑并保存</button>
                </div>
             </div>
          </div>
        );
      })()}

    </div>
  );
}
