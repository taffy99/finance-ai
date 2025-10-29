// 策略计算和数据处理的工具函数
import dayjs from 'dayjs';

/**
 * 计算收益率
 * @param {number} finalValue - 最终价值
 * @param {number} initialValue - 初始价值
 * @returns {number} 收益率（百分比）
 */
export function calculateReturn(finalValue, initialValue) {
  return ((finalValue - initialValue) / initialValue) * 100;
}

/**
 * 计算年化收益率
 * @param {number} totalReturn - 总收益率（小数）
 * @param {number} years - 投资年数
 * @returns {number} 年化收益率（百分比）
 */
export function calculateAnnualizedReturn(totalReturn, years) {
  return (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100;
}

/**
 * 计算最大回撤
 * @param {number[]} values - 价值序列
 * @returns {number} 最大回撤（百分比）
 */
export function calculateMaxDrawdown(values) {
  let maxDrawdown = 0;
  let peak = values[0];

  values.forEach(value => {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown * 100;
}

/**
 * 计算夏普比率
 * @param {number[]} returns - 收益率序列
 * @param {number} riskFreeRate - 无风险利率（年化）
 * @returns {number} 夏普比率
 */
export function calculateSharpeRatio(returns, riskFreeRate = 0.03) {
  const monthlyRiskFreeRate = Math.pow(1 + riskFreeRate, 1/12) - 1;
  const excessReturns = returns.map(r => r - monthlyRiskFreeRate);
  
  const meanExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  const stdDev = Math.sqrt(
    excessReturns.reduce((sum, r) => sum + Math.pow(r - meanExcessReturn, 2), 0) / 
    (excessReturns.length - 1)
  );

  // 年化处理
  return stdDev === 0 ? 0 : (meanExcessReturn * Math.sqrt(12)) / (stdDev * Math.sqrt(12));
}

/**
 * 计算策略绩效指标
 * @param {Object} params - 计算参数
 * @returns {Object} 策略绩效指标
 */
export function calculatePerformanceMetrics({
  investments,    // 投资记录数组
  prices,         // 价格序列
  startDate,      // 开始日期
  endDate         // 结束日期
}) {
  // 1. 基础计算
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalShares = investments.reduce((sum, inv) => sum + inv.shares, 0);
  const finalValue = totalShares * prices[prices.length - 1];
  
  // 2. 收益率计算
  const totalReturn = calculateReturn(finalValue, totalInvestment);
  const years = dayjs(endDate).diff(dayjs(startDate), 'year', true);
  const annualizedReturn = calculateAnnualizedReturn(totalReturn, years);
  
  // 3. 风险指标计算
  const valueSeries = investments.map((inv, i) => {
    const sharesUntil = investments
      .slice(0, i + 1)
      .reduce((sum, record) => sum + record.shares, 0);
    return sharesUntil * prices[i];
  });
  
  const monthlyReturns = valueSeries.map((value, i) => {
    if (i === 0) return 0;
    return (value - valueSeries[i-1]) / valueSeries[i-1];
  });
  
  const maxDrawdown = calculateMaxDrawdown(valueSeries);
  const sharpeRatio = calculateSharpeRatio(monthlyReturns.slice(1));
  
  return {
    summary: {
      totalInvestment,
      finalValue,
      totalReturn,
      annualizedReturn,
      maxDrawdown,
      sharpeRatio
    },
    details: {
      valueSeries,
      monthlyReturns
    }
  };
}

/**
 * 生成策略信号
 * @param {Object} params - 策略参数
 * @returns {Object} 策略信号
 */
export function generateStrategySignals({
  price,           // 当前价格
  prevPrice,       // 上一期价格
  baseAmount,      // 基础投资金额
  bearThreshold,   // 下跌阈值
  bullThreshold,   // 上涨阈值
  bearMultiplier,  // 下跌乘数
  bullMultiplier   // 上涨乘数
}) {
  // 计算价格变动
  const priceChange = (price - prevPrice) / prevPrice;
  
  // 生成信号
  let signal = 'hold';
  let investmentAmount = baseAmount;
  
  if (priceChange <= bearThreshold) {
    signal = 'increase';
    investmentAmount *= bearMultiplier;
  } else if (priceChange >= bullThreshold) {
    signal = 'decrease';
    investmentAmount *= bullMultiplier;
  }
  
  return {
    signal,
    investmentAmount,
    priceChange: priceChange * 100, // 转换为百分比
    analysis: {
      isBearish: priceChange <= bearThreshold,
      isBullish: priceChange >= bullThreshold,
      intensity: Math.abs(priceChange) / Math.max(Math.abs(bearThreshold), Math.abs(bullThreshold))
    }
  };
}

/**
 * 格式化数字显示
 * @param {number} value - 要格式化的数值
 * @param {string} type - 格式化类型 ('currency'|'percent'|'number')
 * @returns {string} 格式化后的字符串
 */
export function formatValue(value, type = 'number') {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
      }).format(value);
    
    case 'percent':
      return new Intl.NumberFormat('zh-CN', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value / 100);
    
    default:
      return new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
  }
}