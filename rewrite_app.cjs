const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startA = code.indexOf("{/* TAP A: HOME (首页仪表盘) */}");
const endMain = code.indexOf("</main>");

const toReplace = code.substring(startA, endMain);

const newMainContent = `          {/* APPROVAL QUEUE (人员变更审批页面) */}
          <div className="animate-fade-in text-xs h-full">
            <ApprovalTab 
              changeRequests={changeRequests}
              userRole={userRole}
              onApprove={handleDepartmentHeadApprove}
              onSpecialistConfig={req => setSelectedRequestForSpecialist(req)}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          </div>
`;

code = code.replace(toReplace, newMainContent);

// Also remove the tabs in the header:
const startTabs = code.indexOf("{/* Inner Tabs mapping based on image */}");
const endTabs = code.indexOf("          {/* Right Header Navigation */}");

if (startTabs !== -1 && endTabs !== -1) {
  const tabsBlock = code.substring(startTabs, endTabs);
  code = code.replace(tabsBlock, "");
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx rewritten");
