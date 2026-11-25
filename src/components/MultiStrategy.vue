<template>
  <div>
      <!-- 筛选条件区 -->
      <section class="mb-10 bg-white rounded-xl shadow-sm p-6 transform hover:shadow-lg transition-all duration-300">
        <div class="flex items-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
            <i class="fa fa-filter text-primary text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold">基金与时间筛选</h2>
            <p class="text-neutral text-sm mt-1">选择目标基金和分析时间范围</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 基金选择 -->
          <div class="group">
            <label class="block text-neutral mb-2 font-medium flex items-center">
              <i class="fa fa-chart-line mr-2 text-primary/70"></i>
              选择基金
            </label>
            <div class="relative" ref="dropdownContainer">
              <!-- 搜索输入框 -->
              <div 
                class="appearance-none bg-light border-2 border-gray-100 rounded-xl py-3.5 px-5 w-full text-lg
                      transition-all duration-300 ease-in-out cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                      group-hover:border-primary/30 flex justify-between items-center"
                @click="toggleDropdown"
              >
                <span v-if="selectedMarketLabel">{{ selectedMarketLabel }}</span>
                <span v-else class="text-gray-400">请选择基金</span>
                <i class="fa" :class="isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              
              <!-- 下拉菜单 -->
              <div
                v-if="isDropdownOpen"
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <!-- 搜索框 -->
                <div class="p-2 border-b border-gray-100">
                  <input
                    ref="searchInput"
                    v-model="fundCodeInput"
                    type="text"
                    placeholder="输入基金代码或名称进行筛选"
                    class="appearance-none bg-light border border-gray-200 rounded-lg py-2 px-3 w-full text-base
                          focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
                    @input="onSearchInput"
                  />
                </div>
                
                <!-- 选项列表 -->
                <ul class="py-1">
                  <li
                    v-for="option in filteredMarketOptions"
                    :key="option.value"
                    class="px-4 py-2 hover:bg-primary/10 cursor-pointer flex justify-between items-center"
                    @click="selectMarket(option)"
                  >
                    <span>{{ option.label }}</span>
                    <span class="text-gray-500 text-sm">{{ option.value }}</span>
                  </li>
                  <li
                    v-if="matchingMarketOptions.length > filteredMarketOptions.length"
                    class="px-4 py-2 text-sm text-gray-500"
                  >
                    仅显示前 {{ filteredMarketOptions.length }} 条，请输入基金代码或名称缩小范围
                  </li>
                  <li v-if="filteredMarketOptions.length === 0" class="px-4 py-2 text-gray-500">
                    未找到匹配的基金
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="group">
            <label class="block text-neutral mb-2 font-medium flex items-center">
              <i class="fa fa-calendar-plus mr-2 text-primary/70"></i>
            选择开始日期
            </label>
            <div class="relative">
              <MonthPicker
                v-model="startDate"
                :min="minDate"
                :max="endDate"
                placeholder="选择开始日期"
              />
            </div>
            <p class="mt-1.5 text-xs text-neutral/70">可选范围：{{ minDate.slice(0,7) }} 至 {{ maxDate.slice(0,7) }}</p>
          </div>
          
          <!-- 结束时间 -->
          <div class="group">
            <label class="block text-neutral mb-2 font-medium flex items-center">
              <i class="fa fa-calendar-minus mr-2 text-primary/70"></i>
              选择结束日期
            </label>
            <div class="relative">
              <MonthPicker
                v-model="endDate"
                :min="minDate"
                :max="maxDate"
                placeholder="选择结束日期"
              />
            </div>
            <p class="mt-1.5 text-xs text-neutral/70">可选范围：{{ minDate.slice(0,7) }} 至 {{ maxDate.slice(0,7) }}</p>
          </div>
        </div>
        
        <div class="mt-8 flex justify-center">
          <button 
            @click="analyzeMarket" 
            class="group bg-primary hover:bg-primary/90 text-white font-medium py-4 px-10 rounded-xl 
                   shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 
                   transform hover:-translate-y-0.5
                   transition-all duration-300 flex items-center"
            :disabled="isLoading"
            :class="{'opacity-75 cursor-not-allowed': isLoading}"
          >
            <i class="fa fa-bar-chart mr-3 group-hover:scale-110 transition-transform duration-300"></i> 
            <span v-if="!isLoading" class="text-lg">分析基金趋势与策略</span>
            <span v-if="isLoading" class="flex items-center text-lg">
              <i class="fa fa-spinner fa-spin mr-3"></i> 加载中...
            </span>
          </button>
        </div>
      </section>

      <!-- 基金趋势概览 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 ">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold" id="trend-title">
                {{ currentMarketInfo.fullName }} ({{ formatDate(startDate) }}-{{ formatDate(endDate) }}) 基金趋势分析
              </h2>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-4">
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-bull mr-2"></span>
                <span>牛市</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-bear mr-2"></span>
                <span>熊市</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-volatile mr-2"></span>
                <span>震荡市</span>
              </div>
            </div>
           </div>
          
          <!-- 趋势图表 -->
          <div class="h-80 mb-8">
            <canvas ref="marketTrendCanvas"></canvas>
          </div>
          
          <!-- 趋势时间线 -->
          <div class="relative pl-6 border-l border-gray-200 ml-3">
            <h3 class="text-lg font-semibold mb-6">关键趋势时间段分析</h3>
            
            <div id="trend-timeline" class="space-y-8">
              <div 
                class="relative" 
                v-for="(trend, index) in filteredTrends" 
                :key="index"
              >
                <div class="timeline-dot" :class="getTrendColorClass(trend.type)"></div>
                <div class="timeline-line" :class="getTrendLineColorClass(trend.type)"></div>
                <div>
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 class="font-semibold">
                      {{ formatDate(trend.start) }} - {{ formatDate(trend.end) }}：{{ getTrendTypeName(trend.type) }}
                    </h4>
                    <span 
                      class="inline-block px-3 py-1 text-sm rounded-full mt-1 md:mt-0"
                      :class="getTrendBadgeClass(trend.type)"
                    >
                      指数{{ trend.change }}
                    </span>
                  </div>
                  <p class="text-neutral text-sm">
                    {{ trend.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 定投收益计算器 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">定投收益计算器</h2>       
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           
              <div class="space-y-6">
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium">定投目标金额 (元)</label>
                  <input 
                    type="number" 
                    v-model.number="targetAmount" 
                    min="1000" 
                    step="1000"
                    class="bg-light border border-gray-200 rounded-lg py-3 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full text-lg"
                  >
                </div>
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium">每期定投金额 (元)</label>
                  <input 
                    type="number" 
                    v-model.number="monthlyInvestment" 
                    min="100" 
                    step="100"
                    class="bg-light border border-gray-200 rounded-lg py-3 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full text-lg"
                  >
                </div>
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium">定投频率</label>
                  <div class="grid grid-cols-3 gap-3">
                    <label class="flex items-center p-3 bg-light rounded-lg cursor-pointer hover:bg-light/70 transition-colors">
                      <input type="radio" name="freq" value="weekly" v-model="contributionFrequency" class="mr-2"> 每周
                    </label>
                    <label class="flex items-center p-3 bg-light rounded-lg cursor-pointer hover:bg-light/70 transition-colors">
                      <input type="radio" name="freq" value="biweekly" v-model="contributionFrequency" class="mr-2"> 双周
                    </label>
                    <label class="flex items-center p-3 bg-light rounded-lg cursor-pointer hover:bg-light/70 transition-colors">
                      <input type="radio" name="freq" value="monthly" v-model="contributionFrequency" class="mr-2"> 每月
                    </label>
                  </div>
                </div>
                
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium flex items-center">
                    <i class="fa fa-calendar-plus mr-2 text-primary/70"></i>
                    定投开始日期
                  </label>
                  <div class="relative">
                    <MonthPicker
                      v-model="calculatorStartDate"
                      :min="startDate"
                      :max="endDate"
                      placeholder="选择定投开始月份"
                    />
                  </div>
                  <p class="mt-1.5 text-xs text-neutral/70">开始时间不能早于分析区间</p>
                </div>
                
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium flex items-center">
                    <i class="fa fa-calendar-minus mr-2 text-primary/70"></i>
                    定投结束日期
                  </label>
                  <div class="relative">
                    <MonthPicker
                      v-model="calculatorEndDate"
                      :min="calculatorStartDate"
                      :max="endDate"
                      placeholder="选择定投结束月份"
                      position="top"
                    />
                  </div>
                  <p class="mt-1.5 text-xs text-neutral/70">结束时间不能晚于分析区间</p>
                </div>
                
                
                <div class="group">
                  <label class="block text-neutral mb-2 font-medium">
                    <span>定投策略选择</span>
                  </label>
                  <div class="grid grid-cols-2 gap-4">
                    <label class="flex items-center p-4 bg-light rounded-lg cursor-pointer hover:bg-light/70 transition-colors">
                      <input 
                        type="radio" 
                        name="strategy" 
                        value="normal" 
                        v-model="selectedStrategy"
                        class="mr-3"
                      >
                      <span>普通定投</span>
                    </label>
                    <label class="flex items-center p-4 bg-light rounded-lg cursor-pointer hover:bg-light/70 transition-colors">
                      <input 
                        type="radio" 
                        name="strategy" 
                        value="optimized" 
                        v-model="selectedStrategy"
                        class="mr-3"
                      >
                      <span>智能优化定投</span>
                    </label>
                  </div>
                  <div v-if="selectedStrategy === 'normal'" class="mt-4 p-4 bg-light/70 rounded-lg border border-gray-100 text-sm text-neutral-700 leading-relaxed">
                    <div class="font-medium mb-2 text-neutral-900">普通定投策略说明</div>
                    <p>按设定的基础金额，在每个定投周期固定买入，不根据市场涨跌调整投入金额，适合长期坚持和分散择时风险。</p>
                  </div>
                  <div v-if="selectedStrategy === 'optimized'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-bull/5 border border-bull/20 rounded-lg">
                      <div class="font-medium text-bull mb-3">下跌 → 加仓</div>
                      <div class="grid grid-cols-2 gap-3">
                        <label class="block text-sm text-neutral">
                          <span class="block mb-1">下跌触发阈值（%）</span>
                          <input v-model.number="downThreshold" type="number" min="0.01" max="100" step="0.1"
                            class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30">
                        </label>
                        <label class="block text-sm text-neutral">
                          <span class="block mb-1">加仓比例（%）</span>
                          <input v-model.number="increasePercent" type="number" min="0" max="100" step="1"
                            class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30">
                        </label>
                      </div>
                    </div>
                    <div class="p-4 bg-bear/5 border border-bear/20 rounded-lg">
                      <div class="font-medium text-bear mb-3">上涨 → 减仓</div>
                      <div class="grid grid-cols-2 gap-3">
                        <label class="block text-sm text-neutral">
                          <span class="block mb-1">上涨触发阈值（%）</span>
                          <input v-model.number="upThreshold" type="number" min="0.01" max="100" step="0.1"
                            class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30">
                        </label>
                        <label class="block text-sm text-neutral">
                          <span class="block mb-1">减仓比例（%）</span>
                          <input v-model.number="decreasePercent" type="number" min="0" max="100" step="1"
                            class="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30">
                        </label>
                      </div>
                    </div>
                  </div>
                  <div v-if="selectedStrategy === 'optimized'" class="mt-4 p-4 bg-light/70 rounded-lg border border-gray-100 text-sm text-neutral-700 leading-relaxed">
                    <div class="font-medium mb-2 text-neutral-900">智能优化定投策略说明</div>
                    <p>根据本期相对上期的价格变化动态调整投入金额：</p>
                    <div class="mt-2 pl-4">
                      • 下跌达到 {{ downThreshold }}% 时，本期投入增加 {{ increasePercent }}%
                    </div>
                    <div class="mt-1 pl-4">
                      • 上涨达到 {{ upThreshold }}% 时，本期投入减少 {{ decreasePercent }}%
                    </div>
                    <div class="mt-2 text-xs text-neutral-500">以上参数会同时应用于收益计算、预警提示和策略回测。</div>
                  </div>
                </div>

                <button 
                  @click="calculateReturns" 
                  class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <i class="fa fa-calculator mr-2"></i> 计算收益
                </button>
              </div> 
              <div v-if="showCalculationResults" class="bg-light/50 rounded-lg p-6">
                <h3 class="font-semibold text-lg mb-6">收益计算结果</h3>
                
                <!-- 加仓/减仓预警提示 -->
                <div v-if="showAlert" class="mb-6">
                  <div class="p-4 rounded-lg" :class="investmentAlert.type === 'increase' || investmentAlert.type === 'normal'? 'bg-bull/10 border-l-4 border-bull' : 'bg-bear/10 border-l-4 border-bear'">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <i class="fa" :class="investmentAlert.type === 'normal'?'fa-info-circle text-bull text-2xl':investmentAlert.type === 'increase' ? 'fa-arrow-circle-up text-bull text-2xl' : 'fa-arrow-circle-down text-bear text-2xl'"></i>
                      </div>
                      <div class="ml-3 flex-grow">
                        <h4 class="font-medium text-base" :class="investmentAlert.type === 'increase'||investmentAlert.type === 'normal' ? 'text-bull' : 'text-bear'">
                          {{ investmentAlert.type === 'normal'?'建议保持':investmentAlert.type === 'increase' ? '建议加仓' : '建议减仓' }}
                          <span v-if="investmentAlert.level" class="ml-2 text-xs px-2 py-1 rounded-full bg-white" :class="investmentAlert.level === 'strong' ? 'text-danger' : investmentAlert.level === 'medium' ? 'text-warning' : 'text-info'">
                            {{ investmentAlert.level === 'strong' ? '强烈' : investmentAlert.level === 'medium' ? '中等' : '温和' }}
                          </span>
                        </h4>
                        <p class="text-sm mt-1 text-neutral" v-if="investmentAlert.type === 'normal'">
                          {{ investmentAlert.reason }}，建议维持目前定投金额 <strong>¥{{ formatNumber(investmentAlert.amount) }}</strong>
                        </p>
                         <p class="text-sm mt-1 text-neutral" v-else>
                          {{ investmentAlert.reason }}，建议调整下期定投金额至 <strong>¥{{ formatNumber(investmentAlert.amount) }}</strong>
                        </p>
                        <div class="mt-2 text-xs text-neutral">
                          上期价格：¥{{ investmentAlert.prevPrice }} | 当期价格：¥{{ investmentAlert.currentPrice }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-4 rounded-lg">
                      <p class="text-neutral text-sm">定投总期数</p>
                      <p class="text-xl font-bold">
                        {{ calculationResults.totalPeriods }}
                        <span v-if="contributionFrequency === 'monthly'"> 期（按月）</span>
                        <span v-else-if="contributionFrequency === 'biweekly'"> 期（双周）</span>
                        <span v-else> 期（周）</span>
                      </p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                      <p class="text-neutral text-sm">总投入金额</p>
                      <p class="text-xl font-bold">¥ {{ formatNumber(calculationResults.totalInvestment) }}</p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-4 rounded-lg">
                      <p class="text-neutral text-sm">期末总资产</p>
                      <p class="text-xl font-bold">¥ {{ formatNumber(calculationResults.finalAmount) }}</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                      <p class="text-neutral text-sm">总收益金额</p>
                      <p class="text-xl font-bold text-bull">¥ {{ formatNumber(calculationResults.totalProfit) }}</p>
                    </div>
                  </div>
                  
                  <div class="bg-white p-4 rounded-lg">
                    <p class="text-neutral text-sm">总收益率</p>
                    <p class="text-2xl font-bold" :class="calculationResults.totalReturn > 0 ? 'text-bull' : 'text-bear'">
                      {{ calculationResults.totalReturn > 0 ? '+' : '' }}{{ calculationResults.totalReturn.toFixed(2) }}%
                    </p>
                  </div>
                  
                  <div class="bg-white p-4 rounded-lg">
                    <p class="text-neutral text-sm">年化收益率</p>
                    <p class="text-2xl font-bold" :class="calculationResults.annualReturn > 0 ? 'text-bull' : 'text-bear'">
                      {{ calculationResults.annualReturn > 0 ? '+' : '' }}{{ calculationResults.annualReturn.toFixed(2) }}%
                    </p>
                  </div>
                  
                  <!-- <div class="mt-4">
                    <canvas id="return-chart" height="180"></canvas>
                  </div> -->
                </div>
              </div>
              
              <div v-if="!showCalculationResults" class="bg-light/50 rounded-lg p-6 flex items-center justify-center h-full">
                <p class="text-neutral text-center">
                  输入定投参数并点击"计算收益"按钮<br>查看模拟结果
                </p>
              </div>
          </div>
        </div>
       </section>
   


      <!-- 策略回测 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">策略回测结果</h2>
          
          <div class="mb-8">
            <p class="text-neutral leading-relaxed">
              以下是基于历史数据的策略回测结果，展示了在{{ formatDate(startDate) }}-{{ formatDate(endDate) }}期间，按月普通定投与智能优化定投的表现对比：
            </p>
          </div>
          
          <div class="h-80 mb-8">
            <canvas ref="backtestChartCanvas"></canvas>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <h3 class="font-semibold text-lg mb-4">回测基本信息</h3>
              <ul class="space-y-3 text-neutral">
                <li class="flex justify-between">
                  <span>回测时间段</span>
                  <span class="font-medium">{{ formatDate(startDate) }}-{{ formatDate(endDate) }}</span>
                </li>
                <li class="flex justify-between">
                  <span>回测周期</span>
                  <span class="font-medium">{{ backtestInfo.period }} 个月</span>
                </li>
                <li class="flex justify-between">
                  <span>基准指数</span>
                  <span class="font-medium">{{ currentMarketInfo.name }}</span>
                </li>
                <li class="flex justify-between">
                  <span>基准收益率</span>
                  <span class="font-medium" :class="backtestInfo.baselineReturn > 0 ? 'text-bull' : 'text-bear'">
                    {{ backtestInfo.baselineReturn > 0 ? '+' : '' }}{{ backtestInfo.baselineReturn }}%
                  </span>
                </li>
              </ul>
            </div>
            
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <h3 class="font-semibold text-lg mb-4">普通定投表现</h3>
              <ul class="space-y-3 text-neutral">
                <li class="flex justify-between">
                  <span>总收益率</span>
                  <span class="font-medium" :class="backtestInfo.normalReturn > 0 ? 'text-bull' : 'text-bear'">
                    {{ backtestInfo.normalReturn > 0 ? '+' : '' }}{{ backtestInfo.normalReturn }}%
                  </span>
                </li>
                <li class="flex justify-between">
                  <span>年化收益率</span>
                  <span class="font-medium" :class="backtestInfo.normalAnnualReturn > 0 ? 'text-bull' : 'text-bear'">
                    {{ backtestInfo.normalAnnualReturn > 0 ? '+' : '' }}{{ backtestInfo.normalAnnualReturn }}%
                  </span>
                </li>
                <li class="flex justify-between">
                  <span>最大回撤</span>
                  <span class="font-medium text-bear">{{ backtestInfo.normalMaxDrawdown }}%</span>
                </li>
                <li class="flex justify-between">
                  <span>夏普比率</span>
                  <span class="font-medium">{{ backtestInfo.normalSharpeRatio?backtestInfo.normalSharpeRatio.toFixed(2):'' }}</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <h3 class="font-semibold text-lg mb-4">智能优化定投表现</h3>
              <ul class="space-y-3 text-neutral">
                <li class="flex justify-between">
                  <span>总收益率</span>
                  <span class="font-medium" :class="backtestInfo.optimizedReturn > 0 ? 'text-bull' : 'text-bear'">
                    {{ backtestInfo.optimizedReturn > 0 ? '+' : '' }}{{ backtestInfo.optimizedReturn }}%
                  </span>
                </li>
                <li class="flex justify-between">
                  <span>年化收益率</span>
                  <span class="font-medium" :class="backtestInfo.optimizedAnnualReturn > 0 ? 'text-bull' : 'text-bear'">
                    {{ backtestInfo.optimizedAnnualReturn > 0 ? '+' : '' }}{{ backtestInfo.optimizedAnnualReturn }}%
                  </span>
                </li>
                <li class="flex justify-between">
                  <span>最大回撤</span>
                  <span class="font-medium text-bear">{{ backtestInfo.optimizedMaxDrawdown }}%</span>
                </li>
                <li class="flex justify-between">
                  <span>夏普比率</span>
                  <span class="font-medium">{{ backtestInfo.optimizedSharpeRatio?backtestInfo.optimizedSharpeRatio.toFixed(2):'' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 策略执行建议 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">策略执行要点与注意事项</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <h3 class="font-semibold text-lg mb-4 flex items-center">
                <i class="fa fa-check-circle text-primary mr-2"></i>
                执行要点
              </h3>
              <ul class="space-y-3 text-neutral">
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>严格按照基金趋势切换策略，避免情绪干扰</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>提前规划资金分配，确保熊市有足够加仓资金</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>定期（每月）回顾基金趋势，确认策略适用性</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>止盈资金需及时转出，避免回调吞噬收益</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>不同基金采用差异化策略参数（如黄金ETF波动阈值可提高）</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <h3 class="font-semibold text-lg mb-4 flex items-center">
                <i class="fa fa-exclamation-triangle text-volatile mr-2"></i>
                注意事项
              </h3>
              <ul class="space-y-3 text-neutral">
                <li class="flex">
                  <i class="fa fa-angle-right text-volatile mt-1 mr-2"></i>
                  <span>策略效果基于历史数据，未来表现可能不同</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-volatile mt-1 mr-2"></i>
                  <span>重大突发事件（如黑天鹅事件）需临时调整策略</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-volatile mt-1 mr-2"></i>
                  <span>避免过度交易，每次调整需超过设定阈值</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-volatile mt-1 mr-2"></i>
                  <span>定投需长期坚持，建议周期不短于3年</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-volatile mt-1 mr-2"></i>
                  <span>根据自身风险承受能力调整定投金额与策略参数</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>



<script setup>
import { ref, shallowRef, onMounted, watch, nextTick, computed, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import MonthPicker from './MonthPicker.vue';
import { useMarketAnalysis } from '../composables/useMarketAnalysis.js';


// 注册Chart.js组件
Chart.register(...registerables, annotationPlugin);

// 状态管理
const selectedMarket = ref('000008');
const fundCodeInput = ref(''); // 添加这行：基金代码输入框的值
// 将 startDate 初始值设为当前日期向前 6 个月，格式 YYYY-MM-DD
const _initialToday = new Date();
const _sixMonthsAgo = new Date(_initialToday.getFullYear(), _initialToday.getMonth() - 6, _initialToday.getDate());
const _formatDateYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const startDate = ref(_formatDateYMD(_sixMonthsAgo));
// endDate 初始为当前日期（YYYY-MM-DD）
const endDate = ref(_formatDateYMD(_initialToday));
// 可选范围：近 5 年（minDate）到今天（maxDate）
const _fiveYearsAgo = new Date(_initialToday.getFullYear() - 5, _initialToday.getMonth(), _initialToday.getDate());
const minDate = _formatDateYMD(_fiveYearsAgo);
const maxDate = _formatDateYMD(_initialToday);
const isLoading = ref(false);
const showResults = ref(false);
const lastUpdated = ref('');
const currentMarketInfo = ref({
  name: '',
  fullName: '',
  labels: [],
  data: [],
  trends: [],
  indicators: {
    macro: { labels: [], values: [], trends: [] },
    market: { labels: [], values: [], trends: [] },
    sentiment: { labels: [], values: [], trends: [] }
  },
  strategy: {
    bull: { title: '', period: '', core: '', points: [], performance: {} },
    bear: { title: '', period: '', core: '', points: [], performance: {} },
    volatile: { title: '', period: '', core: '', points: [], performance: {} }
  },
  backtest: {}
});
const filteredTrends = ref([]);
// 下拉菜单相关状态
const dropdownContainer = ref(null);
const isDropdownOpen = ref(false);
// 计算属性：根据基金代码输入筛选市场选项
const matchingMarketOptions = computed(() => {
  if (!fundCodeInput.value) {
    return marketOptions.value;
  }
  
  const searchTerm = fundCodeInput.value.toLowerCase();
  return marketOptions.value.filter(option =>
    option.value.toLowerCase().includes(searchTerm) || 
    option.label.toLowerCase().includes(searchTerm)
  );
});
const filteredMarketOptions = computed(() => matchingMarketOptions.value.slice(0, 100));
// 计算属性：获取选中市场的标签
const selectedMarketLabel = computed(() => {
  const selected = marketOptions.value.find(option => option.value === selectedMarket.value);
  return selected ? selected.label : '';
});
// 定投计算器状态
const monthlyInvestment = ref(100);
const targetAmount = ref(10000); // 定投目标金额
const calculatorStartDate = ref('2020-01-01');
const calculatorEndDate = ref('2024-12-31');
const selectedStrategy = ref('optimized');
const downThreshold = ref(2);
const upThreshold = ref(2);
const increasePercent = ref(50);
const decreasePercent = ref(30);
// 定投频率：'weekly' | 'biweekly' | 'monthly'
const contributionFrequency = ref('weekly');
const showCalculationResults = ref(false);
const calculationResults = ref({});
const returnChart = ref(null);
// 加仓/减仓预警状态
const investmentAlert = ref({});
const showAlert = ref(false);

// 添加toggleDropdown函数
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
// 添加onSearchInput函数
const onSearchInput = (event) => {
  fundCodeInput.value = event.target.value;
};
// 添加selectMarket函数
const selectMarket = (option) => {
  selectedMarket.value = option.value;
  isDropdownOpen.value = false;
  fundCodeInput.value = ''; // 清空搜索框
};
// 添加点击外部关闭下拉菜单的功能
const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};
// Helper: 构建定投时间表（包含起始和结束日期），按频率生成 YYYY-MM-DD 字符串数组
const buildScheduleDates = (startStr, endStr, freq) => {
  const msDay = 24 * 60 * 60 * 1000;
  const res = [];
  let cur = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(cur.getTime()) || isNaN(end.getTime()) || cur > end) return res;

  const pushCur = () => res.push(_formatDateYMD(new Date(cur)));

  if (freq === 'weekly' || freq === 'biweekly') {
    const step = freq === 'weekly' ? 7 : 14;
    while (cur <= end) {
      pushCur();
      cur = new Date(cur.getTime() + step * msDay);
    }
  } else {


    // monthly
    while (cur <= end) {
      pushCur();
      const next = new Date(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
      // 处理月末日期溢出
      if (next.getMonth() === cur.getMonth()) next.setDate(1), next.setMonth(cur.getMonth() + 1);
      cur = next;
    }
  }
  return res;
};

// Helper: 按日期（YYYY-MM-DD）在 dailySeries 中找到最接近且不晚于目标日期的价格；若找不到则返回最近的下一个可用价格
const getPriceNearest = (dateStr) => {
  const series = currentMarketInfo.value && currentMarketInfo.value.dailySeries || [];
  if (!series.length) return null;
  // 二分或线性查找（这里用线性，数据通常不太大）
  let prev = null;
  for (let i = 0; i < series.length; i++) {
    const item = series[i];
    if (!item || !item.date) continue;
    if (item.date === dateStr) return item.value;
    if (item.date < dateStr) prev = item;
    if (item.date > dateStr) return (prev && prev.value != null) ? prev.value : item.value;
  }
  return prev ? prev.value : null;
};

// 模拟定投（支持按周/双周/每月），返回统计结果和序列
const getStrategyParameters = () => ({
  downThreshold: Number(downThreshold.value) / 100,
  upThreshold: Number(upThreshold.value) / 100,
  increaseMultiplier: 1 + Number(increasePercent.value) / 100,
  decreaseMultiplier: 1 - Number(decreasePercent.value) / 100
});

const strategyParametersAreValid = () => [
  downThreshold.value, upThreshold.value, increasePercent.value, decreasePercent.value
].every(value => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100)
  && Number(downThreshold.value) > 0 && Number(upThreshold.value) > 0;

const simulateInvestment = (startStr, endStr, freq, amountPerPeriod, strategyType, strategyParams = getStrategyParameters()) => {
  const schedule = buildScheduleDates(startStr, endStr, freq);
  if (!schedule.length) return null;
  const seriesPrices = schedule.map(d => ({ date: d, price: getPriceNearest(d) }));
  // 过滤掉所有无法取到价格的期次
  const valid = seriesPrices.filter(p => p.price != null);
  if (!valid.length) return null;

  const baselineStartPrice = valid[0].price;
  const baselineSeries = valid.map(p => (p.price / baselineStartPrice) * Number(amountPerPeriod || 0));

  let normalTotalShares = 0;
  let normalTotalInvested = 0;
  const normalValueSeries = [];

  let optimizedTotalShares = 0;
  let optimizedTotalInvested = 0;
  const optimizedValueSeries = [];

  // 计算价格变化，用于生成预警建议
  let alertInfo = null;
  const series = valid || [];
  if (series.length >= 2) {
    // 获取最近的两个价格点（基于dailySeries）
    const sortedSeries = [...series].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestPrice = sortedSeries[0].price;
    const prevPrice = sortedSeries[1].price;
    const periodChange = (latestPrice - prevPrice) / prevPrice;
    console.log('最近价格变化：', {
      latestPrice,
      prevPrice,
      periodChange
    });
    // 根据定投频率确定对比期数和描述
    let periodDescription = '';
    const changeThresholds = {
      down: strategyParams.downThreshold,
      up: strategyParams.upThreshold,
      strongDown: strategyParams.downThreshold * 2,
      strongUp: strategyParams.upThreshold * 2
    };
  
    // 根据定投频率设置参数和对比周期
    if (freq === 'weekly') {
      periodDescription = '上周';
      
    } else if (freq === 'biweekly') {
      periodDescription = '上双周';
    } else {
      // 月定投
      periodDescription = '上月';
    }
    // 根据价格变化生成预警建议
    if (periodChange <= -changeThresholds.down) {
      // 下跌预警 - 建议加仓
      alertInfo = {
        type: 'increase',
        level: periodChange <= -changeThresholds.strongDown ? 'strong' : 'medium',
        amount: amountPerPeriod * strategyParams.increaseMultiplier,
        reason: `${periodDescription}下跌${(periodChange * 100).toFixed(3)}%`,
        currentPrice: latestPrice,
        prevPrice: prevPrice
      };
    } else if (periodChange >= changeThresholds.up) {
      // 上涨预警 - 建议减仓
      alertInfo = {
        type: 'decrease',
        level: periodChange >= changeThresholds.strongUp ? 'strong' : 'medium',
        amount: amountPerPeriod * strategyParams.decreaseMultiplier,
        reason: `${periodDescription}上涨${(periodChange * 100).toFixed(3)}%`,
        currentPrice: latestPrice,
        prevPrice: prevPrice
      };
    } else {
      // 价格变化正常，不建议任何操作
      alertInfo = {
        type: 'normal',
        level: 'weak',
        amount: amountPerPeriod,
        reason: `${periodDescription}涨跌幅${(periodChange * 100).toFixed(3)}%,价格变化不大，无需调整定投金额`,
        currentPrice: latestPrice,
        prevPrice: prevPrice
      }
    }
  }

  for (let i = 0; i < valid.length; i++) {
    const price = valid[i].price;
    const investNormal = Number(amountPerPeriod) || 0;
    const sharesNormal = investNormal / price;
    normalTotalShares += sharesNormal;
    normalTotalInvested += investNormal;
    normalValueSeries.push(normalTotalShares * price);

    // 优化定投逻辑：参考上月/上期价格变动
    let multiplier = 1;
    if (i > 0) {
      const prev = valid[i - 1].price;
      const pct = (price - prev) / prev;
      if (pct <= -strategyParams.downThreshold) multiplier = strategyParams.increaseMultiplier;
      else if (pct >= strategyParams.upThreshold) multiplier = strategyParams.decreaseMultiplier;
    }
    const investOpt = (Number(amountPerPeriod) || 0) * multiplier;
    const sharesOpt = investOpt / price;
    optimizedTotalShares += sharesOpt;
    optimizedTotalInvested += investOpt;
    optimizedValueSeries.push(optimizedTotalShares * price);
  }

  const normalFinal = normalValueSeries.length ? normalValueSeries[normalValueSeries.length - 1] : 0;
  const optimizedFinal = optimizedValueSeries.length ? optimizedValueSeries[optimizedValueSeries.length - 1] : 0;

  const normalReturnPct = normalTotalInvested > 0 ? ((normalFinal - normalTotalInvested) / normalTotalInvested) * 100 : 0;
  const optimizedReturnPct = optimizedTotalInvested > 0 ? ((optimizedFinal - optimizedTotalInvested) / optimizedTotalInvested) * 100 : 0;

  // 年化：按实际天数计算
  const firstDate = new Date(valid[0].date);
  const lastDate = new Date(valid[valid.length - 1].date);
  const years = Math.max( (lastDate - firstDate) / (1000 * 3600 * 24) / 365 , 1/12 );
  const normalAnnualReturn = years > 0 ? (Math.pow(1 + normalReturnPct / 100, 1 / years) - 1) * 100 : 0;
  const optimizedAnnualReturn = years > 0 ? (Math.pow(1 + optimizedReturnPct / 100, 1 / years) - 1) * 100 : 0;

  return { 
    periodCount: valid.length,
    baselineSeries,
    normalSeries: normalValueSeries,
    optimizedSeries: optimizedValueSeries,
    normalTotalInvested,
    optimizedTotalInvested,
    normalFinal,
    optimizedFinal,
    normalReturnPct: +normalReturnPct.toFixed(2),
    optimizedReturnPct: +optimizedReturnPct.toFixed(2),
    normalAnnualReturn: +normalAnnualReturn.toFixed(2),
    optimizedAnnualReturn: +optimizedAnnualReturn.toFixed(2),
    labels: valid.map(v => v.date),
    alertInfo: alertInfo // 返回预警信息
  };
};

// 回测状态默认值
/**
 * DEFAULT_BACKTEST_INFO — 回测默认占位对象（中文注释）
 *
 * 可选/扩展字段说明（在回测结果中可能包含）：
 * - normalTotalInvested / optimizedTotalInvested: 普通/优化策略的累计投入（Number，货币单位）。
 * - normalFinalValue / optimizedFinalValue: 普通/优化策略的期末市值（Number，货币单位）。
 *
 * 备注：该常量作为回测结果的默认占位，便于在数据尚未加载或加载失败时页面渲染保持稳定。
 */
const DEFAULT_BACKTEST_INFO = {
  period: 0, // 回测总周期，单位为月（number）
  baselineReturn: 0, // 基准指数在回测期内的累计收益率（百分比，Number，例如 12.34 表示 12.34%）
  baselineSeries: [], // 基准指数每月的价值序列（Array<Number>），用于绘图与基线对比
  normalSeries: [], // 普通定投（DCA）每月组合市值序列（Array<Number>）
  optimizedSeries: [], // 智能优化定投每月组合市值序列（Array<Number>）
  normalReturn: 0, // 普通定投在回测期内的总收益率（百分比，Number）
  normalAnnualReturn: 0, // 普通定投的年化收益率（百分比，Number）
  normalMaxDrawdown: 0, // 普通定投期间的最大回撤（百分比，Number）
  normalSharpeRatio: 0, // 普通定投的夏普比率（年化，Number）
  optimizedReturn: 0, // 优化定投在回测期内的总收益率（百分比，Number）
  optimizedAnnualReturn: 0, // 优化定投的年化收益率（百分比，Number）
  optimizedMaxDrawdown: 0, // 优化定投期间的最大回撤（百分比，Number）
  optimizedSharpeRatio: 0, // 优化定投的夏普比率（年化，Number）
  labels: [] // 回测序列对应的月份标签数组（Array<String>，格式 'YYYY-MM'），用于图表横轴
};

const backtestInfo = ref({ ...DEFAULT_BACKTEST_INFO });
const backtestChart = ref(null);
const backtestChartCanvas = ref(null);
// 将 DOM canvas 与 Chart 实例分离
const marketTrendCanvas = ref(null);
const marketTrendChart = ref(null); // Chart 实例

// 从 composable 中获取数据加载方法（useMarketAnalysis 导出一个工厂函数）
const { fetchMarketData, fetchMarkets } = useMarketAnalysis();

// 将 API 返回的数据与组件期望的结构合并，填充默认值以避免模板访问时出错
const normalizeMarketInfo = (res) => {
  const defaults = {
    name: '',
    fullName: '',
    labels: [],
    data: [],
    trends: [],
    indicators: {
      macro: { labels: [], values: [], trends: [] },
      market: { labels: [], values: [], trends: [] },
      sentiment: { labels: [], values: [], trends: [] }
    },
    strategy: {
      bull: { title: '', period: '', core: '', points: [], performance: {} },
      bear: { title: '', period: '', core: '', points: [], performance: {} },
      volatile: { title: '', period: '', core: '', points: [], performance: {} }
    },
    backtest: {}
  };

  if (!res || typeof res !== 'object') return defaults;

  const indicators = {
    ...defaults.indicators,
    ...(res.indicators || {}),
    macro: { ...defaults.indicators.macro, ...(res.indicators && res.indicators.macro ? res.indicators.macro : {}) },
    market: { ...defaults.indicators.market, ...(res.indicators && res.indicators.market ? res.indicators.market : {}) },
    sentiment: { ...defaults.indicators.sentiment, ...(res.indicators && res.indicators.sentiment ? res.indicators.sentiment : {}) }
  };

  const strategy = {
    ...defaults.strategy,
    ...(res.strategy || {})
  };

  return {
    ...defaults,
    ...res,
    indicators,
    strategy,
    labels: Array.isArray(res.labels) ? res.labels : defaults.labels,
    data: Array.isArray(res.data) ? res.data : defaults.data,
    trends: Array.isArray(res.trends) ? res.trends : defaults.trends
  };
};

// 封装加载函数：调用 fetchMarketData 并将结果归一化后赋值给 currentMarketInfo
const loadMarketData = async (marketId, sDate, eDate) => {
  try {
    const res = await fetchMarketData(marketId, sDate, eDate);
    currentMarketInfo.value = normalizeMarketInfo(res);
    lastUpdated.value = new Date().toLocaleString();
    return currentMarketInfo.value;
  } catch (err) {
    console.error('loadMarketData error', err);
    return currentMarketInfo.value;
  }
};
const marketOptions = shallowRef([]);
// 添加清理事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
// 初始化日期
onMounted(() => {
  // 设置默认结束日期为当前日期，格式 YYYY-MM-DD
  const today = new Date();
  const defaultEndDate = _formatDateYMD(today);
  endDate.value = defaultEndDate;
  calculatorEndDate.value = defaultEndDate;
  // 加载市场列表
  fetchMarkets().then(markets => {
    marketOptions.value = markets.map(market => ({
      value: market['基金代码'],
      label: market['基金简称']
    }));
    // 如果当前选中的市场不在市场列表中，设置为第一个市场
    if (marketOptions.value.length > 0 && !marketOptions.value.some(option => option.value === selectedMarket.value)) {
      selectedMarket.value = marketOptions.value[0].value;
    }
  });
});

const calculatePearsonCorrelation = (left, right) => {
  if (left.length < 2 || left.length !== right.length) return 0;
  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;
  let numerator = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  left.forEach((value, index) => {
    const leftDelta = value - leftMean;
    const rightDelta = right[index] - rightMean;
    numerator += leftDelta * rightDelta;
    leftVariance += leftDelta ** 2;
    rightVariance += rightDelta ** 2;
  });
  const denominator = Math.sqrt(leftVariance * rightVariance);
  return denominator ? numerator / denominator : 0;
};

const buildCorrelationMatrix = (fundReturns, fundCodes, dates) => {
  return fundCodes.map(leftCode => fundCodes.map(rightCode => {
    if (leftCode === rightCode) return 1;
    return calculatePearsonCorrelation(
      dates.map(date => fundReturns[leftCode].get(date)),
      dates.map(date => fundReturns[rightCode].get(date))
    );
  }));
};

const averageOffDiagonal = (matrix) => {
  const values = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (columnIndex > rowIndex) values.push(value);
    });
  });
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
};

const getCorrelationCellClass = (value) => {
  if (value >= 0.7) return 'bg-bear/10 text-bear';
  if (value <= 0.3) return 'bg-bull/10 text-bull';
  return 'bg-volatile/10 text-volatile';
};

const classifyCorrelationTrend = (monthlyReturn) => {
  if (monthlyReturn >= 0.005) return 'bull';
  if (monthlyReturn <= -0.005) return 'bear';
  return 'volatile';
};

const renderCorrelationChart = (trendCorrelations) => {
  if (!correlationChartCanvas.value) return;
  if (correlationChart.value) correlationChart.value.destroy();
  const trendLabels = { bull: '牛市', bear: '熊市', volatile: '震荡市' };
  const trendColors = { bull: '#00B42A', bear: '#F53F3F', volatile: '#FF7D00' };
  correlationChart.value = new Chart(correlationChartCanvas.value, {
    type: 'bar',
    data: {
      labels: Object.keys(trendLabels).map(trend => trendLabels[trend]),
      datasets: [{
        label: '平均相关系数',
        data: Object.keys(trendLabels).map(trend => trendCorrelations[trend]),
        backgroundColor: Object.keys(trendLabels).map(trend => trendColors[trend]),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: -1, max: 1, ticks: { callback: value => Number(value).toFixed(1) } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: context => `平均相关系数：${Number(context.raw).toFixed(2)}` } }
      }
    }
  });
};

