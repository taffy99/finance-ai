 <!-- 仪表盘页面 -->
 <template id="dashboard-page">
    <div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- 总收入卡片 -->
        <div class="card p-6">
            <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">总收入</p>
                <h3 class="text-2xl font-bold mt-1">¥12,580</h3>
                <p class="text-green-500 text-sm mt-2 flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> 12.5% <span class="text-gray-500 ml-1">较上月</span>
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i class="fas fa-arrow-down text-green-500"></i>
            </div>
            </div>
        </div>
        
        <!-- 总支出卡片 -->
        <div class="card p-6">
            <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">总支出</p>
                <h3 class="text-2xl font-bold mt-1">¥8,340</h3>
                <p class="text-red-500 text-sm mt-2 flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> 8.2% <span class="text-gray-500 ml-1">较上月</span>
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i class="fas fa-arrow-up text-red-500"></i>
            </div>
            </div>
        </div>
        
        <!-- 结余卡片 -->
        <div class="card p-6">
            <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">本月结余</p>
                <h3 class="text-2xl font-bold mt-1">¥4,240</h3>
                <p class="text-green-500 text-sm mt-2 flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> 25.3% <span class="text-gray-500 ml-1">较上月</span>
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-wallet text-blue-500"></i>
            </div>
            </div>
        </div>
        
        <!-- 预算使用卡片 -->
        <div class="card p-6">
            <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">预算使用</p>
                <h3 class="text-2xl font-bold mt-1">68%</h3>
                <p class="text-yellow-500 text-sm mt-2 flex items-center">
                <i class="fas fa-exclamation-circle mr-1"></i> <span class="text-gray-500 ml-1">还有10天</span>
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <i class="fas fa-chart-pie text-yellow-500"></i>
            </div>
            </div>
        </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 收支趋势图表 -->
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
            <canvas ref="incomeExpenseChart"></canvas>
            </div>
        </div>
        
        <!-- 支出分类图表 -->
        <div class="card p-6">
            <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">支出分类</h3>
            <button class="text-blue-500 text-sm">查看详情</button>
            </div>
            <div class="chart-container">
            <canvas ref="expenseCategoryChart"></canvas>
            </div>
        </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 最近交易 -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">最近交易</h3>
          <router-link to="/transactions" class="text-blue-500 text-sm">查看全部</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">描述</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">分类</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">2023-06-15</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <i class="fas fa-shopping-bag text-blue-500"></i>
                    </div>
                    <span>超市购物</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm"><span class="badge badge-info">日常消费</span></td>
                <td class="py-3 px-4 text-sm text-right text-red-500">-¥358</td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">2023-06-14</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <i class="fas fa-salary text-green-500"></i>
                    </div>
                    <span>工资收入</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm"><span class="badge badge-success">工资</span></td>
                <td class="py-3 px-4 text-sm text-right text-green-500">+¥10,000</td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">2023-06-12</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <i class="fas fa-utensils text-yellow-500"></i>
                    </div>
                    <span>餐厅用餐</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm"><span class="badge badge-warning">餐饮</span></td>
                <td class="py-3 px-4 text-sm text-right text-red-500">-¥245</td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">2023-06-10</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <i class="fas fa-car text-purple-500"></i>
                    </div>
                    <span>加油</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm"><span class="badge badge-info">交通</span></td>
                <td class="py-3 px-4 text-sm text-right text-red-500">-¥300</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">2023-06-08</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <i class="fas fa-home text-blue-500"></i>
                    </div>
                    <span>房租</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm"><span class="badge badge-danger">住房</span></td>
                <td class="py-3 px-4 text-sm text-right text-red-500">-¥3,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- AI智能建议 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">AI智能建议</h3>
          <span class="badge badge-primary">今日</span>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-lightbulb text-blue-500"></i>
              </div>
              <div>
                <h4 class="font-medium">餐饮支出偏高</h4>
                <p class="text-sm text-gray-600 mt-1">您本月餐饮支出已超过预算20%，建议适当减少外卖和餐厅用餐。</p>
                <button class="text-blue-500 text-sm mt-2 flex items-center">
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
                <h4 class="font-medium">投资机会</h4>
                <p class="text-sm text-gray-600 mt-1">基于您的风险偏好，推荐考虑指数基金定投，平均年化收益率可达8-12%。</p>
                <button class="text-green-500 text-sm mt-2 flex items-center">
                  查看详情 <i class="fas fa-chevron-right ml-1 text-xs"></i>
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
                <h4 class="font-medium">预算预警</h4>
                <p class="text-sm text-gray-600 mt-1">娱乐预算将在7天内用完，建议控制接下来的娱乐支出。</p>
                <button class="text-yellow-500 text-sm mt-2 flex items-center">
                  调整预算 <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/ai-assistant" class="block text-center py-3 mt-4 text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50">
          查看更多AI建议
        </router-link>
      </div>
    </div>
  </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  // 注册 Chart.js 组件
  Chart.register(...registerables)
  const incomeExpenseChart = ref(null) //收支趋势图表
  const expenseCategoryChart = ref(null) // 支出分类图表
  onMounted(()=>{
    // 收支趋势图表
    const incomeExpenseCtx = incomeExpenseChart.value.getContext('2d')
    if (incomeExpenseCtx) {
            new Chart(incomeExpenseCtx, {
              type: 'line',
              data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                  {
                    label: '收入',
                    data: [10500, 11200, 9800, 12500, 11800, 12580],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                  },
                  {
                    label: '支出',
                    data: [7800, 8200, 7500, 8900, 7700, 8340],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
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
    
    // 支出分类图表
    const expenseCategoryCtx = expenseCategoryChart.value.getContext('2d')
    if (expenseCategoryCtx) {
            new Chart(expenseCategoryCtx, {
              type: 'doughnut',
              data: {
                labels: ['住房', '餐饮', '日常消费', '交通', '娱乐', '其他'],
                datasets: [{
                  data: [3500, 1200, 1800, 800, 400, 640],
                  backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#7C3AED',
                    '#8B5CF6',
                    '#10B981',
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
  <style scoped>

  </style>