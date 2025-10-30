import { ref } from 'vue';
import { MarketAPI } from '../lib/api.js';
import { investList } from '../mocks/investments.js';

/*
  useEftAgent - 说明与契约

  目的：为前端提供一个轻量、可插拔的 "AI-like" 分析器，用于对国内 ETF/指数基金
  在近一年时间尺度上的趋势做快速说明。该实现是启发式的（rule-based + 简单统计），
  旨在用于本地 demo、前端原型或在接入真实 LLM 服务之前的替代方案。

  输入（analyzeEft 的参数）：
    - symbol: 字符串，基金名或代码（例如 'hs300' 或 '沪深300'）。组件会尝试匹配本地 mocks 或
              调用后端 MarketAPI；若均不可用，会生成合成序列用于展示。
    - startDate / endDate: 可选，格式 YYYY-MM（目前默认近 12 个月）

  输出（analysis 对象）：
    {
      symbol: string,
      start: string, // YYYY-MM
      end: string,   // YYYY-MM
      labels: string[], // 时间标签 array
      data: number[],   // 对应价格/指数值
      totalReturn: number, // 近一年收益（比率，例如 0.12 表示 12%）
      volatility: number,  // 年化波动率（比率）
      ma3: number|null,    // 3 期移动平均（最新点）
      ma6: number|null,    // 6 期移动平均（最新点）
      macro: { gdpYoY, cpiYoY, policyRate, sentiment }, // 若后端返回则填充
      narrative: string,   // 人类可读的说明文本
      confidence: number    // 置信度 0-1，用于 UI 提示
    }

  错误与降级策略：
    - 优先调用后端 MarketAPI.getMarketHistory / getMarketTrends（如果后端可用）。
    - 若后端调用失败或返回空数据，则回退到 `src/mocks/investments.js` 的示例或合成随机游走序列。
    - 所有网络错误都会在控制台记录；UI 通过 `error` 响应式引用显示简短错误信息。

  扩展点（建议）：
    - 若要集成 LLM（例如 OpenAI/Anthropic），在后端建立代理服务并在本 composable 中将
      结构化指标和 narrative 一并发送到后端，让后端负责 API key 与 prompt 工程。
    - 可添加更多统计量（最大回撤、夏普比率、成交量相关的信号等）。

  使用示例（组件内）：
    const { analyzeEft, analysis, isLoading } = useEftAgent();
    await analyzeEft({ symbol: 'hs300' });
    console.log(analysis.value);

*/

// Helper: generate synthetic monthly series for past 12 months
function generateSyntheticSeries(seedRate = 0.08, months = 12) {
  const now = new Date();
  const labels = [];
  const data = [];
  let price = 100;
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    // simple random-walk driven by seedRate
    const monthlyDrift = seedRate / 12;
    const noise = (Math.random() - 0.5) * 0.04; // up to +/-4% noise
    price = price * (1 + monthlyDrift + noise);
    data.push(Number(price.toFixed(2)));
  }
  return { labels, data };
}

// Basic statistics
function calcReturn(series) {
  // 计算时间序列的相对收益（首尾比），用于给出近一年的表现度量。
  // 注意：series 应该是按时间顺序排列的数值数组（从早到晚）。
  if (!series || series.length < 2) return 0;
  const start = series[0];
  const end = series[series.length - 1];
  return (end - start) / start;
}

