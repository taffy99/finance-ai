<!-- 预算管理页面 -->
<template id="budget-page">
    <div>

   
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">预算管理</h2>
        <p class="text-gray-500">设置和跟踪您的预算目标</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button class="btn btn-outline">
          <i class="fas fa-calendar-alt mr-2"></i> 2023年6月
        </button>
        <button class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i> 添加预算
        </button>
      </div>
    </div>
    
    <!-- 预算概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card p-6">
        <p class="text-gray-500 text-sm">总预算</p>
        <h3 class="text-2xl font-bold mt-1">¥12,000</h3>
        <p class="text-sm mt-2">较上月 <span class="text-green-500">+5%</span></p>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">已使用</p>
        <h3 class="text-2xl font-bold mt-1 text-red-500">¥8,160</h3>
        <p class="text-sm mt-2">占总预算 <span class="text-red-500">68%</span></p>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">剩余预算</p>
        <h3 class="text-2xl font-bold mt-1 text-green-500">¥3,840</h3>
        <p class="text-sm mt-2">占总预算 <span class="text-green-500">32%</span></p>
      </div>
    </div>
    
    <!-- 预算进度卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <!-- 日常消费预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <i class="fas fa-shopping-bag text-blue-500"></i>
            </div>
            <div>
              <h4 class="font-medium">日常消费</h4>
              <p class="text-sm text-gray-500">¥1,800 / ¥2,500</p>
            </div>
          </div>
          <span class="text-lg font-bold text-blue-500">72%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-blue-500" style="width: 72%"></div>
        </div>
      </div>
      
      <!-- 餐饮预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <i class="fas fa-utensils text-yellow-500"></i>
            </div>
            <div>
              <h4 class="font-medium">餐饮</h4>
              <p class="text-sm text-gray-500">¥1,200 / ¥2,000</p>
            </div>
          </div>
          <span class="text-lg font-bold text-yellow-500">60%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-yellow-500" style="width: 60%"></div>
        </div>
      </div>
      
      <!-- 交通预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <i class="fas fa-car text-purple-500"></i>
            </div>
            <div>
              <h4 class="font-medium">交通</h4>
              <p class="text-sm text-gray-500">¥800 / ¥1,000</p>
            </div>
          </div>
          <span class="text-lg font-bold text-purple-500">80%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-purple-500" style="width: 80%"></div>
        </div>
      </div>
      
      <!-- 住房预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <i class="fas fa-home text-red-500"></i>
            </div>
            <div>
              <h4 class="font-medium">住房</h4>
              <p class="text-sm text-gray-500">¥3,500 / ¥3,500</p>
            </div>
          </div>
          <span class="text-lg font-bold text-red-500">100%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-red-500" style="width: 100%"></div>
        </div>
      </div>
      
      <!-- 娱乐预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <i class="fas fa-film text-green-500"></i>
            </div>
            <div>
              <h4 class="font-medium">娱乐</h4>
              <p class="text-sm text-gray-500">¥400 / ¥1,000</p>
            </div>
          </div>
          <span class="text-lg font-bold text-green-500">40%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-green-500" style="width: 40%"></div>
        </div>
      </div>
      
      <!-- 购物预算 -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
              <i class="fas fa-shopping-cart text-pink-500"></i>
            </div>
            <div>
              <h4 class="font-medium">购物</h4>
              <p class="text-sm text-gray-500">¥460 / ¥1,000</p>
            </div>
          </div>
          <span class="text-lg font-bold text-pink-500">46%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill bg-pink-500" style="width: 46%"></div>
        </div>
      </div>
    </div>
    
    <!-- 预算趋势图表 -->
    <div class="card p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">预算趋势</h3>
        <div class="flex space-x-2">
          <button class="btn btn-outline text-sm py-1 px-3">月</button>
          <button class="btn btn-primary text-sm py-1 px-3">季</button>
          <button class="btn btn-outline text-sm py-1 px-3">年</button>
        </div>
      </div>
      <div class="chart-container">
        <canvas ref="budgetTrendChart"></canvas>
      </div>
    </div>
    
    <!-- 预算调整建议 -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">AI预算调整建议</h3>
        <span class="badge badge-primary">智能分析</span>
      </div>
      <div class="space-y-4">
        <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-500"></i>
            </div>
            <div>
              <h4 class="font-medium">住房预算已超支</h4>
              <p class="text-sm text-gray-600 mt-1">您的住房预算已完全使用，建议检查是否有不必要的住房支出，或考虑调整下月预算分配。</p>
              <button class="text-yellow-500 text-sm mt-2 flex items-center">
                调整预算 <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <i class="fas fa-lightbulb text-blue-500"></i>
            </div>
            <div>
              <h4 class="font-medium">日常消费优化</h4>
              <p class="text-sm text-gray-600 mt-1">您的日常消费预算使用了72%，但距离月末还有10天。建议接下来控制日常开支，避免超支。</p>
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
              <h4 class="font-medium">预算分配优化</h4>
              <p class="text-sm text-gray-600 mt-1">基于您的消费习惯，建议增加餐饮预算10%，减少娱乐预算5%，以更好地匹配您的实际需求。</p>
              <button class="text-green-500 text-sm mt-2 flex items-center">
                应用建议 <i class="fas fa-chevron-right ml-1 text-xs"></i>
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
  const budgetTrendChart = ref(null) // 预算趋势图表
  onMounted(()=>{
    // 预算趋势图表
    const budgetTrendCtx = budgetTrendChart.value.getContext('2d')
    if (budgetTrendCtx) {
            new Chart(budgetTrendCtx, {
              type: 'bar',
              data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                  {
                    label: '预算',
                    data: [11000, 11500, 11200, 12000, 11800, 12000],
                    backgroundColor: '#3B82F6',
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                  },
                  {
                    label: '支出',
                    data: [7800, 8200, 7500, 8900, 7700, 8340],
                    backgroundColor: '#EF4444',
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
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
  })
  
  </script>