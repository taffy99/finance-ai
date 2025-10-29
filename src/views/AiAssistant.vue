 <!-- AI助手页面 -->
 <template id="ai-assistant-page">
    <div>

    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">AI理财助手</h2>
        <p class="text-gray-500">智能解答您的财务问题</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="btn btn-primary">
          <i class="fas fa-history mr-2"></i> 历史对话
        </button>
      </div>
    </div>
    
    <!-- AI对话区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 对话区域 -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
            <i class="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold">AI理财助手</h3>
            <p class="text-sm text-gray-500">实时在线，随时为您解答财务问题</p>
          </div>
        </div>
        
        <div class="h-96 overflow-y-auto mb-6 space-y-6" id="chat-container">
          <!-- AI消息 -->
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
              <i class="fas fa-robot"></i>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 max-w-[80%]">
              <p>您好！我是您的AI理财助手。请问有什么财务问题我可以帮您解答吗？</p>
            </div>
          </div>
          
          <!-- 用户消息 -->
          <div class="flex items-start justify-end">
            <div class="bg-blue-500 text-white rounded-lg p-4 max-w-[80%]">
              <p>我想了解如何优化我的投资组合</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
              <i class="fas fa-user text-gray-600"></i>
            </div>
          </div>
          
          <!-- AI消息 -->
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
              <i class="fas fa-robot"></i>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 max-w-[80%]">
              <p>根据您的投资数据，我为您提供以下优化建议：</p>
              <ol class="list-decimal pl-5 mt-2 space-y-1">
                <li>适当降低股票类资产比例，从当前的16%降至12%</li>
                <li>增加债券类资产至20%，提高投资组合稳定性</li>
                <li>对沪深300指数基金采用每周定投策略，降低市场波动风险</li>
                <li>分散股票投资行业，降低科技行业集中度</li>
              </ol>
              <p class="mt-2">您想了解哪一项建议的详细信息？</p>
            </div>
          </div>
        </div>
        
        <div class="relative">
          <input type="text" class="input-field pr-12" placeholder="输入您的财务问题...">
          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      <!-- AI建议列表 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">智能建议</h3>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-lightbulb text-blue-500"></i>
              </div>
              <div>
                <h4 class="font-medium">如何提高我的储蓄率？</h4>
                <p class="text-sm text-gray-600 mt-1">基于您的收入和支出情况，提供个性化的储蓄方案</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-all">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-chart-line text-green-500"></i>
              </div>
              <div>
                <h4 class="font-medium">适合我的投资产品推荐</h4>
                <p class="text-sm text-gray-600 mt-1">根据您的风险偏好和投资目标，推荐合适的投资产品</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-all">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-yellow-500"></i>
              </div>
              <div>
                <h4 class="font-medium">我的财务状况健康吗？</h4>
                <p class="text-sm text-gray-600 mt-1">全面评估您的财务健康状况，提供改善建议</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100 transition-all">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-calculator text-purple-500"></i>
              </div>
              <div>
                <h4 class="font-medium">如何制定我的退休计划？</h4>
                <p class="text-sm text-gray-600 mt-1">根据您的年龄和收入，制定合理的退休储蓄计划</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-all">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-shield-alt text-red-500"></i>
              </div>
              <div>
                <h4 class="font-medium">如何应对突发财务风险？</h4>
                <p class="text-sm text-gray-600 mt-1">建立应急基金，应对突发财务状况</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>  
  </template>