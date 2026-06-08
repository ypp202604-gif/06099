const fs = require('fs');

let code = fs.readFileSync('src/components/ApprovalTab.tsx', 'utf8');

// replace the onClick handler and text of the detail button
code = code.replace(
  /onClick=\{\(\) => handleOpenDetail\(req\)\}/g,
  `onClick={() => {
      if (req.status === '待专责配置' && userRole === 'specialist' && onSpecialistConfig) {
        onSpecialistConfig(req);
      } else {
        handleOpenDetail(req);
      }
  }}`
);

code = code.replace(
  /<span>\{req\.status === '待数字化部审批' && userRole === 'dept_head' \? '办理审批' : '查看详情'\}<\/span>/g,
  `<span>{req.status === '待数字化部审批' && userRole === 'dept_head' ? '办理审批' : req.status === '待专责配置' && userRole === 'specialist' ? '操作归档' : '查看详情'}</span>`
);

fs.writeFileSync('src/components/ApprovalTab.tsx', code);
console.log('Fixed Specialist button action.');
