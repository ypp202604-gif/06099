const fs = require('fs');

let addFile = fs.readFileSync('src/components/AddPersonnelModal.tsx', 'utf8');

if (!addFile.includes("请添加至少一条变更信息！")) {
  addFile = addFile.replace(
    /if \(!selectedContractId\) \{\s*alert\('请选择关联合同！'\);\s*return;\s*\}/,
    `if (!selectedContractId) {
      alert('请选择关联合同！');
      return;
    }

    if (addedRoster.length === 0 && selectedLeavingIds.length === 0) {
      alert('请添加至少一条变更信息！');
      return;
    }`
  );

  fs.writeFileSync('src/components/AddPersonnelModal.tsx', addFile);
  console.log('Added empty check');
}
