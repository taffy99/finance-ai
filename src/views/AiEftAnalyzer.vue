<template>
  <div class="ai-eft-analyzer view max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">AI ETF 分析器（示例）</h2>
      <div class="text-sm text-gray-500">演示版：基于启发式与 mock 数据</div>
    </div>

    <div class="flex gap-3">
      <input
        v-model="symbol"
        placeholder="输入基金名或代码（例如 hs300 或 沪深300）"
        class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        @click="runAnalysis"
        :disabled="isLoading"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
      >
        分析
      </button>
    </div>

    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="analysis" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-2 bg-white shadow-sm rounded-lg p-4">
        <div class="h-80 w-full">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="col-span-1 space-y-4">
        <div class="bg-white shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-medium mb-2">摘要</h3>
          <div class="text-sm text-gray-700 space-y-2">
            <div><span class="font-medium">标的：</span>{{ analysis.symbol }}</div>
            <div><span class="font-medium">区间：</span>{{ analysis.start }} — {{ analysis.end }}</div>
            <div><span class="font-medium">近一年收益：</span>{{ (analysis.totalReturn * 100).toFixed(2) }}%</div>
            <div><span class="font-medium">年化波动率：</span>{{ (analysis.volatility * 100).toFixed(2) }}%</div>
            <div><span class="font-medium">移动平均(3)：</span>{{ analysis.ma3 ? analysis.ma3.toFixed(2) : 'N/A' }}</div>
            <div><span class="font-medium">移动平均(6)：</span>{{ analysis.ma6 ? analysis.ma6.toFixed(2) : 'N/A' }}</div>
            <div><span class="font-medium">置信度：</span>{{ (analysis.confidence * 100).toFixed(0) }}%</div>
          </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-medium mb-2">综合说明</h3>
          <pre class="whitespace-pre-wrap text-sm text-gray-700">{{ analysis.narrative }}</pre>
        </div>
      </div>
    </div>

    <div v-else-if="isLoading" class="text-gray-600">正在分析…</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useEftAgent } from '../composables/useEftAgent';
import { useCharts } from '../composables/useCharts';

const symbol = ref('沪深300');
const { isLoading, error, analysis, analyzeEft } = useEftAgent();
const { initMarketTrendChart } = useCharts();
const chartCanvas = ref(null);

const runAnalysis = async () => {
  try {
    await analyzeEft({ symbol: symbol.value });
    // chart will be updated by watch below
  } catch (err) {
    console.error(err);
  }
};

watch(analysis, (next) => {
  if (!next || !chartCanvas.value) return;
  // Prepare data for chart composable
  const data = {
    name: next.symbol,
    labels: next.labels,
    filteredLabels: next.labels,
    filteredData: next.data,
    trends: []
  };
  // init chart
  initMarketTrendChart(chartCanvas.value, data);
});

onMounted(() => {
  // run initial analysis
  runAnalysis();
});
</script>
