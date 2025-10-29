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
    marketTrendChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels.map(formatDate),
        datasets: [{
          label: data.name,
          data: filteredData,
          borderColor: '#165DFF',
          backgroundColor: 'rgba(22, 93, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#165DFF',
          pointRadius: 2
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