const analyzeFundCorrelation = async () => {
  if (selectedCorrelationFunds.value.length < 2) {
    alert('请至少选择两只基金');
    return;
  }
  isCorrelationLoading.value = true;
  try {
    const selectedCodes = [...selectedCorrelationFunds.value];
    const fundData = await Promise.all(selectedCodes.map(code =>
      fetchMarketData(code, startDate.value, endDate.value)
    ));
    const validFunds = fundData.map((data, index) => ({
      code: selectedCodes[index],
      label: marketOptions.value.find(option => option.value === selectedCodes[index])?.label || selectedCodes[index],
      data: Array.isArray(data?.dailySeries) ? data.dailySeries : []
    })).filter(fund => fund.data.length >= 2);

    if (validFunds.length < 2) {
      throw new Error('所选基金的有效历史净值不足，无法计算相关性');
    }

    const fundReturns = {};
    validFunds.forEach(fund => {
      const returns = new Map();
      for (let index = 1; index < fund.data.length; index += 1) {
        const previous = Number(fund.data[index - 1].value);
        const current = Number(fund.data[index].value);
        if (fund.data[index].date && Number.isFinite(previous) && previous > 0 && Number.isFinite(current)) {
          returns.set(fund.data[index].date, (current - previous) / previous);
        }
      }
      fundReturns[fund.code] = returns;
    });

    const fundCodes = validFunds.map(fund => fund.code);
    const dates = [...fundReturns[fundCodes[0]].keys()]
      .filter(date => fundCodes.every(code => fundReturns[code].has(date)))
      .sort();
    if (dates.length < 10) {
      throw new Error('所选基金的共同交易日不足 10 天，无法计算可靠的相关性');
    }

    const monthlyReturns = new Map();
    dates.forEach(date => {
      const month = date.slice(0, 7);
      if (!monthlyReturns.has(month)) monthlyReturns.set(month, []);
      monthlyReturns.get(month).push(
        fundCodes.reduce((sum, code) => sum + fundReturns[code].get(date), 0) / fundCodes.length
      );
    });
    const trendDates = { bull: [], bear: [], volatile: [] };
    monthlyReturns.forEach((returns, month) => {
      const average = returns.reduce((sum, value) => sum + value, 0) / returns.length;
      trendDates[classifyCorrelationTrend(average)].push(...dates.filter(date => date.startsWith(month)));
    });

    const overallMatrix = buildCorrelationMatrix(fundReturns, fundCodes, dates);
    const trendCorrelations = {};
    Object.keys(trendDates).forEach(trend => {
      const trendMatrix = trendDates[trend].length >= 2
        ? buildCorrelationMatrix(fundReturns, fundCodes, trendDates[trend])
        : overallMatrix;
      trendCorrelations[trend] = averageOffDiagonal(trendMatrix);
    });

    const volatilities = fundCodes.map(code => {
      const values = dates.map(date => fundReturns[code].get(date));
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
      return Math.sqrt(variance);
    });
    const inverseVolatility = volatilities.map(volatility => volatility > 0 ? 1 / volatility : 1);
    const inverseVolatilityTotal = inverseVolatility.reduce((sum, value) => sum + value, 0);
    const selectedFunds = validFunds.map((fund, index) => ({
      code: fund.code,
      label: fund.label,
      shortLabel: fund.label.length > 8 ? fund.label.slice(0, 8) : fund.label,
      weight: inverseVolatility[index] / inverseVolatilityTotal
    }));
    const overallAverage = averageOffDiagonal(overallMatrix);
    const recommendation = overallAverage >= 0.7
      ? '基金整体走势高度同步，建议加入债券、货币或黄金类低相关资产，避免组合风险过度集中。'
      : overallAverage <= 0.3
        ? '基金整体相关性较低，具备较好的分散效果，可按波动率倒数权重进行平衡配置。'
        : '基金存在一定分散效果，建议以波动率倒数权重为基础，并结合风险承受能力微调。';

    correlationResult.value = {
      selectedFunds,
      overallMatrix,
      trendCorrelations,
      sampleCount: dates.length,
      recommendation
    };
    await nextTick();
    renderCorrelationChart(trendCorrelations);
  } catch (error) {
    correlationResult.value = null;
    alert(error instanceof Error ? error.message : '基金相关性分析失败，请稍后重试');
    console.error('基金相关性分析失败', error);
  } finally {
    isCorrelationLoading.value = false;
  }
};

