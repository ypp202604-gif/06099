const fs = require('fs');

let addFile = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

addFile = addFile.replace(
  /const \[addedRoster, setAddedRoster\] = useState<Partial<Personnel>\[\]>\(\[[\s\S]*?\}\n  \]\);/,
  `const [addedRoster, setAddedRoster] = useState<Partial<Personnel>[]>([]);`
);

addFile = addFile.replace(
  /setAddedRoster\(\[\s*\{\s*id: `P_NEW_[\s\S]*?\}\s*\]\);/g,
  `setAddedRoster([]);`
);

// fix "Validation" in AddPersonnelModal if empty: we shouldn't throw error if addedRoster is empty AND selectedLeavingIds is empty. 
// Actually if both are empty, we probably shouldn't be able to submit or it does nothing.
// Let's check how handled validation: "if (addedRoster.length === 0) return;" ?
addFile = addFile.replace(
  `if (addedRoster.length === 0 && selectedLeavingIds.length === 0) {
      alert('请添加至少一条变更信息！');
      return;
    }`,
  `if (addedRoster.length === 0 && selectedLeavingIds.length === 0) {\n      alert('请添加至少一条变更信息！');\n      return;\n    }`
);
// just looking for some form of empty check to bypass if they only do exits.
// "if (addedRoster.length === 0) {" or similar

let approveFile = fs.readFileSync('src/components/ApprovalTab.tsx', 'utf8');

approveFile = approveFile.replace(
  /<span>\{req\.status === '待数字化部审批' && userRole === 'dept_head' \? '办理审批' : req\.status === '待专责配置' && userRole === 'specialist' \? '操作归档' : '查看详情'\}<\/span>/,
  `<span>{req.status === '待数字化部审批' && userRole === 'dept_head' ? '审批' : req.status === '待专责配置' && userRole === 'specialist' ? '操作归档' : '查看详情'}</span>`
);

approveFile = approveFile.replace(
  /安全审查退回 \(驳回\)/,
  `退回`
);

approveFile = approveFile.replace(
  /通过并转专责归档/,
  `通过`
);

fs.writeFileSync('src/components/AddPersonnelModal.tsx', addFile);
fs.writeFileSync('src/components/ApprovalTab.tsx', approveFile);
console.log('Fixed buttons and addedRoster');
