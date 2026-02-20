import { ref } from 'vue';
import { Chart } from 'chart.js';

export function useCharts() {
  const marketTrendChart = ref(null);
  const backtestChart = ref(null);
  const returnChart = ref(null);

  // 初始化市场趋势图表
  const initMarketTrendChart = (canvas, data) => {
    // 销毁现有图表
    if (marketTrendChart.value) {
      marketTrendChart.value.destroy();
    }

    const { filteredLabels, filteredData, trends } = data;

    // 准备趋势区间注释
    const colorMap = {
      bull: 'rgba(0,180,42,0.08)',
      bear: 'rgba(245,63,63,0.08)',
      volatile: 'rgba(255,125,0,0.08)'
    };

    const trendAnnotations = {};
    trends.forEach((trend, index) => {
      const trendStartIdx = data.labels.indexOf(trend.start);
      const trendEndIdx = data.labels.indexOf(trend.end);
      if (trendStartIdx !== -1 && trendEndIdx !== -1) {
        trendAnnotations[`trend-${index}`] = {
          type: 'box',
          xMin: trendStartIdx,
          xMax: trendEndIdx,
          yMin: 0,
          yMax: 'max',
          backgroundColor: colorMap[trend.type] || 'rgba(0,0,0,0.05)',
          borderWidth: 0
        };
      }
    });

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const [year, month] = dateString.split('-');
      return `${year}.${month}`;
    };

    const ctx = canvas.getContext('2d');

    // 颜色定义
    const COLORS = {
      bull: { border: '#06B62A', point: '#06B62A', bg: 'rgba(6,182,42,0.08)' },
      volatile: { border: '#FF7D00', point: '#FF7D00', bg: 'rgba(255,125,0,0.08)' },
      bear: { border: '#F53F3F', point: '#F53F3F', bg: 'rgba(245,63,63,0.08)' }
    };

    // 计算每一段（前后两点）增长率并返回分类： 'bull' | 'volatile' | 'bear'
    const classifyChange = (prev, curr) => {
      if (prev == null || prev === 0) return 'volatile';
      const rate = (curr - prev) / Math.abs(prev);
      if (rate > 0.07) return 'bull';
      if (rate < -0.07) return 'bear';
      return 'volatile';
    };

    // 生成每个点的 pointBackgroundColor（根据与前一个点的变化分类）
    const pointBgColors = filteredData.map((v, idx) => {
      if (idx === 0) {
        // 首点没有前向比较，取与下一点的分类（若存在），否则 volatile
        if (filteredData.length > 1) {
          return COLORS[classifyChange(filteredData[0], filteredData[1])].point;
        }
        return COLORS.volatile.point;
      }
      const cls = classifyChange(filteredData[idx - 1], v);
      return COLORS[cls].point;
    });

    // 使用 segment 回调为每个线段设置 borderColor / backgroundColor
    const segmentOptions = {
      borderColor: ctxSeg => {
        const i0 = ctxSeg.p0DataIndex;
        const i1 = ctxSeg.p1DataIndex;
        const prev = filteredData[i0];
        const curr = filteredData[i1];
        const cls = classifyChange(prev, curr);
        return COLORS[cls].border;
      },
      backgroundColor: ctxSeg => {
        // 填充颜色用于 segment 的填充区域
        const i0 = ctxSeg.p0DataIndex;
        const i1 = ctxSeg.p1DataIndex;
        const prev = filteredData[i0];
        const curr = filteredData[i1];
        const cls = classifyChange(prev, curr);
        return COLORS[cls].bg;
      }
    };

    marketTrendChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels.map(formatDate),
        datasets: [{
          label: data.name,
          data: filteredData,
          // 默认颜色（会被 segment 覆盖）
          borderColor: '#165DFF',
          backgroundColor: 'rgba(22, 93, 255, 0.06)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          // 每个点的背景色
          pointBackgroundColor: pointBgColors,
          pointRadius: 3,
          segment: segmentOptions
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              }
            }
          },
          annotation: {
            annotations: trendAnnotations
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 12
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  };

  // 初始化回测图表
  const initBacktestChart = (canvas, data) => {
    // 销毁现有图表
    if (backtestChart.value) {
      backtestChart.value.destroy();
    }

    const labels = data.labels.map(l => {
      const parts = l.split('-');
      const date = new Date(parts[0], parseInt(parts[1], 10) - 1, 1);
      return date.getMonth() % 6 === 0 ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` : '';
    });

    const ctx = canvas.getContext('2d');
    backtestChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '基准指数 (Lump-sum)',
            data: data.baselineSeries,
            borderColor: 'rgba(78, 89, 105, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: '普通定投 (DCA)',
            data: data.normalSeries,
            borderColor: 'rgba(255, 125, 0, 0.9)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: '智能优化定投',
            data: data.optimizedSeries,
            borderColor: 'rgba(0, 180, 42, 0.9)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ¥ ${Math.round(context.raw).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: function(value) {
                if (value >= 1000) {
                  return '¥' + (value / 1000) + 'k';
                }
                return '¥' + value;
              }
            }
          }
        }
      }
    });
  };

  // 初始化收益图表
  const initReturnChart = (canvas, data) => {
    // 销毁现有图表
    if (returnChart.value) {
      returnChart.value.destroy();
    }

    const formatNumber = (num) => {
      return num.toLocaleString('zh-CN');
    };

    const ctx = canvas.getContext('2d');
    returnChart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['总投入', '总收益', '期末总资产'],
        datasets: [{
          label: '金额 (元)',
          data: [
            data.totalInvestment,
            data.totalProfit,
            data.finalAmount
          ],
          backgroundColor: [
            'rgba(78, 89, 105, 0.7)',
            data.totalProfit > 0 ? 'rgba(0, 180, 42, 0.7)' : 'rgba(245, 63, 63, 0.7)',
            'rgba(22, 93, 255, 0.7)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `¥ ${formatNumber(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                if (value >= 1000) {
                  return '¥' + (value / 1000) + 'k';
                }
                return '¥' + value;
              }
            }
          }
        }
      }
    });
  };

  return {
    marketTrendChart,
    backtestChart,
    returnChart,
    initMarketTrendChart,
    initBacktestChart,
    initReturnChart
  };
}