// 格式化日期（支持 YYYY-MM 和 YYYY-MM-DD）
const formatDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length >= 3) return `${parts[0]}.${parts[1]}.${parts[2]}`;
  return `${parts[0]}.${parts[1]}`;
};

// 获取趋势类型名称
const getTrendTypeName = (type) => {
  switch(type) {
    case 'bull': return '牛市';
    case 'bear': return '熊市';
    case 'volatile': return '震荡市';
    default: return '';
  }
};

// 获取趋势颜色类
const getTrendColorClass = (type) => {
  switch(type) {
    case 'bull': return 'bg-bull';
    case 'bear': return 'bg-bear';
    case 'volatile': return 'bg-volatile';
    default: return '';
  }
};

// 获取趋势线条颜色类
const getTrendLineColorClass = (type) => {
  switch(type) {
    case 'bull': return 'bg-bull/20';
    case 'bear': return 'bg-bear/20';
    case 'volatile': return 'bg-volatile/20';
    default: return '';
  }
};

// 获取趋势标签类
const getTrendBadgeClass = (type) => {
  switch(type) {
    case 'bull': return 'bg-bull/10 text-bull';
    case 'bear': return 'bg-bear/10 text-bear';
    case 'volatile': return 'bg-volatile/10 text-volatile';
    default: return '';
  }
};

