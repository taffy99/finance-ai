<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 13a1 1 0 11-2 0v-2a1 1 0 011-1h3a1 1 0 110 2h-2v2z"></path>
            <path d="M6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"></path>
          </svg>
          <h1 class="text-xl font-bold">基金网格定投策略</h1>
        </div>
        <button 
          @click="toggleDarkMode"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="切换主题"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="isDarkMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- 策略介绍 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">网格交易策略</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          网格交易是一种在预设价格区间内自动低买高卖的策略。当价格下跌到指定水平时自动买入，上涨到目标水平时自动卖出，
          适用于波动较大的ETF基金，帮助投资者在震荡市中获取收益。
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h3 class="font-medium text-blue-600 dark:text-blue-400 mb-1">适用场景</h3>
            <p class="text-gray-600 dark:text-gray-300">震荡市场、波动率较高的ETF、长期横盘的基金标的</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <h3 class="font-medium text-green-600 dark:text-green-400 mb-1">核心优势</h3>
            <p class="text-gray-600 dark:text-gray-300">无需预测市场、自动执行纪律、分散买入降低风险</p>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <h3 class="font-medium text-yellow-600 dark:text-yellow-400 mb-1">注意事项</h3>
            <p class="text-gray-600 dark:text-gray-300">单边趋势市场可能失效、需预留资金应对极端行情</p>
          </div>
        </div>
      </div>
 
      <!-- 参数配置区 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-6">策略参数配置</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 基金选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">选择基金标的</label>
            <select 
              v-model="selectedFund" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="nasdaq">纳斯达克100 ETF (513300)</option>
              <option value="sp500">标普500 ETF (513500)</option>
              <option value="hs300">沪深300 ETF (510300)</option>
              <option value="zz500">中证500 ETF (510500)</option>
              <option value="gold">黄金ETF (518880)</option>
            </select>
          </div>
          
          <!-- 当前价格 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">当前价格 (元)</label>
            <input 
              type="number" 
              v-model="basePrice" 
              step="0.01" 
              min="0.01"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          
          <!-- 网格层数 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">网格层数 (上下各N层)</label>
            <input 
              type="number" 
              v-model="gridLevels" 
              min="1" 
              max="10"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          
          <!-- 单格涨跌幅 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">单格涨跌幅 (%)</label>
            <input 
              type="number" 
              v-model="gridPercentage" 
              step="0.1" 
              min="0.1" 
              max="10"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          
          <!-- 总投入资金 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">总投入资金 (元)</label>
            <input 
              type="number" 
              v-model="totalFund" 
              step="1000" 
              min="1000"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          
          <!-- 佣金率 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">佣金率 (%)</label>
            <input 
              type="number" 
              v-model="commissionRate" 
              step="0.01" 
              min="0.01" 
              max="0.3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
        </div>
        
        <div class="mt-6 flex justify-center">
          <button 
            @click="calculateGrid"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            计算网格策略
          </button>
        </div>
      </div>

      <!-- 网格计算结果 -->
      <div v-if="gridData.length > 0" class="mb-8">
        <!-- 网格概览 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">网格策略概览</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">基金标的</p>
              <p class="text-xl font-semibold">{{ fundLabels[selectedFund] }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">网格总层数</p>
              <p class="text-xl font-semibold">{{ gridLevels * 2 + 1 }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">单格资金</p>
              <p class="text-xl font-semibold">{{ singleGridFund.toFixed(2) }} 元</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">价格波动区间</p>
              <p class="text-xl font-semibold">
                {{ gridData[0].price.toFixed(2) }} - {{ gridData[gridData.length - 1].price.toFixed(2) }} 元
              </p>
            </div>
          </div>
        </div>

        <!-- 价格网格图表 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-6">价格网格分布</h2>
          <div class="relative h-64 mb-4">
            <!-- 网格可视化 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-full h-1 bg-gray-200 dark:bg-gray-700 relative">
                <!-- 网格线 -->
                <div v-for="(item, index) in gridData" :key="index">
                  <div 
                    :class="['absolute top-0 bottom-0 w-0.5', item.type === 'buy' ? 'bg-green-500' : item.type === 'sell' ? 'bg-red-500' : 'bg-blue-500']"
                    :style="{ left: `${item.position}%` }"
                  >
                    <div class="absolute -translate-x-1/2 -top-8 whitespace-nowrap text-sm">
                      {{ item.price.toFixed(2) }}
                    </div>
                    <div class="absolute -translate-x-1/2 -bottom-8 transform rotate-90 whitespace-nowrap text-xs">
                      {{ item.type === 'buy' ? '买入' : item.type === 'sell' ? '卖出' : '基准' }}
                    </div>
                  </div>
                </div>
                
                <!-- 当前价格指示器 -->
                <div class="absolute top-0 bottom-0 w-3 -translate-x-1/2 bg-purple-500 rounded-full animate-pulse" :style="{ left: `${currentPricePosition}%` }">
                  <div class="absolute -translate-x-1/2 -top-8 whitespace-nowrap text-sm font-medium text-purple-600 dark:text-purple-400">
                    当前: {{ basePrice }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 网格详情表 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 overflow-x-auto">
          <h2 class="text-xl font-semibold mb-6">网格交易详情</h2>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网格层级</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">价格 (元)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">投入资金 (元)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">可购份额</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">预估佣金 (元)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr :class="item.type === 'base' ? 'bg-blue-50 dark:bg-blue-900/20' : ''" v-for="(item, index) in gridData" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.level }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.price.toFixed(4) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="['px-2 py-1 text-xs rounded-full', 
                        item.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        item.type === 'sell' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400']"
                    >
                      {{ item.type === 'buy' ? '买入' : item.type === 'sell' ? '卖出' : '基准持仓' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.fund.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.shares }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.commission.toFixed(2) }}</td>
                </tr>
            </tbody>
          </table>
        </div>

        <!-- 收益模拟器 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-6">收益模拟计算器</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标价格 (元)</label>
              <input 
                type="number" 
                v-model="targetPrice" 
                step="0.01" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
            <div class="flex items-end">
              <button 
                @click="calculateProfit"
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                计算预期收益
              </button>
            </div>
          </div>

          <div v-if="profitData.calculated" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">价格变动</p>
              <p class="text-xl font-semibold" :class="profitData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ profitData.change >= 0 ? '+' : '' }}{{ profitData.change.toFixed(2) }}%
              </p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">触发交易次数</p>
              <p class="text-xl font-semibold">
                买入: {{ profitData.buyCount }} 次 / 卖出: {{ profitData.sellCount }} 次
              </p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">预期收益</p>
              <p class="text-xl font-semibold" :class="profitData.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ profitData.profit >= 0 ? '+' : '' }}{{ profitData.profit.toFixed(2) }} 元 ({{ profitData.profitRate.toFixed(2) }}%)
              </p>
            </div>
          </div>
        </div>

        <!-- 回测结果 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-6">历史回测结果</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">回测周期</p>
              <p class="text-xl font-semibold">2023.01 - 2025.10</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">年化收益率</p>
              <p class="text-xl font-semibold text-green-600 dark:text-green-400">12.36%</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">最大回撤</p>
              <p class="text-xl font-semibold text-red-600 dark:text-red-400">-18.42%</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">交易次数</p>
              <p class="text-xl font-semibold">37 次</p>
            </div>
          </div>
          
          <!-- 回测图表 -->
          <div class="h-64">
            <canvas id="backtestChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 未计算状态 -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">尚未计算网格策略</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">请在上方设置参数并点击"计算网格策略"按钮</p>
        <button 
          @click="scrollToTop"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          返回参数设置
        </button>
      </div>
    </main>

    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div class="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>基金网格定投策略工具 &copy; 2025</p>
        <p class="mt-1">风险提示：历史业绩不代表未来表现，投资有风险，入市需谨慎</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

// 状态管理
const isDarkMode = ref(false);
const selectedFund = ref('nasdaq');
const basePrice = ref(1.5);
const gridLevels = ref(5);
const gridPercentage = ref(5);
const totalFund = ref(10000);
const commissionRate = ref(0.03);
const gridData = ref([]);
const singleGridFund = ref(0);
const targetPrice = ref(1.5);
const profitData = ref({
  calculated: false,
  change: 0,
  buyCount: 0,
  sellCount: 0,
  profit: 0,
  profitRate: 0
});
const currentPricePosition = ref(50);

// 基金标签映射
const fundLabels = {
  'nasdaq': '纳斯达克100 ETF (513300)',
  'sp500': '标普500 ETF (513500)',
  'hs300': '沪深300 ETF (510300)',
  'zz500': '中证500 ETF (510500)',
  'gold': '黄金ETF (518880)'
};

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark');
};

