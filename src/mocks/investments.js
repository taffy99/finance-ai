// src/mocks/investments.js
// 数据字段模块：
// 投资产品详情：
// 产品名称：productName
// 类型  (下拉选择)productTypeOptions
// 日期（按月）：date
// 持仓金额： positionAmount
// 收益率：returnRate
// 收益金额：profitAmount



// 投资分析模块
// 投资总额
// 累计收益
// 收益率
// 本月收益s

export const investList = [
    {   
        id: 1,
        productName: '招商银行理财产品',
        productType: 'wealthManagementProduct',
        productTypeName: '理财产品',
        purchaseDate: '2023-10-14',
        positionAmount: 80000,
        returnRate: 0.045,
        profitAmount: 3600
      },
      {
        id: 2,
        productName: '沪深300指数基金',
        productType: 'indexFund',
        productTypeName: '指数基金',
        purchaseDate: '2023-10-14',
        positionAmount: 60000,
        returnRate: 0.152,
        profitAmount: 7680
      },
      {
        id: 3,
        productName: '混合型基金组合',
        productType: 'mixedFund',
        productTypeName: '混合基金',
        purchaseDate: '2023-10-14',
        positionAmount: 50000,
        returnRate: 0.082,
        profitAmount: 4100
      },
      {
        id: 4,
        productName: '股票投资组合',
        productType: 'stock',
        productTypeName: '股票',
        purchaseDate: '2023-10-14',
        positionAmount: 40000,
        returnRate: 0.255,
        profitAmount: 10200
      },
      {
        id: 5,
        productName: 'QDII基金',
        productType: 'qdiiFund',
        productTypeName: 'QDII基金',
        purchaseDate: '2023-10-14',
        positionAmount: 20000,
        returnRate: 0.078,
        profitAmount: 1560
      }
  ]
  export const productTypeOptions = [
    { label: '理财产品', value: 'wealthManagementProduct' },
    { label: '指数基金', value: 'indexFund' },
    { label: '混合基金', value: 'mixedFund' },
    { label: '股票', value: 'stock' },
    { label: 'QDII基金', value: 'qdiiFund' },
  ];