// 获取指标颜色类
const getIndicatorClass = (trend) => {
  switch(trend) {
    case 'up': return 'indicator-up';
    case 'down': return 'indicator-down';
    case 'neutral': return 'indicator-neutral';
    default: return '';
  }
};

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString('zh-CN');
};

// 处理市场变化
const handleMarketChange = () => {
  showResults.value = false;
  // loadMarketData(selectedMarket.value, startDate.value, endDate.value);
};
// 监听市场变化
watch([startDate, endDate], () => {
   showResults.value = false;
});
// 分析市场
const analyzeMarket = async () => {
  if (new Date(startDate.value) > new Date(endDate.value)) {
    alert('开始日期不能晚于结束日期');
    return;
  }
  
  isLoading.value = true;

  // 初始加载市场数据，使用组件的选中市场与日期范围
  await loadMarketData(selectedMarket.value, startDate.value, endDate.value);
  console.log('currentMarketInfo', currentMarketInfo.value)
  
  // 过滤符合时间范围的趋势
  filterTrendsByDateRange();
  
  // 更新计算器日期范围
  calculatorStartDate.value = startDate.value;
  calculatorEndDate.value = endDate.value;
  
  // 延迟显示结果，模拟加载过程
  setTimeout(async () => {
    // 先渲染结果区域，再初始化依赖 DOM 的图表
    showResults.value = true;
    await nextTick();
    // 生成市场趋势图表
    initMarketTrendChart();
    // 生成回测数据
    // generateBacktestData();
    // 计算定投收益并生成回测数据
    calculateReturns();
    isLoading.value = false;
  }, 800);
};