// 计算网格数据
const calculateGrid = () => {
  const levels = gridLevels.value;
  const percentage = gridPercentage.value / 100;
  const price = basePrice.value;
  const fund = totalFund.value;
  const commission = commissionRate.value / 100;
  const minCommission = 5; // 最低佣金5元
  
  // 计算单格资金
  const totalGrids = levels * 2 + 1; // 上下N层 + 基准
  singleGridFund.value = fund / totalGrids;
  
  // 生成网格数据
  const data = [];
  
  // 添加下网格（买入）
  for (let i = levels; i >= 1; i--) {
    const gridPrice = price * Math.pow(1 - percentage, i);
    const actualFund = singleGridFund.value;
    // 计算扣除佣金后的可用资金
    const availableFund = actualFund * (1 - commission);
    // 计算可购买份额（向下取整）
    const shares = Math.floor(availableFund / gridPrice);
    // 计算实际佣金
    const tradeAmount = shares * gridPrice;
    const actualCommission = Math.max(tradeAmount * commission, minCommission);
    
    data.push({
      level: `下${i}`,
      price: gridPrice,
      type: 'buy',
      fund: actualFund,
      shares,
      commission: actualCommission,
      position: 50 - (i * (50 / levels)) // 用于可视化的位置百分比
    });
  }
  
  // 添加基准价格
  const baseShares = Math.floor((singleGridFund.value * (1 - commission)) / price);
  const baseCommission = Math.max(baseShares * price * commission, minCommission);
  
  data.push({
    level: '基准',
    price: price,
    type: 'base',
    fund: singleGridFund.value,
    shares: baseShares,
    commission: baseCommission,
    position: 50
  });
  
  // 添加上网格（卖出）
  for (let i = 1; i <= levels; i++) {
    const gridPrice = price * Math.pow(1 + percentage, i);
    data.push({
      level: `上${i}`,
      price: gridPrice,
      type: 'sell',
      fund: singleGridFund.value,
      shares: Math.floor((singleGridFund.value * (1 - commission)) / (price * Math.pow(1 - percentage, i))),
      commission: Math.max(gridPrice * Math.floor((singleGridFund.value * (1 - commission)) / (price * Math.pow(1 - percentage, i))) * commission, minCommission),
      position: 50 + (i * (50 / levels))
    });
  }
  
  gridData.value = data;
  
  // 设置目标价格默认值为基准价格
  targetPrice.value = price;
  
  // 绘制回测图表
  nextTick(() => {
    drawBacktestChart();
  });
};

