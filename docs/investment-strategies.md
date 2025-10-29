# 定投策略详解

## 目录
- [策略概述](#策略概述)
- [普通定投策略](#普通定投策略)
- [智能优化定投策略](#智能优化定投策略)
- [回测模拟实现](#回测模拟实现)

## 策略概述

本文档详细说明了两种定投策略的实现逻辑：
1. 普通定投（DCA, Dollar-Cost Averaging）
2. 智能优化定投（Enhanced DCA）

## 普通定投策略

### 核心逻辑

```javascript
/**
 * 普通定投策略实现
 * @param {number} monthlyAmount - 每月定投金额
 * @param {number[]} prices - 历史价格序列
 * @returns {object} 包含总投资、最终价值、收益率等信息
 */
function normalDCA(monthlyAmount, prices) {
    let totalShares = 0;          // 总份额
    let totalInvested = 0;        // 总投资
    const valueSeries = [];       // 价值序列

    // 每月定投固定金额
    prices.forEach(price => {
        // 1. 计算本月可买入份额
        const shares = monthlyAmount / price;
        
        // 2. 更新总份额和总投资
        totalShares += shares;
        totalInvested += monthlyAmount;
        
        // 3. 记录当前总价值
        valueSeries.push(totalShares * price);
    });

    // 计算最终结果
    const finalValue = totalShares * prices[prices.length - 1];
    const returnRate = ((finalValue - totalInvested) / totalInvested) * 100;

    return {
        totalInvested,
        finalValue,
        returnRate,
        valueSeries
    };
}
```

### 策略特点

1. **固定投入**：每月投入相同金额
2. **优势**：
   - 简单易执行
   - 避免择时风险
   - 心理压力小
3. **劣势**：
   - 无法应对市场剧烈波动
   - 牛市可能过度投入
   - 熊市资金利用效率不高

## 智能优化定投策略

### 核心逻辑

```javascript
/**
 * 智能优化定投策略实现
 * @param {number} baseAmount - 基础每月定投金额
 * @param {number[]} prices - 历史价格序列
 * @param {object} params - 策略参数
 * @returns {object} 包含总投资、最终价值、收益率等信息
 */
function enhancedDCA(baseAmount, prices, params = {
    bearThreshold: -0.04,    // 下跌阈值（4%）
    bullThreshold: 0.04,     // 上涨阈值（4%）
    bearMultiplier: 1.5,     // 下跌时加仓倍数
    bullMultiplier: 0.7      // 上涨时减仓倍数
}) {
    let totalShares = 0;
    let totalInvested = 0;
    const valueSeries = [];

    prices.forEach((price, i) => {
        let investmentAmount = baseAmount;
        
        // 1. 市场趋势判断（相对上月）
        if (i > 0) {
            const priceChange = (price - prices[i - 1]) / prices[i - 1];
            
            // 2. 根据趋势调整投资金额
            if (priceChange <= params.bearThreshold) {
                // 下跌超过阈值，加仓
                investmentAmount = baseAmount * params.bearMultiplier;
            } else if (priceChange >= params.bullThreshold) {
                // 上涨超过阈值，减仓
                investmentAmount = baseAmount * params.bullMultiplier;
            }
        }
        
        // 3. 执行投资
        const shares = investmentAmount / price;
        totalShares += shares;
        totalInvested += investmentAmount;
        valueSeries.push(totalShares * price);
    });

    // 计算结果
    const finalValue = totalShares * prices[prices.length - 1];
    const returnRate = ((finalValue - totalInvested) / totalInvested) * 100;

    return {
        totalInvested,
        finalValue,
        returnRate,
        valueSeries
    };
}
```

### 策略参数说明

1. **bearThreshold**（下跌阈值）
   - 默认值：-4%
   - 作用：判断是否进入下跌区间的价格变动阈值
   - 调整建议：可根据不同市场的波动特性调整，波动率高的市场可适当提高阈值

2. **bullThreshold**（上涨阈值）
   - 默认值：4%
   - 作用：判断是否进入上涨区间的价格变动阈值
   - 调整建议：通常与下跌阈值对称，但在某些市场可非对称设置

3. **bearMultiplier**（下跌乘数）
   - 默认值：1.5
   - 作用：下跌时的加仓倍数
   - 调整建议：根据资金充裕度和风险承受能力调整，建议范围1.2-2.0

4. **bullMultiplier**（上涨乘数）
   - 默认值：0.7
   - 作用：上涨时的减仓倍数
   - 调整建议：建议范围0.5-0.8，过低可能错过强势上涨行情

### 策略特点

1. **优势**：
   - 能够根据市场走势动态调整投入
   - 在下跌时更积极地建仓
   - 在上涨时适度控制风险
   - 提高资金使用效率

2. **劣势**：
   - 需要更多的资金管理能力
   - 执行难度较高
   - 可能在震荡市产生过多交易

## 回测模拟实现

```javascript
/**
 * 策略回测实现
 * @param {object} params - 回测参数
 * @returns {object} 回测结果
 */
function backtest({
    startDate,           // 回测起始日期
    endDate,            // 回测结束日期
    monthlyAmount,      // 每月投资金额
    prices,             // 价格序列
    enhancedParams      // 优化策略参数（可选）
}) {
    // 1. 运行普通定投策略
    const normalResults = normalDCA(monthlyAmount, prices);
    
    // 2. 运行优化定投策略
    const enhancedResults = enhancedDCA(monthlyAmount, prices, enhancedParams);
    
    // 3. 计算相对指标
    const baselineValue = prices[prices.length - 1] / prices[0];
    const baselineReturn = (baselineValue - 1) * 100;
    
    // 4. 计算风险指标
    function calculateMaxDrawdown(valueSeries) {
        let maxDrawdown = 0;
        let peak = valueSeries[0];
        
        valueSeries.forEach(value => {
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
    
    return {
        normal: {
            totalInvested: normalResults.totalInvested,
            finalValue: normalResults.finalValue,
            returnRate: normalResults.returnRate,
            maxDrawdown: calculateMaxDrawdown(normalResults.valueSeries)
        },
        enhanced: {
            totalInvested: enhancedResults.totalInvested,
            finalValue: enhancedResults.finalValue,
            returnRate: enhancedResults.returnRate,
            maxDrawdown: calculateMaxDrawdown(enhancedResults.valueSeries)
        },
        baseline: {
            return: baselineReturn
        },
        details: {
            normalValueSeries: normalResults.valueSeries,
            enhancedValueSeries: enhancedResults.valueSeries,
            startDate,
            endDate,
            monthlyAmount
        }
    };
}
```

### 回测指标说明

1. **总投资额**（totalInvested）
   - 累计投入的资金总额
   - 优化策略可能与普通策略不同，因为每月投入金额会动态调整

2. **最终价值**（finalValue）
   - 投资组合在回测结束时的市值
   - 等于总份额乘以最终价格

3. **收益率**（returnRate）
   - 以百分比表示的总收益率
   - 计算公式：(最终价值 - 总投资额) / 总投资额 * 100

4. **最大回撤**（maxDrawdown）
   - 表示在回测期间任意时点的最大亏损百分比
   - 是衡量策略风险的重要指标

### 使用建议

1. **市场选择**
   - 波动较大的市场更适合使用智能优化策略
   - 稳定上涨的市场可以使用普通定投策略

2. **参数调优**
   - 建议根据不同市场特性调整优化策略的参数
   - 可以通过回测历史数据来优化参数设置

3. **风险控制**
   - 设置单次加仓上限，避免过度集中投资
   - 预留足够的现金流动性
   - 定期检查策略表现并适时调整参数

4. **执行纪律**
   - 严格执行策略信号
   - 避免人为主观干预
   - 保持长期投资思维