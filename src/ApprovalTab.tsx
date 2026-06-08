import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  UserPlus, 
  UserMinus, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  ChevronDown,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { ChangeRequest, Personnel } from './types';

interface ApprovalTabProps {
  changeRequests: ChangeRequest[];
  userRole: string; // 'contractor' | 'dept_head' | 'specialist'
  onApprove: (requestId: string, opinion: string, approved: boolean, approverName: string) => void;
  onSpecialistConfig?: (req: ChangeRequest) => void;
  onAddClick?: () => void;
}

export default function ApprovalTab({ changeRequests, userRole, onApprove, onSpecialistConfig, onAddClick }: ApprovalTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [opinion, setOpinion] = useState('');
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部');

  const handleOpenDetail = (req: ChangeRequest) => {
    setSelectedRequest(req);
    setOpinion(req.approverOpinion || '');
    setIsDetailDrawerOpen(true);
  };

  const submitApprovalAction = (approved: boolean) => {
    if (!selectedRequest) return;
    if (approved && !opinion.trim()) {
      onApprove(selectedRequest.id, '符合各项准入规程，保密承诺手续齐全，同意进场。', true, '游主管');
    } else {
      onApprove(selectedRequest.id, opinion, approved, '游主管');
    }
    setIsDetailDrawerOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = changeRequests.filter(req => {
    let matchMonth = true;
    if (filterMonth) {
      matchMonth = req.requestDate?.startsWith(filterMonth) || false;
    }

    let matchStatus = true;
    if (filterStatus === '待审批') {
      matchStatus = req.status === '待数字化部审批';
    } else if (filterStatus === '待归档') {
      matchStatus = req.status === '待专责归档';
    } else if (filterStatus === '已归档') {
      matchStatus = req.status === '已归档' || req.status === '已驳回' || req.status === '审批通过';
    }

    return matchMonth && matchStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden font-sans">
      <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-t-xl">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            <span className="w-1 h-3.5 bg-blue-600 rounded-sm inline-block"></span>
            人员变更审批流程
          </h3>
        </div>
        
        {userRole !== 'dept_head' ? (
          <div className="flex gap-2 items-center">
            <div className="text-xs text-amber-700 bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 self-start">
              <ShieldAlert size={14} />
              <span className="font-medium">当前在【{userRole === 'contractor' ? '经办人' : '信通专责'}】视图下只读，切换【数字化部负责人】可进行审核操作。</span>
            </div>
            {onAddClick && (
              <button 
                onClick={onAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold text-xs flex items-center gap-1 transition-all shadow-sm self-start"
              >
                新增
              </button>
            )}
          </div>
        ) : (
          <div>
            {onAddClick && (
              <button 
                onClick={onAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold text-xs flex items-center gap-1 transition-all shadow-sm self-start"
              >
                新增
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filters Section */}
      {changeRequests.length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {['全部', '待审批', '待归档', '已归档'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-md font-medium transition-colors ${
                  filterStatus === status 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-medium">申请月份:</label>
            <input 
              type="month" 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-700 outline-none focus:border-blue-500 bg-white"
            />
            {filterMonth && (
              <button 
                onClick={() => setFilterMonth('')}
                className="text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
              >
                清除
              </button>
            )}
          </div>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white">
          <FileSpreadsheet size={54} className="mx-auto text-slate-300 mb-4" />
          <p className="text-sm font-medium">{changeRequests.length === 0 ? '暂无变更或进场审核申请记录' : '没有匹配当前筛选条件的记录'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-b-xl border-t-0 border-slate-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#fafafa] text-slate-700 font-medium border-b border-slate-200">
              <tr className="text-sm">
                <th className="py-4 px-5 font-bold border-r border-slate-200">申请工作单号</th>
                <th className="py-4 px-5 font-bold">关联合同</th>
                <th className="py-4 px-5 font-bold">备案/申请日期</th>
                <th className="py-4 px-5 font-bold">新进人员</th>
                <th className="py-4 px-5 font-bold">退场人员</th>
                <th className="py-4 px-5 font-bold text-center">审批状态</th>
                <th className="py-4 px-5 font-bold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => {
                const hasOMPersonnel = req.addedPersonnel.some(p => p.isOM === '是');
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-5 font-mono font-bold text-blue-600 border-r border-slate-200">{req.id}</td>
                    
                    {/* Contract */}
                    <td className="py-4 px-5 max-w-[280px]">
                      <div className="font-medium text-slate-800 truncate text-base" title={req.contractName}>
                        {req.contractName}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">变更说明：{req.requestDescription || '无'}</div>
                    </td>
                    
                    {/* Date */}
                    <td className="py-4 px-5 text-slate-700">
                      <div className="text-[13px]">申请: {req.requestDate}</div>
                      <div className="text-xs text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 inline-block rounded">备案: {req.filingDate || '待分配'}</div>
                    </td>
                    
                    {/* Added */}
                    <td className="py-4 px-5 text-emerald-700">
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <UserPlus size={15} />
                        <span className="font-bold text-sm">{req.addedPersonnel.length} 人</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 max-w-[140px] truncate leading-tight">
                        {req.addedPersonnel.map(p => p.name).join('、')}
                      </div>
                    </td>

                    {/* Removed */}
                    <td className="py-4 px-5 text-amber-700">
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <UserMinus size={15} />
                        <span className="font-bold text-sm">{req.removedPersonnel.length} 人</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 max-w-[140px] truncate leading-tight">
                        {req.removedPersonnel.map(p => p.name).join('、') || '暂无'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-semibold ${
                        req.status === '待数字化部审批' 
                          ? 'bg-amber-100 text-amber-800' 
                          : req.status === '审批通过' || req.status === '已归档'
                          ? 'bg-emerald-100 text-emerald-800' 
                          : req.status === '待专责归档'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {req.status === '待数字化部审批' && <Clock size={13} />}
                        {req.status === '已归档' && <CheckCircle size={13} />}
                        {req.status === '已驳回' && <XCircle size={13} />}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    {/* Detail Action */}
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => {
      if (req.status === '待专责归档' && userRole === 'specialist' && onSpecialistConfig) {
        onSpecialistConfig(req);
      } else {
        handleOpenDetail(req);
      }
  }}
                        className="py-2.5 px-4 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 rounded-lg transition-all flex items-center gap-1.5 mx-auto font-bold border border-blue-200 hover:border-blue-400 shadow-sm text-sm"
                      >
                        <Eye size={16} />
                        <span>{req.status === '待数字化部审批' && userRole === 'dept_head' ? '审批' : req.status === '待专责归档' && userRole === 'specialist' ? '操作归档' : '查看详情'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail & Action Modal Drawer */}
      {isDetailDrawerOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end font-sans transition-opacity">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl animate-fade-in-left">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  人员进退场及变更 审批办理柜面
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">申请单号: {selectedRequest.id}</p>
              </div>
              <button 
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
              
              {/* Contract Information panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-sm p-5">
                <h5 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-2 mb-3 tracking-wide">合同及备案基础信息</h5>
                <div className="grid grid-cols-2 gap-y-3 gap-x-5">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">关联合同:</span>
                    <p className="font-semibold text-slate-900 mt-1">{selectedRequest.contractName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">变更说明:</span>
                    <p className="text-slate-800 mt-1 text-sm">{selectedRequest.requestDescription || '无'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">备案日期:</span>
                    <p className="font-semibold text-slate-900 mt-1">{selectedRequest.filingDate || '审批后填写'}</p>
                  </div>
                </div>
              </div>

              {/* Added Personnel List */}
              <div>
                <h5 className="font-bold text-emerald-800 text-base border-b border-emerald-100 pb-2 mb-3 flex items-center gap-2">
                  <UserPlus size={18} />
                  <span>批审 - 新进场人员一览 ({selectedRequest.addedPersonnel.length} 人)</span>
                </h5>
                
                {selectedRequest.addedPersonnel.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">本次没有新增人员申请</div>
                ) : (
                  <div className="space-y-4">
                    {selectedRequest.addedPersonnel.map((p, idx) => (
                      <div key={p.id} className="border border-slate-200 rounded-lg p-4 bg-white space-y-3 hover:border-blue-400 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-bold text-slate-900 text-base">{p.name}</span>
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {p.personnelType}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded border font-bold ${
                              p.isOM === '是' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {p.isOM === '是' ? '系统运维人员' : '常规/分包人员'}
                            </span>
                          </div>
                          
                          {p.confidentialitySigned && selectedRequest.status === '已归档' && (
  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
    ✓ 保密书签署
  </span>
)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-600 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">单位</span> <span className="truncate block font-medium text-slate-800" title={p.companyName}>{p.companyName}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">身份证</span> <span className="font-mono text-slate-800">{p.idCard}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">联系电话</span> <span className="text-slate-800 font-medium">{p.phone}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">学历/职称</span> <span className="text-slate-800">{p.education} / {p.title || '无'}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">技能等级</span> <span className="text-slate-800">{p.skillLevel || '无'}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">核心工种</span> <span className="text-slate-800">{p.coreTrade || '无'}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">工作时间</span> <span className="text-slate-800">{p.joinWorkDate || '未知'}</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">安规入库</span> <span className="text-emerald-700 font-bold">考试合格</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">业务准入</span> <span className="text-emerald-700 font-bold">线上通过</span></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">证书校验</span> <span className="text-blue-700 font-bold">匹配</span></div>
                          {p.isOM === '是' && selectedRequest.status === '已归档' && (
  <>
    <div className="col-span-full border-t border-slate-200 my-1 pt-2"></div>
    <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">终端地址 (IP)</span> <span className="font-mono text-purple-700 font-bold">{p.terminalAddress || '—'}</span></div>
    <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">考勤打卡地点</span> <span className="text-purple-700 font-medium">{p.attendanceLocation || '—'}</span></div>
    <div><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">物理工位号</span> <span className="text-purple-700 font-medium">{p.station || '—'}</span></div>
    <div className="col-span-full"><span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold mb-1">其他说明</span> <span className="text-slate-800">{p.otherInfo || '无'}</span></div>
  </>
)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Removed Personnel List */}
              <div>
                <h5 className="font-bold text-amber-800 text-base border-b border-amber-100 pb-2 mb-3 flex items-center gap-2">
                  <UserMinus size={18} />
                  <span>批审 - 退场注销人员一览 ({selectedRequest.removedPersonnel.length} 人)</span>
                </h5>
                
                {selectedRequest.removedPersonnel.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg">本次没有退场注销申请</div>
                ) : (
                  <div className="space-y-4">
                    {selectedRequest.removedPersonnel.map((p) => (
                      <div key={p.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50/30 space-y-3 hover:border-amber-400 shadow-sm transition-all hover:bg-amber-50/50 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-bold text-slate-900 text-base">{p.name}</span>
                            <span className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                              {p.personnelType}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded border font-bold ${
                              p.isOM === '是' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {p.isOM === '是' ? '系统运维人员' : '常规/分包人员'}
                            </span>
                          </div>
                          
                          <span className="text-xs bg-white text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                            拟退场注销
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-700 text-xs bg-white border border-amber-100 p-3 rounded-lg shadow-sm">
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">单位</span> <span className="truncate block font-medium text-slate-800" title={p.companyName}>{p.companyName}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">身份证</span> <span className="font-mono text-slate-800">{p.idCard}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">联系电话</span> <span className="text-slate-800 font-medium">{p.phone}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">学历/职称</span> <span className="text-slate-800">{p.education} / {p.title || '无'}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">技能等级</span> <span className="text-slate-800">{p.skillLevel || '无'}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">核心工种</span> <span className="text-slate-800">{p.coreTrade || '无'}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">工作时间</span> <span className="text-slate-800">{p.joinWorkDate || '未知'}</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">安规入库</span> <span className="text-emerald-700 font-bold">曾合格</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">业务准入</span> <span className="text-emerald-700 font-bold">曾通过</span></div>
                          <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">证书校验</span> <span className="text-blue-700 font-bold">适配</span></div>
                          {p.isOM === '是' && selectedRequest.status === '已归档' && (
  <>
    <div className="col-span-full border-t border-amber-100/50 my-1 pt-2"></div>
    <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">终端地址 (IP)</span> <span className="font-mono text-purple-700 font-bold">{p.terminalAddress || '—'}</span></div>
    <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">考勤打卡地点</span> <span className="text-purple-700 font-medium">{p.attendanceLocation || '—'}</span></div>
    <div><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">物理工位号</span> <span className="text-purple-700 font-medium">{p.station || '—'}</span></div>
    <div className="col-span-full"><span className="text-amber-700/70 block text-[10px] uppercase tracking-wider font-bold mb-1">其他说明</span> <span className="text-slate-800">{p.otherInfo || '无'}</span></div>
  </>
)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Final Opinion History */}
              {selectedRequest.status !== '待数字化部审批' && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <h5 className="font-bold text-blue-900 text-base flex items-center gap-2 border-b border-blue-100 pb-2 mb-3">
                    <MessageSquare size={18} />
                    <span>审计审批意见历史</span>
                  </h5>
                  <p className="font-medium text-slate-800 leading-relaxed italic text-[13px] bg-white p-3 rounded-lg shadow-sm border border-slate-200 tracking-wide">
                    “ {selectedRequest.approverOpinion || '无具体批复意见。'} ”
                  </p>
                  <div className="mt-3 text-right text-slate-500 text-xs flex justify-end items-center gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">审批主管: {selectedRequest.approverName || '数字化部负责人'}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">日期: {selectedRequest.approvalDate || '2026-06-08'}</span>
                  </div>
                </div>
              )}

              {/* Action Board (Only valid for dept_head role and pending state) */}
              {selectedRequest.status === '待数字化部审批' && userRole === 'dept_head' && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-4 shadow-sm">
                  <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-blue-200/50 pb-2">
                    <CheckCircle size={18} className="text-blue-600" />
                    <span>数字化部审核决定</span>
                  </h5>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">部室主管签字批复意见：</label>
                    <textarea
                      rows={3}
                      value={opinion}
                      onChange={(e) => setOpinion(e.target.value)}
                      placeholder="请批复审查和安全性评价意见...（默认：符合各项准入规程，保密承诺手续齐全，同意进场。）"
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none placeholder-slate-400 bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => submitApprovalAction(false)}
                      className="px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-600 font-bold rounded-lg border border-rose-200 transition-all text-sm shadow-sm"
                    >
                      退回重改
                    </button>
                    <button
                      type="button"
                      onClick={() => submitApprovalAction(true)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all text-sm"
                    >
                      审核通过并流转
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Close footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded-lg hover:bg-white text-slate-700 shadow-sm transition-colors"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