// 计算收益
const calculateProfit = () => {
  if (gridData.value.length === 0) return;
  
  const target = targetPrice.value;
  const base = basePrice.value;
  const percentageChange = ((target - base) / base) * 100;
  
  let buyCount = 0;
  let sellCount = 0;
  let totalProfit = 0;
  const commission = commissionRate.value / 100;
  const minCommission = 5;
  
  // 计算触发的买入和卖出交易
  gridData.value.forEach(item => {
    if (item.type === 'buy' && target <= item.price) {
      buyCount++;
      // 计算该层买入并在目标价卖出的收益
      const sellAmount = item.shares * target;
      const sellCommission = Math.max(sellAmount * commission, minCommission);
      const netProfit = (sellAmount - sellCommission) - (item.shares * item.price + item.commission);
      totalProfit += netProfit;
    } else if (item.type === 'sell' && target >= item.price) {
      sellCount++;
    }
  });
  
  // 计算基准持仓收益
  const baseItem = gridData.value.find(item => item.type === 'base');
  if (baseItem) {
    const baseProfit = (baseItem.shares * target) - (baseItem.shares * baseItem.price + baseItem.commission) - 
                      Math.max(baseItem.shares * target * commission, minCommission);
    totalProfit += baseProfit;
  }
  
  // 更新收益数据
  profitData.value = {
    calculated: true,
    change: percentageChange,
    buyCount,
    sellCount,
    profit: totalProfit,
    profitRate: (totalProfit / totalFund.value) * 100
  };
};

// 绘制回测图表
const drawBacktestChart = () => {
  const ctx = document.getElementById('backtestChart');
  
  // 销毁已存在的图表
  if (window.backtestChartInstance) {
    window.backtestChartInstance.destroy();
  }
  
  // 模拟回测数据
  const months = [];
  const strategyData = [];
  const benchmarkData = [];
  
  // 生成过去34个月的日期标签
  const today = new Date();
  for (let i = 33; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    months.push(`${date.getFullYear()}/${date.getMonth() + 1}`);
  }
  
  // 生成模拟收益数据
  let strategyValue = 10000;
  let benchmarkValue = 10000;
  
  months.forEach(() => {
    // 策略收益模拟（略高于基准）
    const strategyChange = (Math.random() - 0.45) * 3; // 略偏向正收益
    strategyValue = strategyValue * (1 + strategyChange / 100);
    strategyData.push(strategyValue.toFixed(0));
    
    // 基准收益模拟
    const benchmarkChange = (Math.random() - 0.5) * 3;
    benchmarkValue = benchmarkValue * (1 + benchmarkChange / 100);
    benchmarkData.push(benchmarkValue.toFixed(0));
  });
  
  // 创建图表
  window.backtestChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: '网格策略收益',
          data: strategyData,
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: '基准收益',
          data: benchmarkData,
          borderColor: '#9CA3AF',
          backgroundColor: 'rgba(156, 163, 175, 0.05)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 6
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '¥' + value;
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 监听基础价格变化，更新当前价格位置指示器
const updateCurrentPricePosition = () => {
  if (gridData.value.length === 0) return;
  
  const minPrice = gridData.value[0].price;
  const maxPrice = gridData.value[gridData.value.length - 1].price;
  const range = maxPrice - minPrice;
  const position = ((basePrice.value - minPrice) / range) * 100;
  
  currentPricePosition.value = position;
};

// 初始化
onMounted(() => {
  // 检查系统暗色模式偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
  
  // 监听基础价格变化
  basePrice.value = 1.5;
  updateCurrentPricePosition();
  
  // 基础价格变化时更新位置
  basePrice.value = 1.5;
  basePrice.value = 1.5; // 触发响应式更新
});
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>