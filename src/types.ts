export interface Personnel {
  id: string;
  name: string;
  companyName: string;
  personnelType: string; // e.g. 专业分包人员, 运维人员, etc.
  phone: string;
  idCard: string;
  education: string; // 学历
  title?: string; // 职称
  skillLevel?: string; // 技能等级
  joinWorkDate?: string; // 参加工作时间
  coreTrade?: string; // 核心工种
  isOM: '是' | '否'; // 是否运维
  
  // Results
  businessResult: '通过' | '不通过' | '未考试' | '免试';
  safetyResult: '通过' | '不通过' | '未考试' | '免试';
  certResult: '适配' | '不适配' | '审核中';
  
  // Custom SLA
  confidentialitySigned: boolean; // 保密承诺书是否已签署
  confidentialityDate?: string;
  
  // Status
  status: '在职' | '已退场' | '待审核';
  
  // Only for OM (运维人员) configured by Dedicated Specialist (专责)
  terminalAddress?: string; // 终端地址
  attendanceLocation?: string; // 考勤地点
  station?: string; // 工位
  otherInfo?: string; // 其他信息
}

export interface Contract {
  id: string;
  name: string;
  code: string; // 合同编号
  type: string; // 合同类型, e.g. 系统运营, 系统研发, 硬件采购
  partyB: string; // 合同乙方
  purchaseOrder: string; // 采购订单号
  amount: number; // 合同金额 (万元)
  taxRate: number; // 税率 %
  status: '常规运行' | '已完成' | '筹备中';
  year: string; // 下达年份, e.g. "2025", "2026"
}

export interface ChangeRequest {
  id: string;
  contractId: string;
  contractName: string;
  requestDescription?: string; // 变更申请说明
  filingDate?: string; // 备案日期
  filingMaterials?: string; // 备案材料名称
  requestDate: string; // 申请日期
  entryMaterials: string; // 入场材料
  
  addedPersonnel: Personnel[];
  removedPersonnel: Personnel[]; // selected from active personnel
  
  status: '待数字化部审批' | '审批通过' | '已驳回' | '待专责归档' | '已归档';
  approverOpinion?: string;
  approverName?: string;
  approvalDate?: string;
  
  specialistConfigCompleted?: boolean;
}
