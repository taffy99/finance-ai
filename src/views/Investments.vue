  <!-- 投资分析页面 -->
<template id="investments-page">
    <div class="relative">
      <!-- 全页 loading 覆盖层：当 overviewLoading 为 true 时显示，阻止页面交互 -->
      <div v-if="returnsLoading" class="absolute inset-0 z-50 flex loader-overlay justify-center bg-white/60 backdrop-blur-sm">
        <div class="flex flex-col items-center">
          <div class="loader-dots" role="status" aria-label="页面加载中">
            <span class="dot" aria-hidden="true"></span>
            <span class="dot" aria-hidden="true"></span>
            <span class="dot" aria-hidden="true"></span>
          </div>
          <div class="loader-text">页面数据加载中...</div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 class="text-xl font-bold">投资分析</h2>
          <p class="text-gray-500">管理和分析您的投资组合</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3">
          <button class="btn rounded-full bg-white border border-purple-500 text-purple-500 hover:bg-purple-100" @click="showAddModal">
            <i class="fas fa-plus mr-2"></i> 添加投资
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-sync-alt mr-2"></i> 同步数据
          </button>
        </div>
      </div>
    
      <!-- 投资概览卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="card p-6">
          <p class="text-gray-500 text-sm">投资总额</p>
          <h3 class="text-2xl font-bold mt-1">{{ investmentTotalDisplay }}</h3>
            <p class="text-sm mt-2">年化收益率 <span :class="annualizedReturnClass">{{ annualizedReturnDisplay }}</span></p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm">当年累计收益</p>
          <h3 :class="['text-2xl font-bold mt-1', cumulativeProfitClass]">{{ cumulativeProfitDisplay }}</h3>
          <p class="text-sm mt-2">收益率 <span :class="cumulativeReturnClass">{{ cumulativeReturnDisplay }}</span></p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm">当月收益</p>
          <h3 :class="['text-2xl font-bold mt-1', monthProfitClass]">{{ monthProfitDisplay }}</h3>
          <p class="text-sm mt-2">较上月 <span :class="monthDeltaClass">{{ monthDeltaDisplay }}</span></p>
        </div>
      </div>
    
      <!-- 投资组合图表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 投资组合分布 -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">投资组合分布</h3>
            <button class="text-blue-500 text-sm">调整配置</button>
          </div>
          <div class="chart-container">
              <canvas ref="investmentPortfolioChart"></canvas>
          </div>
        </div>
        
        <!-- 投资收益趋势 -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">投资收益趋势</h3>
            <div class="flex space-x-2">
              <button class="btn btn-primary text-sm py-1 px-3">6月</button>
              <button class="btn btn-outline text-sm py-1 px-3">1年</button>
              <button class="btn btn-outline text-sm py-1 px-3">3年</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="investmentReturnsChart"></canvas>
          </div>
        </div>
      </div>
    
      <!-- 投资产品列表 -->
      <div class="card overflow-hidden mb-6">
        <div class="p-4 border-b md:flex md:items-center md:justify-between gap-4">
          <h3 class="text-lg font-semibold">投资产品</h3>
          <div class="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">产品类型：</label>
              <select v-model="selectedType" @change="currentPage = 1" class="filter-select">
                <option v-for="type in productTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">日期排序：</label>
              <select v-model="dateSortOrder" @change="currentPage = 1" class="filter-select">
                <option value="desc">最新到最旧</option>
                <option value="asc">最旧到最新</option>
              </select>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">产品名称</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">类型</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">累计金额</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">收益率</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">收益金额</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- loading or empty state rows -->
              <tr v-if="productsLoading">
                <td colspan="7" class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <p class="mt-2 text-gray-500">加载中...</p>
                </td>
              </tr>
              <tr v-else-if="filteredProducts.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-500">
                  暂无理财产品
                </td>
              </tr>
              
            
              <!-- 使用 v-for 循环渲染数据 -->
              <tr class="border-b hover:bg-gray-50" v-for="product in filteredProducts" :key="product.id">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :class="rowIconBgtype(product.product_type)">
                      <i :class="rowIcontype(product.product_type)"></i>
                    </div>
                    <span>{{ product.product_name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm">{{ product.product_type_name }}</td>
                <td class="py-3 px-4 text-sm">{{ product.purchase_date }}</td>
                <td class="py-3 px-4 text-sm text-right">¥{{ product.total_amount? product.total_amount.toLocaleString():'' }}</td>
                <td class="py-3 px-4 text-sm text-right text-green-500">{{ (product.return_rate * 100).toFixed(2) }}%</td>
                <td class="py-3 px-4 text-sm text-right text-green-500">¥{{ product.profit_amount?product.profit_amount.toLocaleString():'' }}</td>
                <td class="py-3 px-4 text-sm text-right">
                  <button class="text-blue-500 hover:text-blue-700">
                    详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t flex justify-between items-center">
          <div class="text-sm text-gray-500">显示{{ currentStartIndex }} — {{ currentEndIndex }} 条，共 {{ totalItems }} 条</div>
          <div class="flex items-center gap-2">
          <span class="text-gray-600">每页显示：</span>
            <select 
              v-model="pageSize" 
              @change="handlePageSizeChange"
              class="filter-select filter-select--small"
            >
              <option value="5">5 条</option>
              <option value="10">10 条</option>
              <option value="20">20 条</option>
            </select>
          </div>
          <div class="flex space-x-1">
            <!-- 上一页 -->
            <button 
              @click="currentPage == Math.max(1, currentPage-1)"
              class="w-8 h-8 flex items-center justify-center rounded border " :class="currentPage === 1?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'">
              <i class="fas fa-chevron-left"></i>
            </button>
            <!-- 页码列表 -->
            <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                    :class="['w-8 h-8 flex items-center justify-center rounded border',currentPage===page?'bg-blue-500 text-white':'hover:bg-gray-50']">
              {{ page }}
              </button>
              <!-- 省略号 -->
              <span v-if="showLeftEllipsis">...</span>
              <span v-if="showRightEllipsis">...</span>
            <!-- 下一页 -->
            <button 
              @click="currentPage = Math.min(totalPages, currentPage+1)"
              :class="currentPage === totalPages?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'"
              class="w-8 h-8 flex items-center justify-center rounded border">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    
      <!-- AI投资建议 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">AI投资建议</h3>
          <span class="badge badge-primary">智能分析</span>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-lightbulb text-blue-500"></i>
              </div>
              <div>
                <h4 class="font-medium">投资组合优化</h4>
                <p class="text-sm text-gray-600 mt-1">基于当前市场状况和您的风险偏好，建议将股票类资产比例从16%降低至12%，增加债券类资产比例至20%，以提高投资组合的稳定性。</p>
                <button class="text-blue-500 text-sm mt-2 flex items-center" @click="toMultiStrategy">
                  查看详情 <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-green-50 rounded-lg border border-green-100">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-chart-line text-green-500"></i>
              </div>
              <div>
                <h4 class="font-medium">定投策略建议</h4>
                <p class="text-sm text-gray-600 mt-1">建议对沪深300指数基金采用每周定投策略，而非每月定投，可降低市场波动风险，提高长期收益率约1.5%。</p>
                <button class="text-green-500 text-sm mt-2 flex items-center" @click="toFundStrategy">
                  应用建议 <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-yellow-500"></i>
              </div>
              <div>
                <h4 class="font-medium">（风险提示）投资认知避坑</h4>
                <p class="text-sm text-gray-600 mt-1">投资认知避坑自查清单，包含加仓/减仓/止盈判断标准+基金/股票专项</p>
                <button class="text-yellow-500 text-sm mt-2 flex items-center">
                  查看详情 <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加投资模态框 -->
      <InvestDetailModal 
        :show-add-invest-modal="showAddInvestModal" 
        @close-add-modal="closeAddModal">
      </InvestDetailModal>
    
    </div>
  </template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useProducts, useInvestOverview, useHistoricalReturns } from '../composables/useSupabase.js'
import InvestDetailModal from '../components/InvestDetailModal.vue'
import { useRouter }  from 'vue-router'
// 注册 Chart.js 组件
Chart.register(...registerables)
const investmentPortfolioChart = ref(null) //投资组合图表 (canvas ref DOM)
const portfolioChartInstance = ref(null) // 投资组合图表 Chart.js 实例
const investmentReturnsChart = ref(null) // 投资收益趋势图表 (canvas ref dom)
const returnsChartInstance = ref(null) // 投资收益趋势图表 Chart.js 实例

// 投资产品列表
// const investmentList = ref(investList)

// 根据productType动态切换列表首列icon css
const rowIcontype = computed(()=>{
   const typeStyles = {
    wealthManagementProduct: 'fas fa-building text-blue-500',
    indexFund: 'fas fa-chart-line text-green-500',
    MMF: 'fas fa-chart-pie text-purple-500',
    // stock: 'fas fa-coins text-red-500',
    QDII: 'fas fa-globe text-yellow-500'
   }
   return (productType) =>  typeStyles[productType] || ''
})
const rowIconBgtype = computed(()=>{
   const typeStyles = {
    wealthManagementProduct: 'bg-blue-100',
    indexFund: 'bg-green-100',
    MMF: 'bg-purple-100',
    // stock: 'bg-red-100',
    QDII: 'bg-yellow-100'
   }
   return (productType) =>  typeStyles[productType] || ''
})
// 显示模态框
const showAddInvestModal = ref(false)

const showAddModal= () => {
  showAddInvestModal.value = true
}
// 监听子组件状态
const closeAddModal= (status) => {
  showAddInvestModal.value = status
}
// 路由
const router = useRouter()
// 跳转基金定投策略页
const toFundStrategy = () => {
  router.push('fundStrategy')
}
// to 多维策略页
const toMultiStrategy = () => {
  router.push('multiStrategy')
}


// 获取后台数据库financial_products表数据
const { products, loading:productsLoading,fetchProducts } = useProducts(); 
// 获取后台数据库historical_returns表数据
const { historicalReturns,loading:returnsLoading,fetchHistoricalReturns } = useHistoricalReturns();  

// 初始化投资组合图表
const initializePortfolioChart = () => {
  if (portfolioChartInstance.value) {
    portfolioChartInstance.value.destroy()
  }
  // 按产品类型聚合：仅统计 purchase_date 属于最新月份的产品，生成 labels（类型名）和 data（每种类型的 total_amount 总和）
  const productTypeAggregation = computed(() => {
    const agg = {};
    const list = products.value || [];

    // 提取有效的 year-month 值（number: year*12 + monthIndex），并找到最大值表示最新月份
    const monthValues = list
      .map(p => {
        if (!p || !p.purchase_date) return null;
        const d = new Date(p.purchase_date);
        if (isNaN(d)) return null;
        return d.getFullYear() * 12 + d.getMonth();
      })
      .filter(v => v != null);

    // 如果没有任何有效日期，退回到统计所有 products
    let latestMonth = null;
    if (monthValues.length > 0) {
      latestMonth = Math.max(...monthValues);
    }

    // 计算聚合，只包含最新月份的数据（如果有）
    list.forEach(p => {
      const key = p.product_type_name || p.product_type || '其他';
      const amt = Number(p.total_amount) || 0;

      if (latestMonth == null) {
        // 无有效日期，统计全部
        agg[key] = (agg[key] || 0) + amt;
      } else {
        // 仅统计 purchase_date 在最新月份的项
        if (p && p.purchase_date) {
          const d = new Date(p.purchase_date);
          if (!isNaN(d) && (d.getFullYear() * 12 + d.getMonth()) === latestMonth) {
            agg[key] = (agg[key] || 0) + amt;
          }
        }
      }
    });

    return agg;
  });

const productTypeLabels = computed(() => Object.keys(productTypeAggregation.value));
const productTypeData = computed(() => productTypeLabels.value.map(k => productTypeAggregation.value[k] || 0));

  // 颜色池（按需扩展）
  // pastel palette for pie slices
  const colorPalette = ['#C4B5FD', '#A7F3D0', '#FBCFE8', '#FEF3C7', '#FECACA', '#BFDBFE', '#FDE68A', '#D1FAE5', '#FEE2E2', '#E5E7EB'];

  // 创建图表
  const ctx = investmentPortfolioChart.value && investmentPortfolioChart.value.getContext && investmentPortfolioChart.value.getContext('2d');
  if (!ctx) return;
  const bgColors = colorPalette.slice(0, productTypeLabels.value.length);
  // 将每个类型标签扩展为带金额的显示，例如 "指数基金 - ¥60,000"
  const formattedLabels = productTypeLabels.value.map((lbl, idx) => {
    const amt = Number(productTypeData.value[idx]) || 0;
    return `${lbl} - ¥${amt.toLocaleString('zh-CN')}`;
  });
  // 创建新的 Chart 实例
  portfolioChartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: formattedLabels,
      datasets: [{
        data: productTypeData.value,
        backgroundColor: bgColors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' }
      }
    }
  }); 
};

