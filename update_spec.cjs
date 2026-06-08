const fs = require('fs');

let code = fs.readFileSync('src/components/SpecialistConfigModal.tsx', 'utf8');

// 1. the omPersonnel variable
code = code.replace(
  /const omPersonnel = editingPersonnel\.filter\(p => p\.isOM === '是'\);/g,
  `const omPersonnel = editingPersonnel;`
);

// 2. validation fields limit: only validate if they are OM?
// "信通专责角色归档需要维护终端地址、考勤打卡、工位、其他说明、备案时间、相关承诺书等"
// It doesn't explicitly restrict to OM, let's keep the validation for everyone or make it optional.
// Let's modify handleSave validation:
code = code.replace(
  /for \(const p of omPersonnel\) \{\s*if \(\!p\.terminalAddress\?\.trim\(\)\) \{\s*alert\(`请为【\$\{p\.name\}】配置合规的内网运维终端IP地址！`\);\s*return;\s*\}\s*if \(\!p\.attendanceLocation\?\.trim\(\)\) \{\s*alert\(`请为【\$\{p\.name\}】选择和维护考勤位置！`\);\s*return;\s*\}\s*if \(\!p\.station\?\.trim\(\)\) \{\s*alert\(`请分配【\$\{p\.name\}】的物理工位编号！`\);\s*return;\s*\}\s*\}/g,
  `for (const p of omPersonnel) {
      if (p.isOM === '是') {
        if (!p.terminalAddress?.trim()) {
          alert(\`请为【\${p.name}】配置合规的内网运维终端IP地址！\`);
          return;
        }
      }
      if (!p.attendanceLocation?.trim()) {
        alert(\`请为【\${p.name}】选择和维护考勤位置！\`);
        return;
      }
      if (!p.station?.trim()) {
        alert(\`请分配【\${p.name}】的物理工位编号！\`);
        return;
      }
      if (!p.confidentialitySigned) {
        alert(\`请上传【\${p.name}】的保密承诺书归档件！\`);
        return;
      }
    }`
);

// 3. Remove the omPersonnel === 0 check
code = code.replace(
  /\{omPersonnel\.length === 0 \? \([\s\S]*?直接加入常规人员台账。<\/p>\s*<\/div>\s*\) : \(/g,
  `{omPersonnel.length === 0 ? null : (`
);

// 4. "待配置维护的运维人员"
code = code.replace(
  /待配置维护的运维人员/g,
  "待配置维护的人员"
);

// 5. In ApprovalTab.tsx, we previously modified the display where it only showed terminal address etc. if isOM === '是'. We should show it if req.status === '已归档' regardless.
// Actually, earlier I did: `{p.isOM === '是' && req.status === '已归档' && (`

// we need to remove the extra closing bracket
code = code.replace(
  /<\/div>\s*<\/div>\s*\)\}\s*\{\/\* Confidentiality Commitment letter/,
  `</div>\n            </div>\n\n          {/* Confidentiality Commitment letter`
);


fs.writeFileSync('src/components/SpecialistConfigModal.tsx', code);
console.log('Fixed Specialist config modal');
