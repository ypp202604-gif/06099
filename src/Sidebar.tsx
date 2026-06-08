import React, { useState } from 'react';
import { 
  Users,
  ChevronDown, 
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setTab }: SidebarProps) {
  const [personnelMenuOpen, setPersonnelMenuOpen] = useState(true);

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 font-sans transition-all duration-300">
      {/* Title logo branding with Chinese utilities */}
      <div className="h-16 flex items-center px-5 bg-slate-950 border-b border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <div>
            <div className="font-bold text-[15px] tracking-wide text-slate-100">
              数字化工作台 DMN
            </div>
            <div className="text-[10px] text-blue-400">
              INTELLIGENT WORKPLACE
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Menus */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 py-3 text-[13px]">
        {/* Personnel Management Section */}
        <div className="px-3 mb-2">
          <div 
            onClick={() => setPersonnelMenuOpen(!personnelMenuOpen)}
            className="flex items-center justify-between px-3 py-2.5 rounded text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Users size={16} className="text-blue-500" />
              <span className="font-medium text-slate-200">人员管理</span>
            </div>
            {personnelMenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {personnelMenuOpen && (
            <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-700 ml-5">
              <div 
                onClick={() => setTab('approval')}
                className={`px-3 py-1.5 rounded flex items-center justify-between cursor-pointer transition-all ${
                  currentTab === 'approval' 
                    ? 'bg-blue-600 text-white font-medium shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>人员变更</span>
                {currentTab === 'approval' && <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer with system state logs */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        <div>福建信通业务系统专用</div>
        <div className="mt-1 text-slate-400">技术支持：数字化部</div>
      </div>
    </div>
  );
}
