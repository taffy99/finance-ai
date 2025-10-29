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

  // 获取市场数据
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

      // 1. 获取市场基础信息
      const marketInfo = await MarketAPI.getMarkets();
      apiState.value.marketsLoaded = true;
      const selectedInfo = marketInfo.markets.find(m => m.id === marketId);
      
      if (!selectedInfo) {
        throw new Error('未找到选中的市场信息');
      }

      // 2. 获取市场历史数据
      const history = await MarketAPI.getMarketHistory(
        marketId,
        startDate,
        endDate
      );
      apiState.value.historyLoaded = true;

      // 3. 获取市场趋势分析
      const trends = await MarketAPI.getMarketTrends(
        marketId,
        startDate,
        endDate
      );
      apiState.value.trendsLoaded = true;

      // 整合数据
      return {
        ...selectedInfo,
        data: history.data.map(d => d.close),
        labels: history.data.map(d => d.date),
        trends: trends.trends,
        indicators: trends.indicators
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
    fetchMarketData,
    runBacktest,
    calculateStrategy
  };
}