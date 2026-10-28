// 市场数据和策略计算的 API 接口实现
import axios from 'axios';
import { AkToolsAPI } from './aktools.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
 * 市场数据相关 API。
 *
 * 基金数据由 AkTools 提供，保留 MarketAPI 作为现有页面的兼容入口。
 */
export const MarketAPI = {
  getMarkets() {
    return AkToolsAPI.getFundList();
  },

  getMarketHistory(marketId) {
    return AkToolsAPI.getOpenFundInfo(marketId);
  },

  getMarketTrends(marketId, startDate, endDate) {
    return apiClient.get(`/markets/${marketId}/trends`, {
      params: { startDate, endDate }
    });
  }
};

/**
 * 投资策略相关 API
 */
export const InvestmentAPI = {
  calculateStrategy(params) {
    return apiClient.post('/investment/calculate', params);
  },

  runBacktest(params) {
    return apiClient.post('/investment/backtest', params);
  }
};

export { AkToolsAPI };
