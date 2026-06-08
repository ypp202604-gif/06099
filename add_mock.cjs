const fs = require('fs');

const code = fs.readFileSync('src/data.ts', 'utf8');

const activePersonnelInsertionPoint = `    {
      id: 'P011',
      name: '王小二',
      companyName: '厦门亿力吉奥信息科技有限公司',
      personnelType: '劳务分包人员',
      phone: '18888889999',
      idCard: '350102199801019999',
      education: '大专',
      title: '技术员',
      skillLevel: '初级工',
      joinWorkDate: '2022-01-01',
      coreTrade: '实施工程',
      isOM: '否',
      businessResult: '通过',
      safetyResult: '通过',
      certResult: '适配',
      confidentialitySigned: true,
      confidentialityDate: '2025-04-20',
      status: '在职'
    }`;

const moreC001People = `,
    {
      id: 'P012',
      name: '刘明明',
      companyName: '厦门亿力吉奥信息科技有限公司',
      personnelType: '运维保障人员',
      phone: '18677778888',
      idCard: '350102199505051234',
      education: '大专',
      title: '工程师',
      skillLevel: '中级工',
      joinWorkDate: '2020-03-01',
      coreTrade: '系统测试',
      isOM: '是',
      businessResult: '通过',
      safetyResult: '通过',
      certResult: '适配',
      confidentialitySigned: true,
      confidentialityDate: '2025-04-20',
      status: '在职',
      terminalAddress: '10.135.24.116',
      attendanceLocation: '福州国网信通科技楼A栋',
      station: 'Desk #O-0428-B'
    },
    {
      id: 'P013',
      name: '黄志雄',
      companyName: '厦门亿力吉奥信息科技有限公司',
      personnelType: '专业分包人员',
      phone: '13955556666',
      idCard: '350102199001018888',
      education: '本科',
      title: '高级工程师',
      skillLevel: '高级工',
      joinWorkDate: '2015-07-01',
      coreTrade: '架构师',
      isOM: '否',
      businessResult: '通过',
      safetyResult: '通过',
      certResult: '适配',
      confidentialitySigned: true,
      confidentialityDate: '2025-04-20',
      status: '在职'
    },
    {
      id: 'P014',
      name: '吴强',
      companyName: '厦门亿力吉奥信息科技有限公司',
      personnelType: '运维保障人员',
      phone: '13599990000',
      idCard: '350102198808085555',
      education: '本科',
      title: '工程师',
      skillLevel: '中级工',
      joinWorkDate: '2016-01-01',
      coreTrade: '数据库管理',
      isOM: '是',
      businessResult: '通过',
      safetyResult: '通过',
      certResult: '适配',
      confidentialitySigned: true,
      confidentialityDate: '2025-04-20',
      status: '在职',
      terminalAddress: '10.135.24.118',
      attendanceLocation: '厦门路路通综合运营大厅',
      station: 'Desk #O-0501-A'
    }`;

fs.writeFileSync('src/data.ts', code.replace(activePersonnelInsertionPoint, activePersonnelInsertionPoint + moreC001People));

// Also I'll make sure there is a Change request with 5-6 removed people
console.log('Done');