function calcVolatility(series) {
  // 使用对数收益的标准差估计年化波动率（annualized volatility）。
  // 对数收益更适合用于叠加与统计学计算。
  if (!series || series.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < series.length; i++) {
    returns.push(Math.log(series[i] / series[i - 1]));
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(12); // annualized volatility
}

function movingAverage(series, window) {
  // 计算滑动平均（simple moving average），返回长度为 series.length - window + 1 的数组。
  // 例如用于短期/中期趋势判断（ma3, ma6）。
  if (!series || series.length < window) return null;
  const ma = [];
  for (let i = 0; i <= series.length - window; i++) {
    const slice = series.slice(i, i + window);
    ma.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return ma;
}

export function useEftAgent() {
  const isLoading = ref(false);
  const error = ref(null);
  const analysis = ref(null);

  // Core: fetch price series (try MarketAPI -> fallback synthetic)
  const fetchPriceSeries = async (symbol, startDate, endDate) => {
    // 尝试从后端获取真实的历史月度数据（优先）。
    // 返回值预期形态：{ data: [{ date: 'YYYY-MM', close: number }, ...] }
    try {
      const res = await MarketAPI.getMarketHistory(symbol, startDate, endDate, 'monthly').catch(() => null);
      if (res && res.data && res.data.length) {
        const labels = res.data.map(d => d.date);
        const data = res.data.map(d => d.close);
        return { labels, data };
      }
    } catch (err) {
      // 不抛出，后续会降级到本地 mock / 合成数据
      console.warn('MarketAPI fetch failed, falling back to synthetic series', err);
    }

    // 后端不可用或返回空，回退策略：
    // 1) 在本地 mock 数据中寻找匹配项（基于名称或 id）并使用其 returnRate 作为生成参数；
    // 2) 否则使用默认的种子收益率生成合成序列（随机游走）。
    const product = investList.find(p => p.productName.toLowerCase().includes(String(symbol).toLowerCase()) || String(p.id) === String(symbol));
    const seed = product ? product.returnRate || 0.08 : 0.08;
    return generateSyntheticSeries(seed, 12);
  };

  // Main analysis function
  const analyzeEft = async ({ symbol = 'hs300', startDate, endDate } = {}) => {
    isLoading.value = true;
    error.value = null;
    analysis.value = null;
    try {
      // Ensure reasonable date defaults: last 12 months
      const now = new Date();
      const defaultEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const oneYearAgo = new Date(now.getFullYear() - (now.getMonth() === 11 ? 0 : 1), now.getMonth() + 1, 1);
      const defaultStart = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}`;

      const s = startDate || defaultStart;
      const e = endDate || defaultEnd;

      const series = await fetchPriceSeries(symbol, s, e);
      const { labels, data } = series;

      const totalReturn = calcReturn(data);
      const volatility = calcVolatility(data);
      const ma3 = movingAverage(data, 3);
      const ma6 = movingAverage(data, 6);

      // 获取宏观/情绪指标（可选）
      // 说明：如果后端实现了 getMarketTrends 接口，会返回一个 indicators 对象，包含诸如
      // GDP 同比、CPI 同比、政策利率与情绪指标等字段。本示例会尝试读取这些字段用于丰富 narrative。
      // 如果后端未实现或返回为空，agent 会使用基于价格行为的简单启发式来填充情绪线索。
      let macro = { gdpYoY: null, cpiYoY: null, policyRate: null, sentiment: null };
      try {
        const trends = await MarketAPI.getMarketTrends(symbol, s, e).catch(() => null);
        if (trends && trends.indicators) {
          macro.gdpYoY = trends.indicators.gdpYoY ?? null;
          macro.cpiYoY = trends.indicators.cpiYoY ?? null;
          macro.policyRate = trends.indicators.policyRate ?? null;
          macro.sentiment = trends.indicators.sentiment ?? null;
        }
      } catch (err) {
        // 如果网络或解析失败，继续降级，不影响主流程
        console.warn('MarketAPI.getMarketTrends failed or not available', err);
      }

      // If macro fields still null, provide lightweight heuristics from price behavior
      if (macro.sentiment == null) {
        macro.sentiment = totalReturn > 0 ? 'neutral-to-positive' : 'neutral-to-negative';
      }

      // 构建可读的说明文本（narrative）——将计算结果与宏观线索结合，给出明确的要点。
      // 注意：这里的结论是基于启发式规则，并不构成投资建议，仅用于演示。
      const narrative = [];
      narrative.push(`选中标的：${symbol}，分析区间：${s} ~ ${e}`);
      narrative.push(`近一年收益： ${(totalReturn * 100).toFixed(2)}%，年化波动率： ${(volatility * 100).toFixed(2)}%`);

      // 简单阈值规则用于把连续数值映射为文字化结论，可根据业务需求调整阈值与规则。
      if (totalReturn > 0.08) {
        narrative.push('过去一年表现强劲；若宏观指标持续稳定，长期看仍具吸引力。');
      } else if (totalReturn > 0) {
        narrative.push('过去一年温和上涨；关注后续波动与宏观数据以确认趋势延续性。');
      } else {
        narrative.push('过去一年出现回撤；需重点关注估值修正是否已到位及宏观环境转向的风险。');
      }

      if (volatility > 0.25) {
        narrative.push('近一年市场波动性较高；建议降低换手或通过定投分散择时风险。');
      }

      // 将可用的宏观/情绪线索加入说明，增强可解释性
      narrative.push(`宏观线索：GDP YoY=${macro.gdpYoY ?? 'N/A'}, CPI YoY=${macro.cpiYoY ?? 'N/A'}, 政策利率=${macro.policyRate ?? 'N/A'}`);
      narrative.push(`情绪线索：${macro.sentiment}`);

      // Confidence heuristic
      const confidence = Math.max(0.5, Math.min(0.95, 0.5 + Math.abs(totalReturn) / 2));

      analysis.value = {
        symbol,
        start: s,
        end: e,
        labels,
        data,
        totalReturn,
        volatility,
        ma3: ma3 ? ma3[ma3.length - 1] : null,
        ma6: ma6 ? ma6[ma6.length - 1] : null,
        macro,
        narrative: narrative.join('\n'),
        confidence
      };

      // Attempt to enrich narrative via serverless Deep-Seek v3 endpoint.
      // Frontend will call the backend function at VITE_BACKEND_URL (if provided) or relative /api path.
      try {
        const backendBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
        const endpoint = backendBase ? `${backendBase}/api/deepseek-agent` : `/api/deepseek-agent`;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, start: s, end: e, labels, data, macro })
        });

        if (resp.ok) {
          const json = await resp.json();
          // If backend provides better narrative/confidence, merge it
          if (json && json.narrative) {
            // prefer backend narrative but keep local analysis as fallback
            analysis.value.narrative = json.narrative;
          }
          if (json && typeof json.confidence === 'number') {
            analysis.value.confidence = json.confidence;
          }
        } else {
          // non-OK: just log and continue with local narrative
          console.warn('deepseek-agent returned non-OK', resp.status);
        }
      } catch (err) {
        // network or CORS errors: keep local narrative and surface a console warning
        console.warn('Calling deepseek-agent failed, using local heuristic narrative', err);
      }

      return analysis.value;
    } catch (err) {
      error.value = err?.message || String(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    analysis,
    analyzeEft
  };
}

// 导出默认便于按需引入
export default useEftAgent;
