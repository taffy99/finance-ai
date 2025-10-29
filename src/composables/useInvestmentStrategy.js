import { ref, computed } from 'vue';
import { useCharts } from './useCharts';
import { useMarketAnalysis } from './useMarketAnalysis';

export function useInvestmentStrategy() {
  const charts = useCharts();
  const marketAnalysis = useMarketAnalysis();

  // 状态管理
  const selectedMarket = ref('hs300');
  const startDate = ref('2020-01');
  const endDate = ref('2024-12');
  const showResults = ref(false);
  const lastUpdated = ref('');
  const currentMarketInfo = ref({});
  const filteredTrends = ref([]);

  // 定投计算器状态
  const monthlyInvestment = ref(1000);
  const calculatorStartDate = ref('2020-01');
  const calculatorEndDate = ref('2024-12');
  const selectedStrategy = ref('optimized');
  const showCalculationResults = ref(false);
  const calculationResults = ref({});

  // 回测状态
  const DEFAULT_BACKTEST_INFO = {
    period: 0,
    baselineReturn: 0,
    baselineSeries: [],
    normalSeries: [],
    optimizedSeries: [],
    normalReturn: 0,
    normalAnnualReturn: 0,
    normalMaxDrawdown: 0,
    normalSharpeRatio: 0,
    optimizedReturn: 0,
    optimizedAnnualReturn: 0,
    optimizedMaxDrawdown: 0,
    optimizedSharpeRatio: 0,
    labels: []
  };

  const backtestInfo = ref({ ...DEFAULT_BACKTEST_INFO });
  const mockFallbackEnabled = ref(process.env.NODE_ENV === 'development');

  // 辅助函数
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${year}.${month}`;
  };

  const getTrendTypeName = (type) => {
    switch(type) {
      case 'bull': return '牛市';
      case 'bear': return '熊市';
      case 'volatile': return '震荡市';
      default: return '';
    }
  };

  const getTrendColorClass = (type) => {
    switch(type) {
      case 'bull': return 'bg-bull';
      case 'bear': return 'bg-bear';
      case 'volatile': return 'bg-volatile';
      default: return '';
    }
  };

  const getTrendLineColorClass = (type) => {
    switch(type) {
      case 'bull': return 'bg-bull/20';
      case 'bear': return 'bg-bear/20';
      case 'volatile': return 'bg-volatile/20';
      default: return '';
    }
  };

  const getTrendBadgeClass = (type) => {
    switch(type) {
      case 'bull': return 'bg-bull/10 text-bull';
      case 'bear': return 'bg-bear/10 text-bear';
      case 'volatile': return 'bg-volatile/10 text-volatile';
      default: return '';
    }
  };

  const getIndicatorClass = (trend) => {
    switch(trend) {
      case 'up': return 'indicator-up';
      case 'down': return 'indicator-down';
      case 'neutral': return 'indicator-neutral';
      default: return '';
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN');
  };

  // 业务逻辑
  const fetchMarketData = async () => {
    try {
      const data = await marketAnalysis.fetchMarketData(
        selectedMarket.value,
        startDate.value,
        endDate.value
      );

      currentMarketInfo.value = data;
      lastUpdated.value = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      showResults.value = true;
      filterTrendsByDateRange();
      
    } catch (err) {
      if (mockFallbackEnabled.value) {
        console.warn('使用模拟数据作为 fallback');
        currentMarketInfo.value = getMockMarketData(selectedMarket.value);
        showResults.value = true;
        filterTrendsByDateRange();
      }
    }
  };

  const filterTrendsByDateRange = () => {
    const start = new Date(startDate.value + '-01');
    const end = new Date(endDate.value + '-01');

    if (!currentMarketInfo.value || !Array.isArray(currentMarketInfo.value.trends)) {
      filteredTrends.value = [];
      return;
    }

    filteredTrends.value = currentMarketInfo.value.trends.filter(trend => {
      const trendStart = new Date(trend.start + '-01');
      const trendEnd = new Date(trend.end + '-01');
      return trendStart <= end && trendEnd >= start;
    });
  };

  const analyzeMarket = async () => {
    try {
      if (new Date(startDate.value) > new Date(endDate.value)) {
        throw new Error('开始日期不能晚于结束日期');
      }
      
      marketAnalysis.isLoading.value = true;
      
      // 更新计算器日期范围
      calculatorStartDate.value = startDate.value;
      calculatorEndDate.value = endDate.value;
      
      // 获取市场数据和趋势
      await fetchMarketData();
      
      // 生成回测数据
      await generateBacktestData();
      
    } catch (err) {
      marketAnalysis.handleError(err);
    }
  };

  const calculateReturns = async () => {
    try {
      if (new Date(calculatorStartDate.value) > new Date(calculatorEndDate.value)) {
        throw new Error('开始日期不能晚于结束日期');
      }

      const result = await marketAnalysis.calculateStrategy(
        selectedMarket.value,
        calculatorStartDate.value,
        calculatorEndDate.value,
        monthlyInvestment.value,
        selectedStrategy.value
      );

      calculationResults.value = result;
      showCalculationResults.value = true;

    } catch (err) {
      showCalculationResults.value = false;
    }
  };

  const generateBacktestData = async () => {
    try {
      backtestInfo.value = { ...DEFAULT_BACKTEST_INFO };

      const data = await marketAnalysis.runBacktest(
        selectedMarket.value,
        startDate.value,
        endDate.value,
        monthlyInvestment.value
      );

      backtestInfo.value = data;

    } catch (err) {
      marketAnalysis.handleError(err);
    }
  };

  return {
    // 状态
    selectedMarket,
    startDate,
    endDate,
    showResults,
    lastUpdated,
    currentMarketInfo,
    filteredTrends,
    monthlyInvestment,
    calculatorStartDate,
    calculatorEndDate,
    selectedStrategy,
    showCalculationResults,
    calculationResults,
    backtestInfo,
    
    // API相关状态
    error: marketAnalysis.error,
    errorVisible: marketAnalysis.errorVisible,
    isLoading: marketAnalysis.isLoading,
    apiState: marketAnalysis.apiState,
    
    // 图表相关
    charts,
    
    // 方法
    formatDate,
    getTrendTypeName,
    getTrendColorClass,
    getTrendLineColorClass,
    getTrendBadgeClass,
    getIndicatorClass,
    formatNumber,
    fetchMarketData,
    analyzeMarket,
    calculateReturns
  };
}