// 过滤趋势数据
const filterTrendsByDateRange = () => {
  // startDate/endDate are full dates (YYYY-MM-DD)
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  // 防护：没有趋势数据时返回空数组
  if (!currentMarketInfo.value || !Array.isArray(currentMarketInfo.value.trends)) {
    filteredTrends.value = [];
    return;
  }

  filteredTrends.value = currentMarketInfo.value.trends.filter(trend => {
    // trend.start / trend.end are stored as 'YYYY-MM'
    const trendStart = new Date(trend.start + '-01');
    const tParts = trend.end.split('-').map(Number);
    // trendEnd set to last millisecond of the trend.end month
    const trendEnd = new Date(tParts[0], tParts[1], 0, 23, 59, 59, 999);
    // 检查趋势是否与选择的时间范围有重叠
    return trendStart <= end && trendEnd >= start;
  });
};

// 初始化市场趋势图表
const initMarketTrendChart = () => {
  // 销毁现有图表
  if (marketTrendChart.value) {
    marketTrendChart.value.destroy();
  }
  
  // 获取符合时间范围的数据
  const startMonth = (startDate.value || '').slice(0,7);
  const endMonth = (endDate.value || '').slice(0,7);
  const startIdx = currentMarketInfo.value.labels.indexOf(startMonth);
  const endIdx = currentMarketInfo.value.labels.indexOf(endMonth);
  
  if (startIdx === -1 || endIdx === -1) return;
  
  const filteredLabels = currentMarketInfo.value.labels.slice(startIdx, endIdx + 1);
  const filteredData = currentMarketInfo.value.data.slice(startIdx, endIdx + 1);
  
  // 创建图表
  const ctx = marketTrendCanvas.value && marketTrendCanvas.value.getContext && marketTrendCanvas.value.getContext('2d');
  if (!ctx) return;

  // 准备趋势区间注释（使用明确颜色映射）
  const colorMap = {
    bull: 'rgba(0,180,42,0.08)',
    bear: 'rgba(245,63,63,0.08)',
    volatile: 'rgba(255,125,0,0.08)'
  };

  const trendAnnotations = {};
  filteredTrends.value.forEach((trend, index) => {
    const trendStartIdx = currentMarketInfo.value.labels.indexOf(trend.start);
    const trendEndIdx = currentMarketInfo.value.labels.indexOf(trend.end);
    if (trendStartIdx !== -1 && trendEndIdx !== -1) {
      const displayStartIdx = Math.max(0, trendStartIdx - startIdx);
      const displayEndIdx = Math.min(endIdx - startIdx, trendEndIdx - startIdx);
      // Use 'box' annotation type which is supported by chartjs-plugin-annotation
      trendAnnotations[`trend-${index}`] = {
        type: 'box',
        xMin: displayStartIdx,
        xMax: displayEndIdx,
        yMin: 0,
        yMax: 'max',
        backgroundColor: colorMap[trend.type] || 'rgba(0,0,0,0.05)',
        borderWidth: 0
      };
    }
  });
      // 趋势图表颜色定义
    const COLORS = {
      bull: { border: '#06B62A', point: '#06B62A', bg: 'rgba(6,182,42,0.08)' },
      volatile: { border: '#FF7D00', point: '#FF7D00', bg: 'rgba(255,125,0,0.08)' },
      bear: { border: '#F53F3F', point: '#F53F3F', bg: 'rgba(245,63,63,0.08)' }
    };

    // 计算每一段（前后两点）增长率并返回分类： 'bull' | 'volatile' | 'bear'
    const classifyChange = (prev, curr) => {
      if (prev == null || prev === 0) return 'volatile';
      const rate = (curr - prev) / Math.abs(prev);
      if (rate > 0.07) return 'bull';
      if (rate < -0.07) return 'bear';
      return 'volatile';
    };

    // 生成每个点的 pointBackgroundColor（根据与前一个点的变化分类）
    const pointBgColors = filteredData.map((v, idx) => {
      if (idx === 0) {
        // 首点没有前向比较，取与下一点的分类（若存在），否则 volatile
        if (filteredData.length > 1) {
          return COLORS[classifyChange(filteredData[0], filteredData[1])].point;
        }
        return COLORS.volatile.point;
      }
      const cls = classifyChange(filteredData[idx - 1], v);
      return COLORS[cls].point;
    });

    // 生成每个点的 pointBorderColor，使点的边框颜色与相邻线段保持一致（使用与点相关的前一段分类）
    const pointBorderColors = filteredData.map((v, idx) => {
      if (idx === 0) {
        if (filteredData.length > 1) {
          return COLORS[classifyChange(filteredData[0], filteredData[1])].border;
        }
        return COLORS.volatile.border;
      }
      const cls = classifyChange(filteredData[idx - 1], v);
      return COLORS[cls].border;
    });

    // 使用 segment 回调为每个线段设置 borderColor / backgroundColor
    const segmentOptions = {
      borderColor: ctxSeg => {
        const i0 = ctxSeg.p0DataIndex;
        const i1 = ctxSeg.p1DataIndex;
        const prev = filteredData[i0];
        const curr = filteredData[i1];
        const cls = classifyChange(prev, curr);
        return COLORS[cls].border;
      },
      backgroundColor: ctxSeg => {
        // 填充颜色用于 segment 的填充区域
        const i0 = ctxSeg.p0DataIndex;
        const i1 = ctxSeg.p1DataIndex;
        const prev = filteredData[i0];
        const curr = filteredData[i1];
        const cls = classifyChange(prev, curr);
        return COLORS[cls].bg;
      }
    };

  marketTrendChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: filteredLabels.map(formatDate),
      datasets: [{
        label: currentMarketInfo.value.name,
        data: filteredData,
        borderColor: '#165DFF',
        backgroundColor: 'rgba(22, 93, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: pointBgColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        pointRadius: 3,
        // hover styles: 边框颜色与线段一致，并放大点半径与边框宽度
        pointHoverBorderColor: pointBorderColors,
        pointHoverBorderWidth: 4,
        pointHoverRadius: 6,
        segment: segmentOptions
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
            },
            label: function(context) {
              try {
                const idx = context.dataIndex;
                const dataset = context.dataset || {};
                const dataArr = dataset.data || filteredData;
                const curr = Number(context.raw != null ? context.raw : dataArr[idx]);
                const prev = (idx > 0) ? Number(dataArr[idx - 1]) : null;
                let pctStr = '—';
                if (prev != null && prev !== 0 && !isNaN(prev) && !isNaN(curr)) {
                  const pct = (curr - prev) / Math.abs(prev);
                  const sign = pct > 0 ? '+' : '';
                  pctStr = `${sign}${(pct * 100).toFixed(2)}%`;
                }
                const valStr = isNaN(curr) ? String(curr) : curr.toLocaleString('zh-CN');
                const label = dataset.label || '';
                return `${label}: ¥ ${valStr}  (${pctStr})`;
              } catch (e) {
                return context.dataset && context.dataset.label ? `${context.dataset.label}: ${context.raw}` : String(context.raw);
              }
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

// 计算收益（支持按周/双周/每月）
const calculateReturns = () => {
  if (new Date(calculatorStartDate.value) > new Date(calculatorEndDate.value)) {
    alert('开始日期不能晚于结束日期');
    return;
  }
  if (!strategyParametersAreValid()) {
    alert('策略参数必须填写有效的百分比：阈值需大于 0，加仓和减仓比例需在 0% 至 100% 之间');
    return;
  }

  // 使用日序列计算按频率的定投结果
  if (!currentMarketInfo.value || !Array.isArray(currentMarketInfo.value.dailySeries)) {
    alert('基金日度数据不可用，请先分析基金以加载数据');
    return;
  }
  
  const sim = simulateInvestment(
    calculatorStartDate.value,
    calculatorEndDate.value,
    contributionFrequency.value,
    monthlyInvestment.value,
    selectedStrategy.value,
    getStrategyParameters()
  );

  if (!sim) {
    alert('无法在选定时间范围内构造定投序列（缺少价格数据）');
    return;
  }

  // 根据选择的策略采用不同的返回值
  const isNormal = selectedStrategy.value === 'normal';
  const totalPeriods = sim.periodCount;
  const totalInvestment = (isNormal ? sim.normalTotalInvested : sim.optimizedTotalInvested);
  const finalAmount = (isNormal ? sim.normalFinal : sim.optimizedFinal);
  const totalProfit = finalAmount - totalInvestment;
  const totalReturn = isNormal ? sim.normalReturnPct : sim.optimizedReturnPct;
  const annualReturn = isNormal ? sim.normalAnnualReturn : sim.optimizedAnnualReturn;

  calculationResults.value = {
    totalPeriods,
    totalInvestment,
    finalAmount,
    totalProfit,
    totalReturn,
    annualReturn
  };
  console.log('sim.alertInfo', sim.alertInfo);
  // 处理预警信息
  if (sim.alertInfo) { 
    investmentAlert.value = sim.alertInfo;
    showAlert.value = true;
  } else {
    // 只有在有实际数据的情况下才显示预警信息
    // 避免即使没有有意义的变化也显示默认信息
    if (showAlert.value) {
      showAlert.value = false;
    }
  }
    // 生成回测数据并初始化图表
    generateBacktestData();

  showCalculationResults.value = true;
};

// 当用户切换定投频率或定投策略时，若当前已显示计算结果则自动刷新计算
watch([contributionFrequency, selectedStrategy, downThreshold, upThreshold, increasePercent, decreasePercent], () => {
  if (showCalculationResults.value) {
    // 重新计算收益，保持交互即时响应
    try {
      calculateReturns();
    } catch (e) {
      console.error('自动刷新计算失败', e);
    }
  }
});


// 生成回测数据（逐月现金流精确模拟）
const generateBacktestData = () => {
  // 重置回测信息到默认值
  backtestInfo.value = { ...DEFAULT_BACKTEST_INFO };
  
  // 防护：必须有市场价格序列
  if (!currentMarketInfo.value || !Array.isArray(currentMarketInfo.value.data) || !Array.isArray(currentMarketInfo.value.labels)) {
    console.warn('市场数据不可用或格式错误');
    return;
  }

  // 找到回测起止索引
  const startMonth = (startDate.value || '').slice(0,7);
  const endMonth = (endDate.value || '').slice(0,7);
  const startIdx = currentMarketInfo.value.labels.indexOf(startMonth);
  const endIdx = currentMarketInfo.value.labels.indexOf(endMonth);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.warn('无法在市场数据中找到指定的日期范围');
    return;
  }

  const priceSeries = currentMarketInfo.value.data.slice(startIdx, endIdx + 1);
  const labels = currentMarketInfo.value.labels.slice(startIdx, endIdx + 1);
  const months = priceSeries.length;

  // 基线：一次性买入（Lump-sum）初始资金，用于显示指数表现（按价格变化比例）
  const baselineStartPrice = priceSeries[0];
  const baselineData = priceSeries.map(p => (p / baselineStartPrice) *  Number(targetAmount.value)); // 以10000为基准金额

  // 定投模拟（普通定投）：每月在当月价格买入固定份额
  const monthlyAmt = Number(monthlyInvestment.value) || 1000;
  const normalShares = [];
  const normalValueSeries = [];
  let normalTotalShares = 0;
  let normalTotalInvested = 0;

  // 优化定投：基于用户配置的价格变动规则动态调整当月投入
  const strategyParams = getStrategyParameters();
  const optimizedValueSeries = [];
  let optimizedTotalShares = 0;
  let optimizedTotalInvested = 0;

  for (let i = 0; i < months; i++) {
    const price = priceSeries[i];

    // 普通定投
    const investNormal = monthlyAmt;
    const sharesBoughtNormal = investNormal / price;
    normalTotalShares += sharesBoughtNormal;
    normalTotalInvested += investNormal;
    normalValueSeries.push(normalTotalShares * price);

    // 优化定投
    let multiplier = 1;
    if (i > 0) {
      const prev = priceSeries[i - 1];
      const pct = (price - prev) / prev;
      if (pct <= -strategyParams.downThreshold) multiplier = strategyParams.increaseMultiplier;
      else if (pct >= strategyParams.upThreshold) multiplier = strategyParams.decreaseMultiplier;
    }
    const investOpt = monthlyAmt * multiplier;
    const sharesBoughtOpt = investOpt / price;
    optimizedTotalShares += sharesBoughtOpt;
    optimizedTotalInvested += investOpt;
    optimizedValueSeries.push(optimizedTotalShares * price);
  }

  // 统计指标计算
  const normalFinal = normalValueSeries.length ? normalValueSeries[normalValueSeries.length - 1] : 0;
  const optimizedFinal = optimizedValueSeries.length ? optimizedValueSeries[optimizedValueSeries.length - 1] : 0;

  const normalReturnPct = normalTotalInvested > 0 ? ((normalFinal - normalTotalInvested) / normalTotalInvested) * 100 : 0;
  const optimizedReturnPct = optimizedTotalInvested > 0 ? ((optimizedFinal - optimizedTotalInvested) / optimizedTotalInvested) * 100 : 0;

  const years = months / 12;
  const normalAnnualReturn = years > 0 ? (Math.pow(1 + normalReturnPct / 100, 1 / years) - 1) * 100 : 0;
  const optimizedAnnualReturn = years > 0 ? (Math.pow(1 + optimizedReturnPct / 100, 1 / years) - 1) * 100 : 0;

  // 最大回撤计算（基于回测期间组合市值序列）
  const calcMaxDrawdown = (series) => {
    let peak = -Infinity;
    let maxDd = 0;
    for (let v of series) {
      if (v > peak) peak = v;
      const dd = (peak - v) / peak;
      if (dd > maxDd) maxDd = dd;
    }
    return +(maxDd * 100).toFixed(2);
  };

  const normalMaxDrawdown = calcMaxDrawdown(normalValueSeries);
  const optimizedMaxDrawdown = calcMaxDrawdown(optimizedValueSeries);

  // 基准指数收益（按价格变化）
  const baselineReturnPct = ((priceSeries[priceSeries.length - 1] - priceSeries[0]) / priceSeries[0]) * 100;

  // 计算夏普比率
  const riskFreeRate = 0.015; // 假设无风险利率1.5%
  
  const calcSharpeRatio = (returns, baseline) => {
    if (!returns.length || returns.length < 2) return 0;
    
    // 计算月度收益率序列
    const monthlyReturns = returns.map((value, i) => {
      if (i === 0) return 0;
      return (value - returns[i-1]) / returns[i-1];
    }).slice(1);
    
    // 计算超额收益的年化夏普比率
    const excessReturns = monthlyReturns.map(r => r - (riskFreeRate / 12));
    const meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
    const stdDev = Math.sqrt(
      excessReturns.reduce((sum, r) => sum + Math.pow(r - meanExcessReturn, 2), 0) / 
      (excessReturns.length - 1)
    );
    
    // 年化处理（月度数据）
    return stdDev ? (meanExcessReturn * Math.sqrt(12)) / (stdDev * Math.sqrt(12)) : 0;
  };

  // 计算三个策略的夏普比率
  const normalSharpeRatio = calcSharpeRatio(normalValueSeries, baselineData);
  const optimizedSharpeRatio = calcSharpeRatio(optimizedValueSeries, baselineData);
  const baselineSharpeRatio = calcSharpeRatio(baselineData, baselineData);

  // 保存回测信息与序列，用于绘图
  backtestInfo.value = {
    period: months,
    baselineReturn: +baselineReturnPct.toFixed(2),
    baselineSeries: baselineData,
    baselineSharpeRatio: +baselineSharpeRatio.toFixed(2),
    normalSeries: normalValueSeries,
    optimizedSeries: optimizedValueSeries,
    normalReturn: +normalReturnPct.toFixed(2),
    normalAnnualReturn: +normalAnnualReturn.toFixed(2),
    normalMaxDrawdown,
    normalSharpeRatio: +normalSharpeRatio.toFixed(2),
    optimizedReturn: +optimizedReturnPct.toFixed(2),
    optimizedAnnualReturn: +optimizedAnnualReturn.toFixed(2),
    optimizedMaxDrawdown,
    optimizedSharpeRatio: +optimizedSharpeRatio.toFixed(2),
    labels: labels,
    // 补充投资统计
    normalTotalInvested: +normalTotalInvested.toFixed(2),
    normalFinalValue: +normalValueSeries[normalValueSeries.length - 1].toFixed(2),
    optimizedTotalInvested: +optimizedTotalInvested.toFixed(2),
    optimizedFinalValue: +optimizedValueSeries[optimizedValueSeries.length - 1].toFixed(2)
  };

  // 初始化回测图表
  initBacktestChart();
};

// 初始化回测图表（使用 generateBacktestData 产生的精确序列）
const initBacktestChart = () => {
   // 销毁现有图表
  if (backtestChart.value) {
    backtestChart.value.destroy();
  }
  
  // 必要数据检查
  if (!backtestInfo.value || !Array.isArray(backtestInfo.value.labels)) {
    console.warn('回测数据不完整，无法绘制图表');
    return;
  }
  
  // 确保所有需要的数据序列都存在
  const requiredSeries = ['baselineSeries', 'normalSeries', 'optimizedSeries'];
  const missingData = requiredSeries.filter(key => !Array.isArray(backtestInfo.value[key]) || !backtestInfo.value[key].length);
  if (missingData.length) {
    console.warn('回测数据序列缺失:', missingData.join(', '));
    return;
  }
 console.log('backtestInfo.value', backtestInfo.value);
  const labels = backtestInfo.value.labels ||[]
  const baselineData = backtestInfo.value.baselineSeries || [];
  const normalData = backtestInfo.value.normalSeries || [];
  const optimizedData = backtestInfo.value.optimizedSeries || [];

  
  const ctx = backtestChartCanvas.value && backtestChartCanvas.value.getContext && backtestChartCanvas.value.getContext('2d');
  if (!ctx) return;
  backtestChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '基准指数 (Lump-sum)',
            data: baselineData,
            borderColor: 'rgba(78, 89, 105, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: '普通定投 (DCA)',
            data: normalData,
            borderColor: 'rgba(255, 125, 0, 0.9)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: '智能优化定投',
            data: optimizedData,
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
  }
 

// 获取市场数据
// const fetchMarketData = () => {
//   isLoading.value = true;
  
//   // 实际项目中这里会调用真实API
//   // 这里使用模拟数据
//   setTimeout(() => {
//     // 模拟API请求
//     // axios.get(`/api/market/${selectedMarket.value}`)
//     //   .then(response => {
//     //     currentMarketInfo.value = response.data;
//     //     isLoading.value = false;
        
//     //     // 更新最后更新时间
//     //     const now = new Date();
//     //     lastUpdated.value = now.toLocaleString();
//     //   })
//     //   .catch(error => {
//     //     console.error('获取市场数据失败:', error);
//     //     // 加载本地模拟数据
//     //     currentMarketInfo.value = getMockMarketData(selectedMarket.value);
//     //     isLoading.value = false;
        
//     //     // 更新最后更新时间
//     //     const now = new Date();
//     //     lastUpdated.value = now.toLocaleString();
//     //   });
//       // 加载本地模拟数据
//       currentMarketInfo.value = getMockMarketData(selectedMarket.value);
//       isLoading.value = false;
//       // 更新时间戳
//       lastUpdated.value = new Date().toLocaleString();
//   }, 500);
   
// };

// 模拟市场数据
const getMockMarketData = (marketId) => {
  // 生成2020-01到2024-12的所有月份
  const generateDateLabels = () => {
    const labels = [];
    // 从 2020-01 到 2024-12（包含）
    let current = new Date(2020, 0, 1);
    const end = new Date(2024, 11, 31);
    while (current <= end) {
      labels.push(`${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`);
      current.setMonth(current.getMonth() + 1);
    }
    return labels;
  };
  
  
  const dateLabels = generateDateLabels();
  
  switch(marketId) {
    case 'hs300':
      return {
        name: '沪深300',
        fullName: '国内 - 沪深300',
        data: generateMockData(dateLabels.length, 3500, 6500, 4000),
        labels: dateLabels,
        trends: [
          {start: '2020-03', end: '2021-02', type: 'bull', desc: '疫情后经济复苏，货币政策宽松，企业盈利快速反弹', change: '+42.3%'},
          {start: '2021-02', end: '2022-10', type: 'bear', desc: '经济增速放缓，美联储加息，地缘政治冲突', change: '-31.7%'},
          {start: '2022-10', end: '2024-12', type: 'volatile', desc: '经济弱复苏，政策中性，市场缺乏明确方向', change: '±12.5%'}
        ],
        indicators: {
          macro: {
            labels: ['GDP增速趋势', '制造业PMI', '货币政策', '企业盈利增速'],
            values: ['5.2% → 4.8%', '49.8 → 50.3', '中性偏松', '6.2% → 5.9%'],
            trends: ['neutral', 'neutral', 'neutral', 'neutral']
          },
          market: {
            labels: ['指数累计涨跌幅', 'PE分位波动', '日均成交额', '最大回撤'],
            values: ['+12.8%', '22% → 48%', '8,200亿', '-31.7%'],
            trends: ['up', 'neutral', 'neutral', 'down']
          },
          sentiment: {
            labels: ['北向资金流向', '基金新发规模', '恐惧贪婪指数', '融资余额变化'],
            values: ['+5,200亿', '28,500亿 → 4,200亿', '25 → 52', '-8%'],
            trends: ['up', 'down', 'neutral', 'neutral']
          }
        },
        strategy: {
          bull: {
            title: '牛市阶段定投策略',
            period: '2020年3月 - 2021年2月',
            core: '控制节奏，逐步止盈',
            points: [
              '基础定投金额降低至计划的60%，避免高位投入过多',
              '设置15%、30%、45%三档止盈点，每达到一档止盈20%仓位',
              '当PE分位超过80%时，暂停定投并准备分批退出',
              '将止盈资金转入低估值资产或货币基金，等待下一轮机会'
            ],
            performance: {
              normal: 38.5,
              optimized: 50.2,
              costReduction: 8.7
            }
          },
          bear: {
            title: '熊市阶段定投策略',
            period: '2021年2月 - 2022年10月',
            core: '越跌越买，积累筹码',
            points: [
              '采用4%跌幅加仓法：每下跌4%增加50%定投金额',
              '将资金分为10-15份，确保有足够弹药应对持续下跌',
              'PE分位低于30%时，基础定投金额提高至计划的120%',
              'PE分位低于20%时，可动用储备资金的30%进行加仓'
            ],
            performance: {
              normal: -18.3,
              optimized: -5.7,
              costReduction: 15.3
            }
          },
          volatile: {
            title: '震荡市阶段定投策略',
            period: '2022年10月 - 2024年12月',
            core: '网格交易，低买高卖',
            points: [
              '设定价格波动区间，每下跌5%增加30%定投金额',
              '每上涨5%减少30%定投金额，或卖出10%持仓',
              '保持50%-70%仓位，留有资金应对波动',
              '高股息ETF与目标ETF按3:7比例配置，增强收益稳定性'
            ],
            performance: {
              normal: 4.2,
              optimized: 12.8,
              costReduction: 6.5
            }
          }
        },
        backtest: {
          baselineReturn: 12.8,
          normalReturn: 18.5,
          normalMaxDrawdown: 31.7,
          normalSharpeRatio: 0.65,
          optimizedReturn: 32.3,
          optimizedMaxDrawdown: 18.5,
          optimizedSharpeRatio: 1.23
        }
      };
      
    case 'zz500':
      return {
        name: '中证500',
        fullName: '国内 - 中证500',
        data: generateMockData(dateLabels.length, 5000, 8500, 5500),
        labels: dateLabels,
        trends: [
          {start: '2020-04', end: '2021-03', type: 'bull', desc: '中小盘股业绩复苏强劲，政策支持', change: '+45.6%'},
          {start: '2021-03', end: '2022-11', type: 'bear', desc: '经济下行压力，中小企业盈利恶化', change: '-34.5%'},
          {start: '2022-11', end: '2024-12', type: 'volatile', desc: '政策支持力度加大，但复苏仍显乏力', change: '±14.2%'}
        ],
        indicators: {
          macro: {
            labels: ['GDP增速趋势', '制造业PMI', '货币政策', '企业盈利增速'],
            values: ['5.2% → 4.8%', '49.6 → 50.1', '定向宽松', '5.8% → 5.5%'],
            trends: ['neutral', 'neutral', 'neutral', 'neutral']
          },
          market: {
            labels: ['指数累计涨跌幅', 'PE分位波动', '日均成交额', '最大回撤'],
            values: ['+13.6%', '18% → 42%', '7,800亿', '-34.5%'],
            trends: ['up', 'neutral', 'neutral', 'down']
          },
          sentiment: {
            labels: ['北向资金流向', '基金新发规模', '恐惧贪婪指数', '融资余额变化'],
            values: ['+3,800亿', '25,200亿 → 3,800亿', '22 → 48', '-10%'],
            trends: ['up', 'down', 'neutral', 'neutral']
          }
        },
        strategy: {
          bull: {
            title: '牛市阶段定投策略',
            period: '2020年4月 - 2021年3月',
            core: '控制节奏，逐步止盈',
            points: [
              '基础定投金额降低至计划的50%，中小盘波动更大',
              '设置20%、40%两档止盈点，每达到一档止盈30%仓位',
              '当PE分位超过85%时，暂停定投并加速退出',
              '止盈资金可转向大盘股ETF平衡风险'
            ],
            performance: {
              normal: 42.1,
              optimized: 55.8,
              costReduction: 9.2
            }
          },
          bear: {
            title: '熊市阶段定投策略',
            period: '2021年3月 - 2022年11月',
            core: '越跌越买，积累筹码',
            points: [
              '采用3%跌幅加仓法：波动更大，阈值适当降低',
              '将资金分为15-20份，应对更大幅度下跌',
              'PE分位低于25%时，基础定投金额提高至计划的130%',
              'PE分位低于15%时，可动用储备资金的40%进行加仓'
            ],
            performance: {
              normal: -21.7,
              optimized: -7.3,
              costReduction: 17.5
            }
          },
          volatile: {
            title: '震荡市阶段定投策略',
            period: '2022年11月 - 2024年12月',
            core: '网格交易，灵活调整',
            points: [
              '设定更窄的价格波动区间，每下跌4%增加35%定投金额',
              '每上涨4%减少35%定投金额，或卖出12%持仓',
              '保持40%-60%仓位，留有更多资金应对波动',
              '搭配质量因子ETF，提高组合稳定性'
            ],
            performance: {
              normal: 5.3,
              optimized: 15.7,
              costReduction: 7.8
            }
          }
        },
        backtest: {
          baselineReturn: 13.6,
          normalReturn: 19.8,
          normalMaxDrawdown: 34.5,
          normalSharpeRatio: 0.58,
          optimizedReturn: 35.7,
          optimizedMaxDrawdown: 20.3,
          optimizedSharpeRatio: 1.15
        }
      };
      
    case 'sp500':
      return {
        name: '标普500',
        fullName: '美股 - 标普500',
        data: generateMockData(dateLabels.length, 2800, 6800, 3000),
        labels: dateLabels,
        trends: [
          {start: '2020-04', end: '2022-01', type: 'bull', desc: '美联储无限QE，科技股引领上涨', change: '+67.8%'},
          {start: '2022-01', end: '2022-10', type: 'bear', desc: '美联储激进加息，通胀高企', change: '-25.4%'},
          {start: '2022-10', end: '2024-12', type: 'bull', desc: 'AI热潮，经济软着陆预期，企业盈利超预期', change: '+78.9%'}
        ],
        indicators: {
          macro: {
            labels: ['GDP增速趋势', '制造业PMI', '货币政策', '企业盈利增速'],
            values: ['2.3% → 3.1%', '50.2 → 52.4', '从宽松到紧缩再到中性', '7.5% → 12.3%'],
            trends: ['up', 'up', 'neutral', 'up']
          },
          market: {
            labels: ['指数累计涨跌幅', 'PE分位波动', '日均成交额', '最大回撤'],
            values: ['+106.1%', '20% → 75%', '日均4500亿美元', '-25.4%'],
            trends: ['up', 'up', 'neutral', 'down']
          },
          sentiment: {
            labels: ['资金净流入', '恐惧贪婪指数', 'VIX波动率', '融资余额变化'],
            values: ['+1.2万亿美元', '20 → 78', '35 → 12', '+45%'],
            trends: ['up', 'up', 'down', 'up']
          }
        },
        strategy: {
          bull: {
            title: '牛市阶段定投策略',
            period: '2020年4月 - 2022年1月 & 2022年10月 - 2024年12月',
            core: '动态调整，分批止盈',
            points: [
              '初期保持正常定投，后期逐步降低至50%',
              '设置25%、50%、75%三档止盈点，逐步兑现收益',
              '关注美联储政策变化，加息周期开始后提高警惕',
              '采用估值定投，PE分位超过80%时大幅降低投入'
            ],
            performance: {
              normal: 98.3,
              optimized: 126.5,
              costReduction: 11.7
            }
          },
          bear: {
            title: '熊市阶段定投策略',
            period: '2022年1月 - 2022年10月',
            core: '把握节奏，逆向布局',
            points: [
              '采用5%跌幅加仓法：每下跌5%增加50%定投金额',
              '将资金分为10份，美联储加息周期不宜过度激进',
              'PE分位低于30%时，基础定投金额提高至计划的120%',
              '优先定投盈利稳定的大盘股和防御性行业'
            ],
            performance: {
              normal: -22.6,
              optimized: -8.3,
              costReduction: 13.2
            }
          },
          volatile: {
            title: '震荡市阶段定投策略',
            period: '无明显震荡市阶段',
            core: '灵活应变，顺势而为',
            points: [
              '设定较宽的波动区间，适应美股高波动特性',
              '结合美联储政策会议时间点调整定投节奏',
              '保持60%-80%仓位，兼顾进攻与防守',
              '搭配美国国债ETF对冲利率风险'
            ],
            performance: {
              normal: 7.5,
              optimized: 18.3,
              costReduction: 5.8
            }
          }
        },
        backtest: {
          baselineReturn: 106.1,
          normalReturn: 118.5,
          normalMaxDrawdown: 25.4,
          normalSharpeRatio: 1.85,
          optimizedReturn: 156.3,
          optimizedMaxDrawdown: 15.7,
          optimizedSharpeRatio: 2.37
        }
      };
      
    case 'ndx100':
      return {
        name: '纳斯达克100',
        fullName: '美股 - 纳斯达克100',
        data: generateMockData(dateLabels.length, 7500, 46500, 8000),
        labels: dateLabels,
        trends: [
          {start: '2020-04', end: '2021-11', type: 'bull', desc: '科技股引领，远程办公需求激增', change: '+93.3%'},
          {start: '2021-11', end: '2022-12', type: 'bear', desc: '美联储加息，高估值科技股承压', change: '-38.2%'},
          {start: '2022-12', end: '2024-12', type: 'bull', desc: 'AI革命，大型科技股盈利爆发', change: '+331.5%'}
        ],
        indicators: {
          macro: {
            labels: ['GDP增速趋势', '制造业PMI', '货币政策', '企业盈利增速'],
            values: ['2.3% → 3.1%', '50.2 → 52.4', '从宽松到紧缩再到中性', '12.5% → 25.3%'],
            trends: ['up', 'up', 'neutral', 'up']
          },
          market: {
            labels: ['指数累计涨跌幅', 'PE分位波动', '日均成交额', '最大回撤'],
            values: ['+416.7%', '30% → 85%', '日均3200亿美元', '-38.2%'],
            trends: ['up', 'up', 'neutral', 'down']
          },
          sentiment: {
            labels: ['资金净流入', '恐惧贪婪指数', 'VIX波动率', '融资余额变化'],
            values: ['+8500亿美元', '18 → 82', '38 → 11', '+65%'],
            trends: ['up', 'up', 'down', 'up']
          }
        },
        strategy: {
          bull: {
            title: '牛市阶段定投策略',
            period: '2020年4月 - 2021年11月 & 2022年12月 - 2024年12月',
            core: '动态平衡，及时止盈',
            points: [
              '初期正常定投，PE分位超过70%后降至40%',
              '设置30%、60%、90%三档止盈点，每档止盈30%',
              '高度关注美联储政策，加息周期减少高科技股配置',
              'AI热潮期间采用更严格的止盈纪律'
            ],
            performance: {
              normal: 385.2,
              optimized: 468.7,
              costReduction: 14.3
            }
},
          bear: {
            title: '熊市阶段定投策略',
            period: '2021年11月 - 2022年12月',
            core: '谨慎加仓，控制节奏',
            points: [
              '采用6%跌幅加仓法：高波动市场适当提高阈值',
              '将资金分为12份，避免过早用完子弹',
              'PE分位低于25%时，基础定投金额提高至计划的130%',
              '优先选择现金流稳定的科技巨头'
            ],
            performance: {
              normal: -32.8,
              optimized: -12.5,
              costReduction: 18.7
            }
          },
          volatile: {
            title: '震荡市阶段定投策略',
            period: '无明显震荡市阶段',
            core: '顺势而为，灵活调整',
            points: [
              '设定较宽的波动区间，适应高成长股特性',
              '季度调仓一次，根据财报季调整策略',
              '保持50%-70%仓位，防范高波动风险',
              '搭配少量黄金ETF对冲极端风险'
            ],
            performance: {
              normal: 9.2,
              optimized: 22.5,
              costReduction: 6.8
            }
          }
        },
        backtest: {
          baselineReturn: 416.7,
          normalReturn: 435.2,
          normalMaxDrawdown: 38.2,
          normalSharpeRatio: 2.15,
          optimizedReturn: 528.6,
          optimizedMaxDrawdown: 22.3,
          optimizedSharpeRatio: 2.87
        }
      };
      
    case 'gold':
      return {
        name: '黄金ETF',
        fullName: '黄金ETF',
        data: generateMockData(dateLabels.length, 320, 640, 350),
        labels: dateLabels,
        trends: [
          {start: '2020-01', end: '2020-08', type: 'bull', desc: '疫情避险需求，全球宽松政策', change: '+25.0%'},
          {start: '2020-08', end: '2022-02', type: 'volatile', desc: '经济复苏与通胀担忧并存', change: '±5.3%'},
          {start: '2022-02', end: '2024-12', type: 'bull', desc: '地缘政治冲突，通胀高企，央行购金增加', change: '+52.4%'}
        ],
        indicators: {
          macro: {
            labels: ['实际利率趋势', '美元指数', '通胀率', '地缘政治风险'],
            values: ['-1.5% → 1.2%', '90 → 102 → 95', '1.4% → 9.1% → 3.2%', '中 → 高'],
            trends: ['neutral', 'neutral', 'up', 'up']
          },
          market: {
            labels: ['累计涨跌幅', '全球持仓量', '日均成交额', '与美股相关性'],
            values: ['+100.0%', '3000吨 → 4200吨', '日均150亿美元', '负相关增强'],
            trends: ['up', 'up', 'neutral', 'neutral']
          },
          sentiment: {
            labels: ['ETF资金流入', '央行购金量', '恐惧贪婪指数', '投机者持仓'],
            values: ['+650亿美元', '+1200吨/年', '波动较大', '净多头增加'],
            trends: ['up', 'up', 'neutral', 'up']
          }
        },
        strategy: {
          bull: {
            title: '牛市阶段定投策略',
            period: '2020年1月 - 2020年8月 & 2022年2月 - 2024年12月',
            core: '把握趋势，适度止盈',
            points: [
              '通胀预期上升阶段保持正常定投',
              '设置20%、40%两档止盈点，每档止盈25%',
              '实际利率下降周期可增加定投金额',
              '与股票资产负相关增强时可提高配置比例'
            ],
            performance: {
              normal: 85.6,
              optimized: 112.3,
              costReduction: 7.5
            }
          },
          bear: {
            title: '熊市阶段定投策略',
            period: '2021年11月 - 2022年12月',
            core: '谨慎加仓，控制节奏',
            points: [
              '采用6%跌幅加仓法：高波动市场适当提高阈值',
              '将资金分为12份，避免过早用完子弹',
              'PE分位低于25%时，基础定投金额提高至计划的130%',
              '优先选择现金流稳定的科技巨头'
            ],
            performance: {
              normal: -32.8,
              optimized: -12.5,
              costReduction: 18.7
            }
          },
          volatile: {
            title: '震荡市阶段定投策略',
            period: '2020年8月 - 2022年2月',
            core: '区间操作，平衡配置',
            points: [
              '设定8%的波动区间，每下跌8%增加35%定投',
              '每上涨8%减少35%定投或卖出15%持仓',
              '保持组合中5%-10%的黄金配置作为对冲',
              '结合美元指数走势调整定投节奏'
            ],
            performance: {
              normal: 4.7,
              optimized: 13.2,
              costReduction: 5.2
            }
          }
        },
        backtest: {
          baselineReturn: 100.0,
          normalReturn: 105.3,
          normalMaxDrawdown: 18.7,
          normalSharpeRatio: 1.25,
          optimizedReturn: 138.6,
          optimizedMaxDrawdown: 12.4,
          optimizedSharpeRatio: 1.78
        }
      };
      
    default:
      return {};
  }
};

// 生成模拟数据
const generateMockData = (length, min, max, start) => {
  const data = [];
  let value = start;
  const range = max - min;
  
  for (let i = 0; i < length; i++) {
    // 添加一些随机波动
    const change = (Math.random() - 0.5) * range * 0.02;
    value += change;
    
    // 确保值在范围内
    if (value < min) value = min;
    if (value > max) value = max;
    
    data.push(Math.round(value));
  }
  return data;
};
</script>

<style type="text/tailwindcss">
@layer utilities {
  :root {
  --primary: #165DFF;
  --bull: #00B42A;
  --bear: #F53F3F;
  --volatile: #FF7D00;
  --neutral: #4E5969;
  --light: #F2F3F5;
  --dark: #1D2129;
}
/* Timeline styling */
.timeline-dot {
  position: absolute;
  left: -2.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
}

.timeline-line {
  position: absolute;
  left: -2.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
}
/* Indicator styling */

.indicator-down {

  color: var(--color-bull);
}

.indicator-neutral {
 
  color: var(--color-bear);
}
/* Card hover effect */
.card-hover {
  color: var(--color-neutral);
}

/* Gradient background */
.gradient-bg {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.card-hover:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-shadow);
  --tw-translate-y: -0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  background-color: var(--color-light);
}
  .content-auto {
    content-visibility: auto;
  }
  .card-hover {
      /* transition-all duration-300：所有属性过渡，时长300ms */
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    /* hover:shadow-lg： hover时的阴影效果 */
    .card-hover:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    /* hover:-translate-y-1：hover时向上偏移0.25rem */
    .card-hover:hover {
      transform: translateY(-0.25rem);
    }
    .indicator-up {
      color: var(--bull);
    }
  .indicator-down {
    color: var(--bear);
  }
  .indicator-neutral {
    color: var(--volatile);
  }

  .gradient-bg {
    background-image: linear-gradient(to bottom right, rgba(22, 93, 255, 0.9), #165DFF);
}

  .timeline-dot {
      position: absolute;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 9999px;
      left: -7px;
      top: 50%;
      transform: translateY(-50%);
    }
    .timeline-line {
      position: absolute;
      width: 0.125rem;
      height: 100%;
      left: -6px;
      top: 0;
}
}
.font-inter {
  font-family: 'Inter', system-ui, sans-serif;
}

.font-mono {
  font-family: 'SFMono-Regular', Menlo, monospace;
}

.text-bull {
  color: var(--bull);
}

.text-bear {
  color: var(--bear);
}

.text-volatile {
  color: var(--volatile);
}

.text-primary {
  color: var(--primary);
}

.bg-bull {
  background-color: var(--bull);
}

.bg-bear {
  background-color: var(--bear);
}

.bg-volatile {
  background-color: var(--volatile);
}

.bg-primary {
  background-color: var(--primary);
}

.bg-light {
  background-color: var(--light);
}

.bg-dark {
  background-color: var(--dark);
}
</style>