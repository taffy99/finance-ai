// 市场数据和策略计算的API接口实现
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器 - 添加认证信息
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    const errorResponse = error.response?.data?.error || {
      code: 'UNKNOWN_ERROR',
      message: '未知错误'
    };
    console.error('[API Error]', errorResponse);
    return Promise.reject(errorResponse);
  }
);

/**
 * 市场数据相关API
 */
export const MarketAPI = {
  /**
   * 获取支持的市场列表
   */
  getMarkets() {
    return apiClient.get('/markets');
  },

  /**
   * 获取市场历史数据
   * @param {string} marketId - 市场ID
   * @param {string} startDate - 开始日期 (YYYY-MM)
   * @param {string} endDate - 结束日期 (YYYY-MM)
   * @param {string} interval - 数据间隔 (daily|weekly|monthly)
   */
  getMarketHistory(marketId, startDate, endDate, interval = 'monthly') {
    return apiClient.get(`/markets/${marketId}/history`, {
      params: { startDate, endDate, interval }
    });
  },

  /**
   * 获取市场趋势分析
   * @param {string} marketId - 市场ID
   * @param {string} startDate - 开始日期 (YYYY-MM)
   * @param {string} endDate - 结束日期 (YYYY-MM)
   */
  getMarketTrends(marketId, startDate, endDate) {
    return apiClient.get(`/markets/${marketId}/trends`, {
      params: { startDate, endDate }
    });
  }
};

/**
 * 投资策略相关API
 */
export const InvestmentAPI = {
  /**
   * 计算定投策略结果
   * @param {Object} params - 策略参数
   * @param {string} params.marketId - 市场ID
   * @param {string} params.startDate - 开始日期
   * @param {string} params.endDate - 结束日期
   * @param {number} params.monthlyAmount - 每月投资金额
   * @param {Object} params.strategy - 策略配置
   */
  calculateStrategy(params) {
    return apiClient.post('/investment/calculate', params);
  },

  /**
   * 执行策略回测
   * @param {Object} params - 回测参数
   */
  runBacktest(params) {
    return apiClient.post('/investment/backtest', params);
  }
};

/**
 * 使用示例：
 * 
 * // 获取市场数据
 * try {
 *   const markets = await MarketAPI.getMarkets();
 *   const history = await MarketAPI.getMarketHistory('hs300', '2023-01', '2023-12');
 *   const trends = await MarketAPI.getMarketTrends('hs300', '2023-01', '2023-12');
 * } catch (error) {
 *   console.error('Failed to fetch market data:', error);
 * }
 * 
 * // 计算投资策略
 * try {
 *   const result = await InvestmentAPI.calculateStrategy({
 *     marketId: 'hs300',
 *     startDate: '2023-01',
 *     endDate: '2023-12',
 *     monthlyAmount: 1000,
 *     strategy: {
 *       type: 'enhanced',
 *       params: {
 *         bearThreshold: -0.04,
 *         bullThreshold: 0.04,
 *         bearMultiplier: 1.5,
 *         bullMultiplier: 0.7
 *       }
 *     }
 *   });
 * } catch (error) {
 *   console.error('Strategy calculation failed:', error);
 * }
 */