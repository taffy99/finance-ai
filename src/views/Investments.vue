  <!-- 投资分析页面 -->
<template id="investments-page">
    <div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 class="text-xl font-bold">投资分析</h2>
          <p class="text-gray-500">管理和分析您的投资组合</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3">
          <button class="btn btn-outline" @click="showAddModal">
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
          <h3 class="text-2xl font-bold mt-1">¥250,000</h3>
          <p class="text-sm mt-2">较上月 <span class="text-green-500">+3.2%</span></p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm">累计收益</p>
          <h3 class="text-2xl font-bold mt-1 text-green-500">¥32,500</h3>
          <p class="text-sm mt-2">收益率 <span class="text-green-500">15%</span></p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm">本月收益</p>
          <h3 class="text-2xl font-bold mt-1 text-green-500">¥4,250</h3>
          <p class="text-sm mt-2">年化收益率 <span class="text-green-500">20.4%</span></p>
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
              <button class="btn btn-outline text-sm py-1 px-3">6月</button>
              <button class="btn btn-primary text-sm py-1 px-3">1年</button>
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
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">投资产品</h3>
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
              <tr>
                <!-- loading加载状态 -->
                <div v-if="productsLoading" class="col-span-full text-center py-12" style="position: relative; left: 200%;">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <p class="mt-2 text-gray-500">加载中...</p>
                </div>

                <!-- 空状态 -->
                <div v-else-if="filteredProducts.length === 0" class="col-span-full text-center py-12 text-gray-500" style="position: relative; left: 200%;">
                  暂无理财产品
                </div>
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
              class="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <h4 class="font-medium">风险提示</h4>
                <p class="text-sm text-gray-600 mt-1">您的股票投资组合中，科技行业占比过高(65%)，建议适当分散投资于其他行业，降低行业集中风险。</p>
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
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { investList, productTypeOptions} from '../mocks/investments.js'
import { useProducts } from '../composables/useSupabase.js'
import InvestDetailModal from '../components/InvestDetailModal.vue'
import { useRouter }  from 'vue-router'
// 注册 Chart.js 组件
Chart.register(...registerables)
const investmentPortfolioChart = ref(null) //投资组合图表
const investmentReturnsChart = ref(null) // 投资收益趋势图表
// 投资产品列表
const investmentList = ref(investList)

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
// const productsLoading = ref(true)
onMounted(()=>{
  // 页面加载时获取产品列表
  fetchProducts()
  // 投资组合图表
  const investmentPortfolioCtx = investmentPortfolioChart.value.getContext('2d')
  if (investmentPortfolioCtx) {
            new Chart(investmentPortfolioCtx, {
              type: 'pie',
              data: {
                labels: ['理财产品', '指数基金', '混合基金', '股票', 'QDII基金'],
                datasets: [{
                  data: [80000, 60000, 50000, 40000, 20000],
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#8B5CF6',
                    '#EF4444',
                    '#F59E0B'
                  ],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }
            });
          }
  
  // 投资收益趋势图表
  const investmentReturnsCtx = investmentReturnsChart.value.getContext('2d')
  if (investmentReturnsCtx) {
            new Chart(investmentReturnsCtx, {
              type: 'line',
              data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                  label: '投资总额',
                  data: [200000, 205000, 210000, 215000, 220000, 225000, 230000, 235000, 240000, 245000, 250000, 250000],
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
})
 // 列表分页
 const currentPage = ref(1) // 当前页码
 const pageSize = ref(5) // 每页显示条数（默认5条）
  // 总条数
  const totalItems = computed(()=>products.value.length)
  // 总页面数
  const totalPages = computed(()=>{
    return Math.ceil(totalItems.value/pageSize.value)
  })
  // 当前页显示的产品
  const filteredProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return products.value.slice(startIndex, endIndex);
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

</script>
<style scoped>
    
</style>