const initializeReturnsChart = () => {
  if (returnsChartInstance.value) {
    returnsChartInstance.value.destroy()
  }
  const sortedReturns = computed(() => [...historicalReturns.value].sort((a, b) => new Date(a.invest_month) - new Date(b.invest_month)))
  const returnLabels = sortedReturns.value.map(item => item.invest_month)
  const returnTotalAmount = sortedReturns.value.map(item => item.total_amount)
  const retuenProfitAmount = sortedReturns.value.map(item => item.total_returns)
  // 投资收益趋势图表（保持原有静态数据）
  const investmentReturnsCtx = investmentReturnsChart.value && investmentReturnsChart.value.getContext && investmentReturnsChart.value.getContext('2d')
  if (!investmentReturnsCtx)  return;
  
  // 创建新的 Chart 实例
  returnsChartInstance.value = new Chart(investmentReturnsCtx, {
      type: 'line',
      data: {
        labels: returnLabels,
        datasets: [{
          label: '投资总额',
          data: returnTotalAmount,
          borderColor: '#A78BFA',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          tension: 0.4,
          fill: true
        },{
          label: '累计收益',
          data: retuenProfitAmount,
          borderColor: '#86EFAC',
          backgroundColor: 'rgba(134, 239, 172, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
}


// 规范化并展示概览数据的便捷计算属性（防止字段缺失导致模版报错）
const overview = computed(() => (historicalReturns.value && historicalReturns.value.length ? historicalReturns.value[0] : {}));
const investmentTotalDisplay = computed(() => {
  const v = overview.value['total_amount'];
  return v != null ? `¥${v.toLocaleString()}` : '—';
});

const monthDeltaDisplay = computed(() => {
  const v = overview.value['month_change_pct'];
  if (v == null) return '';
  const sign = v > 0 ? '+' : '';
  return `${sign}${Number(v*100).toFixed(2)}%`;
});

const cumulativeProfitDisplay = computed(() => {
  const v = overview.value['total_returns'];
  return v != null ? `¥${v.toLocaleString()}` : '—';
});

const cumulativeReturnDisplay = computed(() => {
  const v = overview.value['rate_returns'];
  return v != null ? `${Number(v*100).toFixed(2)}%` : '—';
});

const monthProfitDisplay = computed(() => {
  const v = overview.value['month_returns'];
  return v != null ? `¥${v.toLocaleString()}` : '—';
});

const annualizedReturnDisplay = computed(() => {
  const v = overview.value['annual_return'];
  return v != null ? `${Number(v*100).toFixed(2)}%` : '—';
});
// 原始数值（用于判断正负），尽量使用原始字段，不做额外格式化
const monthDeltaRaw = computed(() => {
  const v = overview.value['month_change_pct'];
  return v == null ? null : Number(v);
});
const cumulativeProfitRaw = computed(() => {
  const v = overview.value['total_returns'];
  return v == null ? null : Number(v);
});
const cumulativeReturnRaw = computed(() => {
  const v = overview.value['rate_returns'];
  return v == null ? null : Number(v);
});
const monthProfitRaw = computed(() => {
  const v = overview.value['month_returns'];
  return v == null ? null : Number(v);
});
const annualizedReturnRaw = computed(() => {
  const v = overview.value['annual_return'];
  return v == null ? null : Number(v);
});

// 根据原始数值返回 class
const signClass = (raw) => {
  if (raw == null) return 'text-gray-500';
  if (raw > 0) return 'text-green-500';
  if (raw < 0) return 'text-red-500';
  return 'text-gray-500';
};

const monthDeltaClass = computed(() => signClass(monthDeltaRaw.value));
const cumulativeProfitClass = computed(() => signClass(cumulativeProfitRaw.value));
const cumulativeReturnClass = computed(() => signClass(cumulativeReturnRaw.value));
const monthProfitClass = computed(() => signClass(monthProfitRaw.value));
const annualizedReturnClass = computed(() => signClass(annualizedReturnRaw.value));
// const productsLoading = ref(true)
// const overviewLoading = ref(true)
onMounted(()=>{
  fetchHistoricalReturns().then(()=>{
    initializeReturnsChart();
  })
  fetchProducts().then(()=>{
    initializePortfolioChart();
  })
  
})

// 过滤与排序变量
const selectedType = ref('全部')
const dateSortOrder = ref('desc') // 默认按日期降序（新到旧）

const productTypes = computed(() => {
  const types = new Set((products.value || []).map(p => p.product_type_name || p.product_type || '其他'));
  return ['全部', ...types];
})

const filteredAndSorted = computed(() => {
  let list = (products.value || []).slice();

  if (selectedType.value && selectedType.value !== '全部') {
    list = list.filter(p => (p.product_type_name || p.product_type || '其他') === selectedType.value);
  }

  list.sort((a, b) => {
    const dateA = a.purchase_date ? new Date(a.purchase_date).getTime() : 0;
    const dateB = b.purchase_date ? new Date(b.purchase_date).getTime() : 0;
    if (isNaN(dateA) || isNaN(dateB)) return 0;
    return dateSortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return list;
})

 // 列表分页
 const currentPage = ref(1) // 当前页码
 const pageSize = ref(5) // 每页显示条数（默认5条）
  // 总条数
  const totalItems = computed(()=>filteredAndSorted.value.length)
  // 总页面数
  const totalPages = computed(()=>{
    return Math.max(1, Math.ceil(totalItems.value/pageSize.value))
  })
  // 当前页显示的产品
  const filteredProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return filteredAndSorted.value.slice(startIndex, endIndex);
  });
 // 当前页面起始编号
  const currentStartIndex = computed(()=>{
    return (currentPage.value - 1) * pageSize.value + 1
  })
  //当前页面终止编号
  const currentEndIndex = computed(()=>{
    return Math.min(totalItems.value, (currentPage.value - 1) * pageSize.value + pageSize.value)
  })
  // 处理每页显示条数变化
  const handlePageSizeChange = () => {
    currentPage.value = 1; // 重置到第一页
  };
  // 计算可见页码（最多显示5个页码，其余用省略号）
  const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5; // 最多显示5个页码

    // 总页数小于等于5时，显示所有页码
    if (totalPages.value <= maxVisible) {
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 总页数大于5时，显示当前页附近的页码
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage.value - half);
    let end = start + maxVisible - 1;

    // 调整结束页码，避免超过总页数
    if (end > totalPages.value) {
      end = totalPages.value;
      start = Math.max(1, end - maxVisible + 1);
    }

    // 添加页码
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });
  // 是否显示左侧省略号
  const showLeftEllipsis = computed(() => {
    return visiblePages.value.length > 0 && visiblePages.value[0] > 1;
  });

  // 是否显示右侧省略号
  const showRightEllipsis = computed(() => {
    return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < totalPages.value;
  });

// 监听分页数据变化，避免当前页超过总页数
watch([filteredAndSorted, pageSize], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

</script>
<style scoped>
/* 不可知进度条的左右平移动画 */
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
.animate-indeterminate {
  width: 50%; /* 条带可视宽度 */
  animation: indeterminate 1.6s cubic-bezier(.2,.7,.2,.9) infinite;
}

/* 细微亮度闪动动画，使进度条看起来更有活力 */
@keyframes pulse-bright {
  0% { filter: brightness(0.95); }
  50% { filter: brightness(1.12); }
  100% { filter: brightness(0.95); }
}
.pulse-bright {
  animation: pulse-bright 1.6s ease-in-out infinite;
}

/* 从左到右填充动画 */
@keyframes progress-fill {
  0% { width: 0%; }
  70% { width: 100%; }
  100% { width: 100%; }
}
.progress-fill {
  width: 0%;
  /* 使用 linear 让填充看起来持续平滑，时长可调节 */
  animation: progress-fill 2.2s linear infinite;
}

/* 光泽滑动效果 */
@keyframes shine-slide {
  0% { transform: translateX(-120%); opacity: 0; }
  10% { opacity: 0.12; }
  50% { transform: translateX(50%); opacity: 0.22; }
  100% { transform: translateX(220%); opacity: 0; }
}
.progress-shine {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-120%);
  animation: shine-slide 2.2s ease-in-out infinite;
}

/* 扁平化、简约的下拉选择样式 */
.filter-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #ffffff;
  border: 1px solid rgba(16,24,40,0.06);
  padding: 8px 36px 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  min-width: 140px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='%23777' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  box-shadow: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.06s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #A78BFA;
  box-shadow: 0 6px 18px rgba(167,139,250,0.12);
}

.filter-select--small {
  padding: 6px 34px 6px 10px;
  min-width: 96px;
  border-radius: 8px;
  font-size: 13px;
}

/* 下拉选项 hover / focus（浏览器对原生 option 支持有限，尝试提供浅紫背景） */
.filter-select option {
  background-color: #ffffff;
  color: #111827;
}
.filter-select option:hover,
.filter-select option:focus {
  background-color: rgba(215,199,255,0.12);
  color: #111827;
}

/* 紫色浮动点加载器 */
.loader-dots {
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-dots .dot {
  width: 12px;
  height: 12px;
  margin: 0 6px;
  border-radius: 50%;
  background: linear-gradient(180deg, #b7a8f1 0%, #c8a2fc 100%);
  box-shadow: 0 6px 18px rgba(167,139,250,0.10);
  transform-origin: center bottom;
  animation: dotWave 0.9s cubic-bezier(.45,.05,.55,.95) infinite;
}
.loader-dots .dot:nth-child(1) { animation-delay: 0s; }
.loader-dots .dot:nth-child(2) { animation-delay: 0.12s; }
.loader-dots .dot:nth-child(3) { animation-delay: 0.24s; }
@keyframes dotWave {
  0% { transform: translateY(0) scaleY(1); opacity: 0.9; }
  25% { transform: translateY(-8px) scaleY(1.06); opacity: 1; }
  50% { transform: translateY(0) scaleY(1); opacity: 0.92; }
  75% { transform: translateY(6px) scaleY(0.96); opacity: 0.95; }
 100% { transform: translateY(0) scaleY(1); opacity: 0.9; }
}

/* 将加载层上移到页面偏上位置 */
.loader-overlay {
  align-items: flex-start;
  padding-top: 18.5rem; /* 可微调 */
}

/* 加载文字：紫色渐变 + 微光脉动，与动画风格保持一致 */
.loader-text {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #8b5cf6; /* fallback */
  background: linear-gradient(90deg,#D6BCFA 0%, #dad2fb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 1px 0 rgba(167,139,250,0.06);
  animation: loaderTextPulse 1.8s ease-in-out infinite;
}

@keyframes loaderTextPulse {
  0% { opacity: 0.92; transform: translateY(0); filter: drop-shadow(0 6px 14px rgba(167,139,250,0.06)); }
  50% { opacity: 1; transform: translateY(-2px); filter: drop-shadow(0 10px 26px rgba(167,139,250,0.10)); }
  100% { opacity: 0.92; transform: translateY(0); filter: drop-shadow(0 6px 14px rgba(167,139,250,0.06)); }
}
</style>