import { ref } from 'vue';
import { MarketAPI, InvestmentAPI } from '../lib/api.js';

export function useMarketAnalysis() {
  const error = ref(null);
  const errorVisible = ref(false);
  const isLoading = ref(false);
  const apiState = ref({
    marketsLoaded: false,
    marketsError: null,
    historyLoaded: false,
    historyError: null,
    trendsLoaded: false,
    trendsError: null
  });

  // 错误处理函数
  const handleError = (err) => {
    // 处理API错误响应
    if (err.code && err.message) {
      error.value = `${err.code}: ${err.message}`;
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = '发生未知错误，请稍后重试';
    }
    
    errorVisible.value = true;
    isLoading.value = false;
    
    // 5秒后自动隐藏错误提示
    setTimeout(() => {
      errorVisible.value = false;
    }, 5000);
    
    // 记录错误到控制台
    console.error('[Market Analysis Error]', err);
  };

  /**
   * 根据日期区间（支持 YYYY-MM 或 YYYY-MM-DD）精确筛选历史记录（按天精度），并按日期升序返回
   * @param {Array<Object>} historyRecords - 接口返回的历史记录数组，每项包含类似 `净值日期` 的日期字段
   * @param {string} start - 开始日期，支持 'YYYY-MM' 或 'YYYY-MM-DD'（若为 YYYY-MM，则为当月第一天）
   * @param {string} end - 结束日期，支持 'YYYY-MM' 或 'YYYY-MM-DD'（若为 YYYY-MM，则为当月最后一天）
   * @returns {Array<Object>} - 返回在闭区间 [start, end] 内的记录，按日期升序
   */
  const filterHistoryByMonthRange = (historyRecords, start, end) => {
    if (!Array.isArray(historyRecords)) return [];

    /**
     * 解析边界字符串为 Date 对象（兼容 YYYY-MM 与 YYYY-MM-DD）
     * 参数说明：
     *  - s: 边界字符串，可为 'YYYY-MM' (表示当月边界) 或 'YYYY-MM-DD'（表示精确日期）。
     *  - isStart: 布尔值，若为 true 则返回区间左边界（若 s 为 YYYY-MM，则返回当月第一天的 00:00:00），
     *             若为 false 则返回区间右边界（若 s 为 YYYY-MM，则返回当月最后一日的 23:59:59.999）。
     * 返回值：Date 对象；当 s 为空或无法解析时，返回极小/极大时间以便于比较（分别对应 isStart=true/false）。
     * 示例：
     *  - parseBoundary('2020-03', true)  -> 2020-03-01T00:00:00.000
     *  - parseBoundary('2020-03', false) -> 2020-03-31T23:59:59.999
     *  - parseBoundary('2020-03-15', true) -> 2020-03-15T00:00:00.000
     * 错误处理：若传入无法解析的字符串，则返回极小/极大时间（不抛异常），以保证过滤逻辑健壮性。
     */
    const parseBoundary = (s, isStart) => {
      if (!s) return isStart ? new Date(-8640000000000000) : new Date(8640000000000000);
      const parts = s.split('-').map(Number);
      if (parts.length === 2) {
        const [y, m] = parts;
        return isStart ? new Date(y, m - 1, 1, 0, 0, 0, 0) : new Date(y, m, 0, 23, 59, 59, 999);
      }
      const d = new Date(s);
      return isNaN(d.getTime()) ? (isStart ? new Date(-8640000000000000) : new Date(8640000000000000)) : d;
    };

    const startDate = parseBoundary(start, true);
    const endDate = parseBoundary(end, false);

    const normalized = historyRecords
      .map(rec => {
        // 支持多种可能的日期字段名
        const rawDateStr = rec['净值日期'] || rec.date || rec['date'] || rec.nav_date || rec['单位净值日期'] || '';
        const parsed = new Date(rawDateStr);
        return { raw: rec, parsedDate: parsed, ts: parsed.getTime() };
      })
      .filter(item => {
        if (!isFinite(item.ts)) return false; // 过滤掉无效日期
        return item.parsedDate >= startDate && item.parsedDate <= endDate;
      })
      .sort((a, b) => a.ts - b.ts)
      .map(item => item.raw);

    return normalized;
  };
  // 获取市场列表
  const fetchMarkets = async () => {
    try {
      isLoading.value = true;
      const markets = await MarketAPI.getMarkets();
      apiState.value.marketsLoaded = true;
      return markets;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  // 获取市场历史数据（按日度筛选）
  const fetchMarketData = async (marketId, startDate, endDate) => {
    try {
      isLoading.value = true;
      apiState.value = {
        marketsLoaded: false,
        marketsError: null,
        historyLoaded: false,
        historyError: null,
        trendsLoaded: false,
        trendsError: null
      };

      // 1. 获取市场历史数据（API 可能返回 array 或 { data: [...] }）
      const history = await MarketAPI.getMarketHistory(marketId);
      const rawRecords = Array.isArray(history)
        ? history
        : (Array.isArray(history && history.data) ? history.data : (Array.isArray(history && history.records) ? history.records : []));

      // 2. 根据用户选择的 startDate/endDate 做日度筛选（已经按日期升序返回）
      const filteredRecords = filterHistoryByMonthRange(rawRecords, startDate, endDate);
      apiState.value.historyLoaded = true;

      // 3. 将筛选后的日度记录聚合为每月最后一条记录（labels: 'YYYY-MM', data: 单位净值）
      // 假设记录中日期字段可能是 '净值日期' / date / nav_date，单位净值字段可能是 '单位净值' / nav / close / value
      const monthlyMap = new Map();
      filteredRecords.forEach(rec => {
        const rawDateStr = rec['净值日期'] || rec.date || rec['date'] || rec.nav_date || rec['单位净值日期'] || '';
        const d = new Date(rawDateStr);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        // 由于 filteredRecords 已按升序排序，直接赋值会保留该月的最后一条记录（后来的会覆盖前面的）
        monthlyMap.set(key, rec);
      });

      const labels = Array.from(monthlyMap.keys()).sort();
      const data = labels.map(k => {
        const rec = monthlyMap.get(k) || {};
        const val = rec['单位净值'] ?? rec.unitNav ?? rec.nav ?? rec.close ?? rec.value ?? rec['累计净值'];
        return val == null ? null : Number(val);
      });

      // 构造按日序列，供前端按周/双周/天采样使用
      const formatYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dailySeries = filteredRecords.map(rec => {
        const rawDateStr = rec['净值日期'] || rec.date || rec['date'] || rec.nav_date || rec['单位净值日期'] || '';
        const d = new Date(rawDateStr);
        const val = rec['单位净值'] ?? rec.unitNav ?? rec.nav ?? rec.close ?? rec.value ?? rec['累计净值'];
        return {
          date: isNaN(d.getTime()) ? '' : formatYMD(d),
          value: val == null ? null : Number(val),
          raw: rec
        };
      }).filter(item => item.date);

      console.log('labels', labels);
      console.log('monthly data', data);
      console.log('dailySeries length', dailySeries.length);
      // 尝试从原始 history 响应中读取额外信息（如 name/trends/indicators），否则使用安全回退
      const name = history && history.name ? history.name : '';
      const fullName = history && history.fullName ? history.fullName : history && history.full_name ? history.full_name : name;
      const trends = history && history.trends ? history.trends : [];
      const indicators = history && history.indicators ? history.indicators : {};

      return {
        name,
        fullName,
        labels,
        data,
        trends,
        indicators,
        // 新增：按日升序的序列，格式 [{date: 'YYYY-MM-DD', value: Number, raw: 原始记录}]
        dailySeries
      };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 执行策略回测
  const runBacktest = async (marketId, startDate, endDate, monthlyAmount) => {
    try {
      isLoading.value = true;
      const backtest = await InvestmentAPI.runBacktest({
        marketId,
        startDate,
        endDate,
        strategies: [
          {
            type: 'normal',
            monthlyAmount
          },
          {
            type: 'enhanced',
            monthlyAmount,
            params: {
              bearThreshold: -0.04,
              bullThreshold: 0.04,
              bearMultiplier: 1.5,
              bullMultiplier: 0.7
            }
          }
        ]
      });

      return {
        period: backtest.summary.period.months,
        baselineReturn: backtest.summary.marketReturn,
        baselineSeries: backtest.monthlyDetails.map(d => d.marketValue),
        normalSeries: backtest.monthlyDetails.map(d => d.strategies.normal.value),
        optimizedSeries: backtest.monthlyDetails.map(d => d.strategies.enhanced.value),
        normalReturn: backtest.summary.strategies.normal.totalReturn,
        normalAnnualReturn: backtest.summary.strategies.normal.annualizedReturn,
        normalMaxDrawdown: backtest.summary.strategies.normal.maxDrawdown,
        normalSharpeRatio: backtest.summary.strategies.normal.sharpeRatio,
        optimizedReturn: backtest.summary.strategies.enhanced.totalReturn,
        optimizedAnnualReturn: backtest.summary.strategies.enhanced.annualizedReturn,
        optimizedMaxDrawdown: backtest.summary.strategies.enhanced.maxDrawdown,
        optimizedSharpeRatio: backtest.summary.strategies.enhanced.sharpeRatio,
        labels: backtest.monthlyDetails.map(d => d.date),
        normalTotalInvested: backtest.summary.strategies.normal.totalInvestment,
        normalFinalValue: backtest.summary.strategies.normal.finalValue,
        optimizedTotalInvested: backtest.summary.strategies.enhanced.totalInvestment,
        optimizedFinalValue: backtest.summary.strategies.enhanced.finalValue
      };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 计算投资策略
  const calculateStrategy = async (marketId, startDate, endDate, monthlyAmount, strategyType) => {
    try {
      isLoading.value = true;
      const result = await InvestmentAPI.calculateStrategy({
        marketId,
        startDate,
        endDate,
        monthlyAmount,
        strategy: {
          type: strategyType,
          params: strategyType === 'optimized' ? {
            bearThreshold: -0.04,
            bullThreshold: 0.04,
            bearMultiplier: 1.5,
            bullMultiplier: 0.7
          } : undefined
        }
      });

      return {
        totalMonths: result.summary.totalMonths,
        totalInvestment: result.summary.totalInvestment,
        finalAmount: result.summary.finalAmount,
        totalProfit: result.summary.totalProfit,
        totalReturn: result.summary.totalReturn,
        annualReturn: result.summary.annualReturn,
        monthlyValues: result.monthlyDetails.map(d => d.value),
        monthlyLabels: result.monthlyDetails.map(d => d.date)
      };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    error,
    errorVisible,
    isLoading,
    apiState,
    handleError,
    fetchMarkets,
    fetchMarketData,
    runBacktest,
    calculateStrategy
  };
}