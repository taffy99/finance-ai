import axios from 'axios';

const AKTOOLS_BASE_URL = (
  import.meta.env.VITE_AKTOOLS_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '/aktools-api/api/public'
).replace(/\/$/, '');

const aktoolsClient = axios.create({
  baseURL: AKTOOLS_BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
});

aktoolsClient.interceptors.response.use(
  response => response.data,
  error => {
    const responseData = error.response?.data;
    const message = responseData?.detail || responseData?.message || error.message || 'AkTools 请求失败';
    const requestError = new Error(message);
    requestError.code = responseData?.code || error.code || 'AKTOOLS_REQUEST_FAILED';
    requestError.status = error.response?.status;
    requestError.cause = error;
    console.error('[AkTools API Error]', {
      code: requestError.code,
      status: requestError.status,
      message: requestError.message
    });
    return Promise.reject(requestError);
  }
);

/**
 * 调用 AkTools 的公开 API。
 *
 * AkTools 的公开接口以函数名作为路径，并通过 query 参数接收参数，
 * 例如 /api/public/fund_etf_hist_em?symbol=510300。
 */
export const AkToolsAPI = {
  call(functionName, params = {}) {
    if (!functionName || typeof functionName !== 'string') {
      return Promise.reject(new TypeError('AkTools 函数名不能为空'));
    }

    return aktoolsClient.get(`/${functionName}`, { params });
  },

  getFundList(params = {}) {
    return this.call('fund_name_em', params);
  },

  getFundGradedInfo(symbol) {
    return this.call('fund_graded_fund_info_em', { symbol });
  },

  getOpenFundInfo(symbol, indicator = '单位净值走势') {
    return this.call('fund_open_fund_info_em', { symbol, indicator });
  },

  getFundHistory(symbol, {
    period = 'monthly',
    startDate,
    endDate,
    adjust = ''
  } = {}) {
    return this.call('fund_etf_hist_em', {
      symbol,
      period,
      start_date: startDate,
      end_date: endDate,
      adjust
    });
  }
};

export default AkToolsAPI;
