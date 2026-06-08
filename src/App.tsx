import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  Download, 
  SlidersHorizontal,
  ChevronDown,
  Eye,
  CheckCircle,
  FileCheck,
  Building,
  Users,
  Shield,
  FileText,
  BadgeAlert,
  Clock,
  LogOut,
  Laptop,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './Sidebar';
import AddPersonnelModal from './AddPersonnelModal';
import ApprovalTab from './ApprovalTab';
import SpecialistConfigModal from './SpecialistConfigModal';
import { INITIAL_CONTRACTS, INITIAL_PERSONNEL, INITIAL_CHANGE_REQUESTS } from './data';
import { Contract, Personnel, ChangeRequest } from './types';

export default function App() {
  // Navigation / Tabs
  const [currentTab, setCurrentTab] = useState<string>('approval'); // 'approval'
  
  // States backed by LocalStorage
  const [contracts, setContracts] = useState<Contract[]>(() => {
    try {
      const version = localStorage.getItem('dmn_version_5');
      if (!version) return INITIAL_CONTRACTS;
      const saved = localStorage.getItem('dmn_contracts');
      return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
    } catch (e) {
      return INITIAL_CONTRACTS;
    }
  });

  const [activePersonnel, setActivePersonnel] = useState<Record<string, Personnel[]>>(() => {
    try {
      const version = localStorage.getItem('dmn_version_5');
      if (!version) return INITIAL_PERSONNEL;
      const saved = localStorage.getItem('dmn_active_personnel');
      if (saved) {
        const parsed: Record<string, Personnel[]> = JSON.parse(saved);
        // Clean up any duplicates in saved state to fix React key errors
        const result: Record<string, Personnel[]> = {};
        for (const [key, list] of Object.entries(parsed)) {
          const seen = new Set();
          result[key] = list.filter((p: Personnel) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
        }
        return result;
      }
      return INITIAL_PERSONNEL;
    } catch (e) {
      return INITIAL_PERSONNEL;
    }
  });

  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(() => {
    try {
      const version = localStorage.getItem('dmn_version_5');
      if (!version) return INITIAL_CHANGE_REQUESTS;
      const saved = localStorage.getItem('dmn_change_requests');
      return saved ? JSON.parse(saved) : INITIAL_CHANGE_REQUESTS;
    } catch (e) {
      return INITIAL_CHANGE_REQUESTS;
    }
  });

  // Simulated User Role Switcher for the sandbox experience
  const [userRole, setUserRole] = useState<string>('contractor'); // 'contractor' | 'dept_head' | 'specialist'
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('全部');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRequestForSpecialist, setSelectedRequestForSpecialist] = useState<ChangeRequest | null>(null);
  
  // Drawer/View for contract-specific personnel
  const [viewingContractPersonnelId, setViewingContractPersonnelId] = useState<string | null>(null);

  // Informative Notifications/Toasts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Sync to localstorage
  useEffect(() => {
    try {
      localStorage.setItem('dmn_version_5', '1');
      localStorage.setItem('dmn_contracts', JSON.stringify(contracts));
      localStorage.setItem('dmn_active_personnel', JSON.stringify(activePersonnel));
      localStorage.setItem('dmn_change_requests', JSON.stringify(changeRequests));
    } catch (e) {
      // Ignore
    }
  }, [contracts, activePersonnel, changeRequests]);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Submit new Change Request (From Add Roster wizard)
  const handleAddRequest = (newRequest: ChangeRequest) => {
    setChangeRequests(prev => [newRequest, ...prev]);
    showToast(`成功创建变更申报单 ${newRequest.id}！已提交至数字化部负责人审批柜面。`, 'success');
  };

  // 2. Department Head approval action
  const handleDepartmentHeadApprove = (
    requestId: string, 
    opinion: string, 
    approved: boolean, 
    approverName: string
  ) => {
    setChangeRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        if (!approved) {
          // If rejected
          return {
            ...req,
            status: '已驳回',
            approverOpinion: opinion,
            approverName,
            approvalDate: new Date().toISOString().split('T')[0]
          };
        } else {
          // Always go to specialist configuration
          return {
            ...req,
            status: '待专责归档',
            approverOpinion: opinion,
            approverName,
            approvalDate: new Date().toISOString().split('T')[0]
          };
        }
      }
      return req;
    }));
    
    showToast(
      approved 
        ? `审批单通过！包含运维人员，已流转给"信通专责"进行工位终端维护。` 
        : `审批单已被安全审查驳回。`, 
      approved ? 'success' : 'warn'
    );
  };

  // Helper: Finalize changes onto active personnel list
  const finalizePersonnelRoster = (contractId: string, added: Personnel[], removed: Personnel[]) => {
    setActivePersonnel(prev => {
      const currentList = prev[contractId] || [];
      // Turn approved added guys status into '在职'
      const updatedAdded = added.map(p => ({ ...p, status: '在职' as const }));
      
      // Filter out removed guys
      const removedIds = removed.map(r => r.id);
      const filteredCurrent = currentList.filter(p => !removedIds.includes(p.id));
      
      // Deduplicate to avoid StrictMode double-insertion issues
      const existingIds = new Set(filteredCurrent.map(p => p.id));
      const deduplicatedAdded = updatedAdded.filter(p => !existingIds.has(p.id));

      return {
        ...prev,
        [contractId]: [...filteredCurrent, ...deduplicatedAdded]
      };
    });
  };

  // 3. Specialist Configuration completion action
  const handleSpecialistSaveConfig = (requestId: string, updatedPersonnelList: Personnel[], filingDate?: string, filingMaterials?: string) => {
    
    // Find the request and pull the required changes first
    const targetReq = changeRequests.find(req => req.id === requestId);
    if (targetReq) {
      finalizePersonnelRoster(targetReq.contractId, updatedPersonnelList, targetReq.removedPersonnel);
    }

    setChangeRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Apply O&M parameter details to the request's added personnel
        return {
          ...req,
          addedPersonnel: updatedPersonnelList,
          status: '已归档' as const,
          specialistConfigCompleted: true,
          filingDate: filingDate || req.filingDate,
          filingMaterials: filingMaterials || req.filingMaterials
        };
      }
      return req;
    }));

    showToast('专责配置完成，人员正式进场，台账档案已自动激活并归档！', 'success');
  };

  // Reset demo state of localStorage to standard mocks
  const handleResetSandbox = () => {
    if (confirm('是否确定重置数据为系统初始示范数据？所有录入记录将被清空。')) {
      try {
        localStorage.removeItem('dmn_contracts');
        localStorage.removeItem('dmn_active_personnel');
        localStorage.removeItem('dmn_change_requests');
      } catch(e) {
        // Ignore
      }
      setContracts(INITIAL_CONTRACTS);
      setActivePersonnel(INITIAL_PERSONNEL);
      setChangeRequests(INITIAL_CHANGE_REQUESTS);
      setViewingContractPersonnelId(null);
      showToast('沙箱数据重置成功！', 'info');
    }
  };

  // Search Filter computation
  const filteredContracts = contracts.filter(c => {
    const matchesSearch = searchQuery.trim() === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.partyB.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = filterYear === '全部' || c.year === filterYear;
    const matchesType = filterType === '全部' || c.type === filterType;
    const matchesStatus = filterStatus === '全部' || c.status === filterStatus;
    
    return matchesSearch && matchesYear && matchesType && matchesStatus;
  });

  // Calculate high-level metrics for Summary dashboard (首页)
  const totalContractsCount = contracts.length;
  // sum all people in initial state
  const allActivePersonnelList = Object.values(activePersonnel).flatMap((list: Personnel[]) => list);
  const totalInServiceCount = allActivePersonnelList.length;
  const totalOMCount = allActivePersonnelList.filter((p: Personnel) => p.isOM === '是').length;
  const pendingApprovalsCount = changeRequests.filter(req => req.status === '待数字化部审批').length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans antialiased text-sm">
      
      {/* Sidebar Component */}
      <Sidebar currentTab={currentTab} setTab={(tab) => setCurrentTab(tab)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-slate-800">
              {currentTab === 'approval' ? '人员变更' : '人员变更'}
            </h1>
          </div>

          {/* Interactive Role Switcher Panel */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/60 flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase tracking-wide">测试沙箱角色切换:</span>
              
              <button
                onClick={() => {
                  setUserRole('contractor');
                  showToast('已切换至 [承包商经办人] 视图，您可以发起进场及退场申请。', 'info');
                }}
                className={`px-2.5 py-1 text-[11px] rounded transition font-bold ${
                  userRole === 'contractor' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                1. 承包商经办人
              </button>

              <button
                onClick={() => {
                  setUserRole('dept_head');
                  showToast('已切换至 [数字化部负责人] 视图，您可以办理审批同意或安全驳回。', 'info');
                }}
                className={`px-2.5 py-1 text-[11px] rounded transition font-bold ${
                  userRole === 'dept_head' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                2. 数字化部负责人
              </button>

              <button
                onClick={() => {
                  setUserRole('specialist');
                  showToast('已切换至 [信通专责] 视图，您可以配置运维专用终端IP、打卡物理地和工位。', 'info');
                }}
                className={`px-2.5 py-1 text-[11px] rounded transition font-bold ${
                  userRole === 'specialist' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                3. 信通专责
              </button>
            </div>

            {/* Profile info matched to real watermarked "游平" or standard info */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                游
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-slate-800">欢迎您，游平</div>
                <div className="text-[10px] text-slate-400">福建省电力信通公司</div>
              </div>
              
              <button 
                onClick={handleResetSandbox}
                title="重置测试沙箱环境"
                className="ml-3 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition-colors"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-fade-in pointer-events-none">
            <div className={`p-4 rounded-lg shadow-xl text-xs max-w-md border flex items-center gap-3 bg-white font-medium ${
              toastMessage.type === 'success' 
                ? 'border-emerald-200 text-emerald-800 shadow-emerald-100' 
                : toastMessage.type === 'warn'
                ? 'border-red-200 text-red-800 shadow-red-100'
                : 'border-blue-200 text-blue-800 shadow-blue-100'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                toastMessage.type === 'success' ? 'bg-emerald-500' : toastMessage.type === 'warn' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Dynamic Inner Tab Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
                    {/* APPROVAL QUEUE (人员变更审批页面) */}
          <div className="animate-fade-in h-full">
            <ApprovalTab 
              changeRequests={changeRequests}
              userRole={userRole}
              onApprove={handleDepartmentHeadApprove}
              onSpecialistConfig={req => setSelectedRequestForSpecialist(req)}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          </div>
</main>
      </div>

      {/* Main Add Dialog */}
      <AddPersonnelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        contracts={contracts}
        activePersonnel={activePersonnel}
        onSubmit={handleAddRequest}
      />

      {/* Dedicated Specialist Config Dialog */}
      <SpecialistConfigModal
        isOpen={selectedRequestForSpecialist !== null}
        onClose={() => setSelectedRequestForSpecialist(null)}
        request={selectedRequestForSpecialist}
        onSaveConfig={handleSpecialistSaveConfig}
      />

    </div>
  );
}
