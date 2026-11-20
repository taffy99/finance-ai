<template>
  <div>
      <section class="mb-10 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8">
        <div class="mb-8 flex items-center">
          <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <i class="fa fa-random text-xl text-primary"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold">基金相关性分析</h2>
            <p class="mt-1 text-sm text-neutral">基于共同交易日的日收益率，使用 Pearson 相关系数衡量基金走势同步程度</p>
          </div>
        </div>
        <div class="mb-6 flex justify-end">
          <button
            @click="analyzeFundCorrelation"
            :disabled="isLoading || selectedFunds.length < 2"
            class="group flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i class="fa fa-bar-chart mr-3 transition-transform duration-300 group-hover:scale-110"></i>
            {{ isLoading ? '分析中...' : '分析基金相关性' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label class="mb-2 flex items-center font-medium text-neutral">
              <i class="fa fa-line-chart mr-2 text-primary/70"></i>
              选择基金（至少 2 只）
            </label>
            <div ref="dropdownContainer" class="relative">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl border-2 border-gray-100 bg-light px-5 py-3.5 text-left text-lg transition-all duration-300 hover:border-primary/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                @click="toggleDropdown"
              >
                <span v-if="selectedFunds.length" class="truncate">{{ selectedFundsLabel }}</span>
                <span v-else class="text-gray-400">请选择基金</span>
                <i class="fa" :class="isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </button>

              <div
                v-if="isDropdownOpen"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <div class="border-b border-gray-100 p-2">
                  <input
                    ref="searchInput"
                    v-model="fundCodeInput"
                    type="text"
                    placeholder="输入基金代码或名称进行筛选"
                    class="w-full rounded-lg border border-gray-200 bg-light px-3 py-2 text-base focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  >
                </div>
                <ul class="space-y-1 p-2">
                  <li
                    v-for="option in filteredMarketOptions"
                    :key="option.value"
                    class="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-primary/10"
                  >
                    <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                      <input
                        v-model="selectedFunds"
                        type="checkbox"
                        :value="option.value"
                        :disabled="!selectedFunds.includes(option.value) && selectedFunds.length >= 6"
                        class="accent-primary"
                      >
                      <span class="truncate">{{ option.label }}</span>
                    </label>
                    <span class="shrink-0 text-xs text-gray-500">{{ option.value }}</span>
                  </li>
                  <li
                    v-if="matchingMarketOptions.length > filteredMarketOptions.length"
                    class="px-2 py-2 text-sm text-gray-500"
                  >
                    仅显示前 {{ filteredMarketOptions.length }} 条，请输入基金代码或名称缩小范围
                  </li>
                  <li v-if="filteredMarketOptions.length === 0" class="px-2 py-2 text-gray-500">未找到匹配的基金</li>
                </ul>
              </div>
            </div>
            <p class="mt-1.5 text-xs text-neutral/70">最多选择 6 只基金，建议选择投资风格不同的基金</p>
          </div>
          <div class="group">
            <label class="mb-2 flex items-center font-medium text-neutral">
              <i class="fa fa-calendar-plus mr-2 text-primary/70"></i>
              选择开始日期
            </label>
            <MonthPicker v-model="startDate" :min="minDate" :max="endDate" placeholder="选择开始日期" />
            <p class="mt-1.5 text-xs text-neutral/70">可选范围：{{ minDate.slice(0, 7) }} 至 {{ maxDate.slice(0, 7) }}</p>
          </div>
          <div class="group">
            <label class="mb-2 flex items-center font-medium text-neutral">
              <i class="fa fa-calendar-minus mr-2 text-primary/70"></i>
              选择结束日期
            </label>
            <MonthPicker v-model="endDate" :min="minDate" :max="maxDate" placeholder="选择结束日期" />
            <p class="mt-1.5 text-xs text-neutral/70">可选范围：{{ minDate.slice(0, 7) }} 至 {{ maxDate.slice(0, 7) }}</p>
          </div>
        </div>
      </section>

        <div v-if="result" class="mt-8 flex flex-col gap-10">
          <section class="order-2 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-8">
            <div class="mb-6 flex items-center">
              <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <i class="fa fa-balance-scale text-xl text-primary"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold">组合建议</h2>
                <p class="mt-1 text-sm text-neutral">权重参考各基金历史日收益率波动，并结合相关性结果评估分散效果</p>
              </div>
            </div>
            <p class="mb-4 text-sm leading-6 text-neutral">{{ result.recommendation }}</p>
            <div class="flex flex-wrap gap-3">
              <span v-for="fund in result.selectedFunds" :key="fund.code" class="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {{ fund.label }} {{ (fund.weight * 100).toFixed(0) }}%
              </span>
            </div>
          </section>

          <section class="order-3 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-8">
            <div class="mb-6 flex items-center">
              <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <i class="fa fa-th text-xl text-primary"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold">相关性矩阵与阶段分析</h2>
                <p class="mt-1 text-sm text-neutral">矩阵中的每个数值，都是两只基金共同交易日收益率的 Pearson 相关系数</p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="rounded-xl border border-primary/10 bg-light/30 p-5">
                <h3 class="mb-4 font-semibold text-dark">整体相关系数矩阵</h3>
                <div class="overflow-x-auto rounded-lg border border-gray-100 bg-white">
                  <table class="w-full text-center text-sm">
                    <thead><tr class="text-neutral">
                      <th class="p-2 text-left">基金</th>
                      <th v-for="fund in result.selectedFunds" :key="fund.code" class="whitespace-nowrap p-2">{{ fund.shortLabel }}</th>
                    </tr></thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in result.overallMatrix" :key="rowIndex" class="border-t border-gray-100">
                        <th class="whitespace-nowrap p-2 text-left">{{ result.selectedFunds[rowIndex].shortLabel }}</th>
                        <td v-for="(value, columnIndex) in row" :key="`${rowIndex}-${columnIndex}`" class="p-2 font-medium" :class="getCellClass(value)">{{ value.toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 rounded-lg bg-white/80 p-4 text-sm leading-6 text-neutral">
                  <p><span class="font-medium text-dark">计算逻辑：</span>先计算每只基金相邻交易日的收益率，再取所选基金的共同交易日作为样本，对每一对基金计算 Pearson 相关系数。</p>
                  <p class="mt-1"><span class="font-medium text-dark">Pearson 公式：</span><span class="font-mono">r<sub>xy</sub> = Σ[(x<sub>i</sub> - x̄)(y<sub>i</sub> - ȳ)] / √[Σ(x<sub>i</sub> - x̄)<sup>2</sup> × Σ(y<sub>i</sub> - ȳ)<sup>2</sup>]</span>，其中 x<sub>i</sub>、y<sub>i</sub> 是同一交易日的两只基金日收益率，x̄、ȳ 是各自的平均日收益率。</p>
                  <p class="mt-1">相关系数范围为 -1 至 1：越接近 1 表示同涨同跌越明显，越接近 -1 表示走势相反，接近 0 表示线性相关性较弱。整体判断使用相关系数矩阵非对角元素的平均值。</p>
                </div>
              </div>
              <div class="rounded-xl border border-primary/10 bg-light/30 p-5">
                <h3 class="mb-4 font-semibold text-dark">不同趋势阶段相关性</h3>
                <div class="h-72 rounded-lg bg-white p-3"><canvas ref="chartCanvas"></canvas></div>
                <div class="mt-4 rounded-lg bg-white/80 p-4 text-sm leading-6 text-neutral">
                  <p><span class="font-medium text-dark">计算逻辑：</span>先按共同交易日的月末净值计算所有基金的组合平均月收益，并按相邻月末变化分类：涨幅超过 7% 为牛市，跌幅低于 -7% 为熊市，其余为震荡市。</p>
                  <p class="mt-1">随后将属于同一阶段月份的共同交易日日收益率分别取出，在该阶段内对每一对基金计算 Pearson 相关系数，最后对所有基金对的结果取平均值作为该阶段相关性；没有足够样本的阶段不参与计算。</p>
                </div>
              </div>
            </div>
        </section>

        <section class="order-1 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-8">
          <div class="mb-6 flex items-center">
            <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <i class="fa fa-line-chart text-xl text-primary"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold">多基金趋势走势</h2>
              <p class="mt-1 text-sm text-neutral">展示所选基金在分析区间内的真实净值变化</p>
            </div>
          </div>
          <div class="h-96 rounded-lg bg-light/50 p-3"><canvas ref="trendChartCanvas"></canvas></div>
          <div class="mt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-neutral">
            <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-bull"></i>牛市：区间涨幅超过 7%</span>
            <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-bear"></i>熊市：区间跌幅超过 7%</span>
            <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-volatile"></i>震荡市：区间变化在 ±7% 内</span>
          </div>
          <p class="mt-4 text-xs text-neutral">有效样本数：{{ result.sampleCount }} 个交易日。趋势阶段按组合平均月收益划分。</p>
        </section>
      </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { Chart } from 'chart.js'
import MonthPicker from './MonthPicker.vue'
import { useMarketAnalysis } from '../composables/useMarketAnalysis.js'

const { fetchMarketData, fetchMarkets } = useMarketAnalysis()
const marketOptions = shallowRef([])
const selectedFunds = ref([])
const result = ref(null)
const isLoading = ref(false)
const chartCanvas = ref(null)
const chart = ref(null)
const trendChartCanvas = ref(null)
const trendChart = ref(null)
const startDate = ref('')
const endDate = ref('')
const minDate = ref('')
const maxDate = ref('')
const dropdownContainer = ref(null)
const searchInput = ref(null)
const isDropdownOpen = ref(false)
const fundCodeInput = ref('')

const matchingMarketOptions = computed(() => {
  const searchTerm = fundCodeInput.value.trim().toLowerCase()
  if (!searchTerm) return marketOptions.value
  return marketOptions.value.filter(option =>
    option.value.toLowerCase().includes(searchTerm) ||
    option.label.toLowerCase().includes(searchTerm)
  )
})
const filteredMarketOptions = computed(() => matchingMarketOptions.value.slice(0, 100))

const selectedFundsLabel = computed(() => {
  const labels = selectedFunds.value
    .map(code => marketOptions.value.find(option => option.value === code)?.label || code)
  if (labels.length <= 2) return labels.join('、')
  return `${labels.slice(0, 2).join('、')} 等 ${labels.length} 只基金`
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const parts = String(date).split('-')
  if (parts.length >= 3) return `${parts[0]}.${parts[1]}.${parts[2]}`
  return `${parts[0]}.${parts[1]}`
}

const formatDateYMD = (date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

const getCellClass = (value) => value >= 0.7 ? 'bg-bear/10 text-bear' : value <= 0.3 ? 'bg-bull/10 text-bull' : 'bg-volatile/10 text-volatile'
const getTrendTypeName = (type) => ({ bull: '牛市', bear: '熊市', volatile: '震荡市' })[type] || ''
const correlation = (left, right) => {
  if (left.length < 2 || left.length !== right.length) return 0
  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length
  const numerator = left.reduce((sum, value, index) => sum + (value - leftMean) * (right[index] - rightMean), 0)
  const denominator = Math.sqrt(left.reduce((sum, value) => sum + (value - leftMean) ** 2, 0) * right.reduce((sum, value) => sum + (value - rightMean) ** 2, 0))
  return denominator ? numerator / denominator : 0
}

const renderChart = (values) => {
  chart.value?.destroy()
  chart.value = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['牛市', '熊市', '震荡市'],
      datasets: [{ label: '平均相关系数', data: [values.bull, values.bear, values.volatile], backgroundColor: ['#00B42A', '#F53F3F', '#FF7D00'], borderRadius: 6 }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: -1, max: 1 } }, plugins: { legend: { display: false } } }
  })
}

const renderTrendChart = (trendSeries) => {
  trendChart.value?.destroy()
  if (!trendChartCanvas.value) return
  const trendColors = {
    bull: { border: '#06B62A', background: 'rgba(6, 182, 42, 0.08)' },
    bear: { border: '#F53F3F', background: 'rgba(245, 63, 63, 0.08)' },
    volatile: { border: '#FF7D00', background: 'rgba(255, 125, 0, 0.08)' }
  }
  const classifyChange = (previous, current) => {
    if (previous == null || previous === 0 || current == null) return 'volatile'
    const rate = (current - previous) / Math.abs(previous)
    if (rate > 0.07) return 'bull'
    if (rate < -0.07) return 'bear'
    return 'volatile'
  }
  trendChart.value = new Chart(trendChartCanvas.value, {
    type: 'line',
    data: {
      labels: trendSeries.labels.map(date => formatDate(String(date).slice(0, 7))),
      datasets: trendSeries.datasets.map(dataset => {
        const segmentColors = dataset.data.map((value, index) => {
          if (index === 0) {
            const next = dataset.data.length > 1 ? dataset.data[1] : value
            return trendColors[classifyChange(value, next)].border
          }
          return trendColors[classifyChange(dataset.data[index - 1], value)].border
        })
        return {
          ...dataset,
          borderColor: trendColors.volatile.border,
          backgroundColor: 'transparent',
          segment: {
            borderColor: context => {
              const previous = dataset.data[context.p0DataIndex]
              const current = dataset.data[context.p1DataIndex]
              return trendColors[classifyChange(previous, current)].border
            },
            backgroundColor: context => {
              const previous = dataset.data[context.p0DataIndex]
              const current = dataset.data[context.p1DataIndex]
              return trendColors[classifyChange(previous, current)].background
            }
          },
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 4,
          pointBackgroundColor: segmentColors,
          pointBorderColor: segmentColors,
          pointHoverBorderColor: segmentColors
        }
      })
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: tooltipItems => tooltipItems[0]?.label || '',
            label: context => {
              const current = Number(context.raw)
              const previous = context.dataIndex > 0
                ? Number(context.dataset.data[context.dataIndex - 1])
                : null
              const comparisonValue = previous == null && context.dataIndex + 1 < context.dataset.data.length
                ? Number(context.dataset.data[context.dataIndex + 1])
                : current
              const trend = classifyChange(previous == null ? current : previous, comparisonValue)
              const change = previous != null && previous !== 0
                ? `，${((current - previous) / Math.abs(previous) * 100).toFixed(2)}%`
                : ''
              return `${context.dataset.label}: ¥ ${current.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}${change}（${getTrendTypeName(trend)}）`
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
        y: {
          beginAtZero: false,
          title: { display: true, text: '基金净值' },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        }
      }
    }
  })
}

const analyzeFundCorrelation = async () => {
  if (selectedFunds.value.length < 2) return alert('请至少选择两只基金')
  isLoading.value = true
  try {
    const data = await Promise.all(selectedFunds.value.map(code => fetchMarketData(code, startDate.value, endDate.value)))
    const funds = data.map((item, index) => ({ code: selectedFunds.value[index], label: marketOptions.value.find(option => option.value === selectedFunds.value[index])?.label || selectedFunds.value[index], data: item?.dailySeries || [] })).filter(fund => fund.data.length >= 2)
    if (funds.length < 2) throw new Error('所选基金的有效历史净值不足，无法计算相关性')
    const returns = Object.fromEntries(funds.map(fund => {
      const values = new Map()
      for (let index = 1; index < fund.data.length; index += 1) {
        const previous = Number(fund.data[index - 1].value)
        const current = Number(fund.data[index].value)
        if (fund.data[index].date && previous > 0 && Number.isFinite(current)) values.set(fund.data[index].date, (current - previous) / previous)
      }
      return [fund.code, values]
    }))
    const dates = [...returns[funds[0].code].keys()].filter(date => funds.every(fund => returns[fund.code].has(date))).sort()
    if (dates.length < 10) throw new Error('所选基金的共同交易日不足 10 天，无法计算可靠的相关性')
    const codes = funds.map(fund => fund.code)
    const commonDates = [...funds.reduce((dates, fund) => {
      const fundDates = new Set(fund.data.map(item => item.date).filter(Boolean))
      return dates ? new Set([...dates].filter(date => fundDates.has(date))) : fundDates
    }, null)].filter(date => date >= startDate.value && date <= endDate.value).sort()
    const monthlyDates = [...new Set(commonDates.map(date => date.slice(0, 7)))]
      .map(month => commonDates.filter(date => date.startsWith(month)).at(-1))
      .filter(Boolean)
    const classifyStage = (previous, current) => {
      if (previous == null || previous === 0 || current == null) return 'volatile'
      const rate = (current - previous) / Math.abs(previous)
      if (rate > 0.07) return 'bull'
      if (rate < -0.07) return 'bear'
      return 'volatile'
    }
    const fundValues = funds.map(fund => new Map(fund.data.map(item => [item.date, Number(item.value)])))
    const monthlyAverageValues = monthlyDates.map(date => fundValues.reduce((sum, values) => sum + (values.get(date) || 0), 0) / fundValues.length)
    const stageByMonth = new Map(monthlyDates.map((date, index) => {
      const comparisonValue = index === 0 && monthlyAverageValues.length > 1
        ? monthlyAverageValues[1]
        : monthlyAverageValues[index]
      const previousValue = index === 0 ? monthlyAverageValues[index] : monthlyAverageValues[index - 1]
      return [date.slice(0, 7), classifyStage(previousValue, comparisonValue)]
    }))
    const stageCorrelations = ['bull', 'bear', 'volatile'].reduce((stages, stage) => {
      const stageDates = dates.filter(date => stageByMonth.get(date.slice(0, 7)) === stage)
      const pairValues = []
      for (let leftIndex = 0; leftIndex < codes.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < codes.length; rightIndex += 1) {
          const left = stageDates.map(date => returns[codes[leftIndex]].get(date))
          const right = stageDates.map(date => returns[codes[rightIndex]].get(date))
          if (left.length >= 2) pairValues.push(correlation(left, right))
        }
      }
      stages[stage] = pairValues.length ? pairValues.reduce((sum, value) => sum + value, 0) / pairValues.length : null
      return stages
    }, {})
    const trendSeries = {
      labels: monthlyDates,
      datasets: funds.map(fund => {
        const values = new Map(fund.data.map(item => [item.date, Number(item.value)]))
        return {
          label: fund.label,
          data: monthlyDates.map(date => values.get(date) ?? null),
          spanGaps: true
        }
      })
    }
    const matrix = codes.map(left => codes.map(right => left === right ? 1 : correlation(dates.map(date => returns[left].get(date)), dates.map(date => returns[right].get(date)))))
    const average = matrix.flatMap((row, rowIndex) => row.filter((_, columnIndex) => columnIndex > rowIndex))
    const weight = 1 / funds.length
    result.value = {
      selectedFunds: funds.map(fund => ({ ...fund, shortLabel: fund.label.length > 8 ? fund.label.slice(0, 8) : fund.label, weight })),
      overallMatrix: matrix,
      sampleCount: dates.length,
      trendSeries,
      recommendation: average.reduce((sum, value) => sum + value, 0) / average.length >= 0.7 ? '基金整体走势高度同步，建议加入债券、货币或黄金类低相关资产，避免组合风险过度集中。' : '基金存在一定分散效果，建议以波动率倒数权重为基础，并结合风险承受能力微调。'
    }
    await renderChart(stageCorrelations)
    await renderTrendChart(trendSeries)
  } catch (error) {
    result.value = null
    alert(error instanceof Error ? error.message : '基金相关性分析失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  const today = new Date()
  maxDate.value = formatDateYMD(today)
  minDate.value = formatDateYMD(new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()))
  endDate.value = maxDate.value
  startDate.value = formatDateYMD(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()))
  const markets = await fetchMarkets()
  marketOptions.value = markets.map(market => ({ value: market['基金代码'], label: market['基金简称'] }))
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  chart.value?.destroy()
  trendChart.value?.destroy()
})
</script>
