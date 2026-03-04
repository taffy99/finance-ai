  <!-- 财务报告页面 -->
  <template id="reports-page">
    <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">财务报告</h2>
        <p class="text-gray-500">查看和导出您的财务报告</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <div class="relative">
          <select class="input-field appearance-none pr-8">
            <option>2023年6月</option>
            <option>2023年5月</option>
            <option>2023年4月</option>
            <option>2023年第一季度</option>
            <option>2023年第二季度</option>
            <option>2022年</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
        <button class="btn btn-primary">
          <i class="fas fa-download mr-2"></i> 导出报告
        </button>
      </div>
    </div>
    
    <!-- 财务概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="card p-6">
        <p class="text-gray-500 text-sm">总收入</p>
        <h3 class="text-2xl font-bold mt-1 text-green-500">¥12,580</h3>
        <p class="text-sm mt-2">较上期 <span class="text-green-500">+12.5%</span></p>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">总支出</p>
        <h3 class="text-2xl font-bold mt-1 text-red-500">¥8,340</h3>
        <p class="text-sm mt-2">较上期 <span class="text-red-500">+8.2%</span></p>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">结余</p>
        <h3 class="text-2xl font-bold mt-1 text-blue-500">¥4,240</h3>
        <p class="text-sm mt-2">较上期 <span class="text-green-500">+25.3%</span></p>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">储蓄率</p>
        <h3 class="text-2xl font-bold mt-1 text-blue-500">33.7%</h3>
        <p class="text-sm mt-2">较上期 <span class="text-green-500">+3.2%</span></p>
      </div>
    </div>
    
    <!-- 财务趋势图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 收支趋势 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">收支趋势</h3>
          <div class="flex space-x-2">
            <button class="btn btn-outline text-sm py-1 px-3">月</button>
            <button class="btn btn-primary text-sm py-1 px-3">季</button>
            <button class="btn btn-outline text-sm py-1 px-3">年</button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="financialTrendChart"></canvas>
        </div>
      </div>
      
      <!-- 支出分类占比 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">支出分类占比</h3>
          <button class="text-blue-500 text-sm">查看详情</button>
        </div>
        <div class="chart-container">
          <canvas ref="expenseDistributionChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- 财务健康评分 -->
    <div class="card p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">财务健康评分</h3>
        <div class="flex items-center">
          <span class="text-2xl font-bold text-blue-500 mr-2">82</span>
          <span class="badge badge-success">良好</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-wallet text-blue-500 text-2xl"></i>
          </div>
          <h4 class="font-medium">储蓄健康</h4>
          <p class="text-2xl font-bold mt-1">85</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-chart-line text-green-500 text-2xl"></i>
          </div>
          <h4 class="font-medium">投资健康</h4>
          <p class="text-2xl font-bold mt-1">78</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-balance-scale text-yellow-500 text-2xl"></i>
          </div>
          <h4 class="font-medium">收支平衡</h4>
          <p class="text-2xl font-bold mt-1">88</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-shield-alt text-purple-500 text-2xl"></i>
          </div>
          <h4 class="font-medium">风险抵抗</h4>
          <p class="text-2xl font-bold mt-1">72</p>
        </div>
      </div>
    </div>
    
    <!-- AI财务分析 -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">AI财务分析</h3>
        <span class="badge badge-primary">智能分析</span>
      </div>
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <i class="fas fa-lightbulb text-blue-500"></i>
            </div>
            <div>
              <h4 class="font-medium">财务状况总结</h4>
              <p class="text-sm text-gray-600 mt-1">您的财务状况总体良好，储蓄率达到33.7%，高于同龄人群平均水平。收支结构合理，但餐饮支出有上升趋势，建议适当控制。投资组合收益率稳定，但风险分散度有待提高。</p>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-green-50 rounded-lg border border-green-100">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
              <i class="fas fa-chart-line text-green-500"></i>
            </div>
            <div>
              <h4 class="font-medium">财务改善建议</h4>
              <p class="text-sm text-gray-600 mt-1">1. 增加应急基金至3-6个月生活费水平<br>2. 优化投资组合，增加债券类资产比例<br>3. 考虑增加每月定投金额，提高长期财富积累效率<br>4. 控制餐饮支出，建议每月不超过收入的15%</p>
              <button class="text-green-500 text-sm mt-2 flex items-center">
                查看详细建议 <i class="fas fa-chevron-right ml-1 text-xs"></i>
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
              <h4 class="font-medium">潜在风险提示</h4>
              <p class="text-sm text-gray-600 mt-1">1. 您的投资组合中科技行业占比过高，存在行业集中风险<br>2. 应急基金不足3个月生活费，建议尽快补充<br>3. 信用卡债务有上升趋势，建议控制信用卡使用频率</p>
              <button class="text-yellow-500 text-sm mt-2 flex items-center">
                查看风险详情 <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  // 注册 Chart.js 组件
  Chart.register(...registerables)
  const financialTrendChart = ref(null) //财务趋势图表
  const expenseDistributionChart = ref(null) // 支出分布图表
  onMounted(()=>{
    // 财务趋势图表
    const financialTrendCtx = financialTrendChart.value.getContext('2d')
    if (financialTrendCtx) {
            new Chart(financialTrendCtx, {
              type: 'line',
              data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                  {
                    label: '收入',
                    data: [10500, 11200, 9800, 12500, 11800, 12580],
                    borderColor: '#10B981',
                    backgroundColor: 'transparent',
                    tension: 0.4
                  },
                  {
                    label: '支出',
                    data: [7800, 8200, 7500, 8900, 7700, 8340],
                    borderColor: '#EF4444',
                    backgroundColor: 'transparent',
                    tension: 0.4
                  },
                  {
                    label: '结余',
                    data: [2700, 3000, 2300, 3600, 4100, 4240],
                    borderColor: '#7C3AED',
                    backgroundColor: 'transparent',
                    tension: 0.4
                  }
                ]
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
                    beginAtZero: true
                  }
                }
              }
            });
          }
    
    // 支出分布图表
    const expenseDistributionCtx = expenseDistributionChart.value.getContext('2d')
    if (expenseDistributionCtx) {
            new Chart(expenseDistributionCtx, {
              type: 'doughnut',
              data: {
                labels: ['住房', '餐饮', '日常消费', '交通', '娱乐', '购物', '其他'],
                datasets: [{
                  data: [3500, 1200, 1800, 800, 400, 460, 180],
                  backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#7C3AED',
                    '#8B5CF6',
                    '#10B981',
                    '#EC4899',
                    '#6B7280'
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
                },
                cutout: '70%'
              }
            });
          }
  })
  
  </script>