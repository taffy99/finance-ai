<template>
  <div class="min-h-screen bg-gray-50 font-inter text-dark">
    <!-- 顶部导航 -->
    <header class="gradient-bg text-white shadow-md rounded-b-xl sticky top-0 z-30">
      <div class="container mx-auto px-4 py-4 md:py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center">
              <i class="fa fa-line-chart text-2xl"></i>
            </div>
            <div>
              <h1 class="text-[clamp(1.25rem,2.4vw,2rem)] font-bold tracking-tight">智能定投策略分析工具</h1>
              <p class="text-white/80 mt-1 text-sm">多市场分析 · 智能策略 · 收益优化</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div v-if="lastUpdated" class="text-sm bg-white/10 px-3 py-2 rounded-full flex items-center gap-2">
              <i class="fa fa-clock-o"></i>
              <span>更新: {{ lastUpdated }}</span>
            </div>
            <button class="hidden md:inline-flex bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm">
              导出报告
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 筛选条件区 -->
      <section class="mb-10 bg-white rounded-xl shadow-sm p-6 transform hover:shadow-lg transition-all duration-300">
        <div class="flex items-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
            <i class="fa fa-filter text-primary text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold">市场与时间筛选</h2>
            <p class="text-neutral text-sm mt-1">选择目标市场和分析时间范围</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 市场选择 -->
          <div class="group">
            <label class="block text-neutral mb-2 font-medium flex items-center">
              <i class="fa fa-chart-line mr-2 text-primary/70"></i>
              选择市场
            </label>
            <div class="relative">
              <select 
                v-model="selectedMarket" 
                class="appearance-none bg-light border-2 border-gray-100 rounded-xl py-3.5 px-5 pr-10 w-full text-lg
                       transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                       group-hover:border-primary/30"
                @change="handleMarketChange"
              >
                <option value="000008">国内 - 中证500</option>
                <option value="110020">国内 - 沪深300</option>
                <option value="050025">美股 - 标普500</option>
                <option value="000834">美股 - 纳斯达克100</option>
                <option value="002963">黄金ETF</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral/70 group-hover:text-primary/70 transition-colors duration-300">
                <i class="fa fa-chevron-down"></i>
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
            <span v-if="!isLoading" class="text-lg">分析市场趋势与策略</span>
            <span v-if="isLoading" class="flex items-center text-lg">
              <i class="fa fa-spinner fa-spin mr-3"></i> 加载中...
            </span>
          </button>
        </div>
      </section>

      <!-- 市场趋势概览 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 ">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold" id="trend-title">
                {{ currentMarketInfo.fullName }} ({{ formatDate(startDate) }}-{{ formatDate(endDate) }}) 市场趋势分析
              </h2>
              <p class="text-neutral mt-1">基于宏观经济、市场数据和情绪指标的综合判断</p>
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

      <!-- 核心指标分析 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">核心指标分析</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 宏观经济指标 -->
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <i class="fa fa-university text-primary"></i>
                </div>
                <h3 class="font-semibold text-lg">宏观经济指标</h3>
              </div>
              
              <ul class="space-y-4">
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.macro.labels[0] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.macro.trends[0])" class="font-mono">
                    {{ currentMarketInfo.indicators.macro.values[0] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.macro.labels[1] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.macro.trends[1])" class="font-mono">
                    {{ currentMarketInfo.indicators.macro.values[1] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.macro.labels[2] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.macro.trends[2])" class="font-mono">
                    {{ currentMarketInfo.indicators.macro.values[2] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.macro.labels[3] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.macro.trends[3])" class="font-mono">
                    {{ currentMarketInfo.indicators.macro.values[3] }}
                  </span>
                </li>
              </ul>
            </div>
            
            <!-- 市场核心数据 -->
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <i class="fa fa-bar-chart text-primary"></i>
                </div>
                <h3 class="font-semibold text-lg">市场核心数据</h3>
              </div>
              
              <ul class="space-y-4">
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.market.labels[0] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.market.trends[0])" class="font-mono">
                    {{ currentMarketInfo.indicators.market.values[0] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.market.labels[1] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.market.trends[1])" class="font-mono">
                    {{ currentMarketInfo.indicators.market.values[1] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.market.labels[2] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.market.trends[2])" class="font-mono">
                    {{ currentMarketInfo.indicators.market.values[2] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.market.labels[3] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.market.trends[3])" class="font-mono">
                    {{ currentMarketInfo.indicators.market.values[3] }}
                  </span>
                </li>
              </ul>
            </div>
            
            <!-- 资金与情绪 -->
            <div class="bg-light/50 rounded-lg p-5 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <i class="fa fa-users text-primary"></i>
                </div>
                <h3 class="font-semibold text-lg">资金与情绪</h3>
              </div>
              
              <ul class="space-y-4">
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.sentiment.labels[0] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.sentiment.trends[0])" class="font-mono">
                    {{ currentMarketInfo.indicators.sentiment.values[0] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.sentiment.labels[1] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.sentiment.trends[1])" class="font-mono">
                    {{ currentMarketInfo.indicators.sentiment.values[1] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.sentiment.labels[2] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.sentiment.trends[2])" class="font-mono">
                    {{ currentMarketInfo.indicators.sentiment.values[2] }}
                  </span>
                </li>
                <li class="flex justify-between items-center">
                  <span>{{ currentMarketInfo.indicators.sentiment.labels[3] }}</span>
                  <span :class="getIndicatorClass(currentMarketInfo.indicators.sentiment.trends[3])" class="font-mono">
                    {{ currentMarketInfo.indicators.sentiment.values[3] }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 定投策略建议 -->
      <section class="mb-10" v-if="showResults">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">智能定投策略建议</h2>
          
          <div class="mb-8">
            <p class="text-neutral leading-relaxed">
              根据市场趋势分析，以下是针对{{ currentMarketInfo.name }}在{{ formatDate(startDate) }}-{{ formatDate(endDate) }}期间的优化定投策略，旨在降低持仓成本，提高综合收益率：
            </p>
          </div>
          
          <!-- 分阶段策略 -->
          <div class="space-y-8">
            <!-- 牛市阶段策略 -->
            <div class="border border-bull/30 rounded-lg overflow-hidden">
              <div class="bg-bull/10 px-6 py-4">
                <h3 class="font-semibold text-lg flex items-center">
                  <span class="w-3 h-3 rounded-full bg-bull mr-2"></span>
                  {{ currentMarketInfo.strategy.bull.title }} ({{ currentMarketInfo.strategy.bull.period }})
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-3">核心策略：{{ currentMarketInfo.strategy.bull.core }}</h4>
                    <ul class="list-disc pl-5 text-neutral space-y-2">
                      <li v-for="(point, index) in currentMarketInfo.strategy.bull.points" :key="index">
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium mb-3">策略效果预期</h4>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>普通定投收益率</span>
                          <span class="font-medium">
                            {{ currentMarketInfo.strategy.bull.performance.normal > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.bull.performance.normal }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-neutral h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.bull.performance.normal)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>优化策略收益率</span>
                          <span class="font-medium text-bull">
                            {{ currentMarketInfo.strategy.bull.performance.optimized > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.bull.performance.optimized }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-bull h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.bull.performance.optimized)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>成本降低比例</span>
                          <span class="font-medium text-bull">-{{ currentMarketInfo.strategy.bull.performance.costReduction }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-primary h-2 rounded-full" 
                               :style="{ width: Math.min(100, currentMarketInfo.strategy.bull.performance.costReduction * 5) + '%' }">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 熊市阶段策略 -->
            <div class="border border-bear/30 rounded-lg overflow-hidden">
              <div class="bg-bear/10 px-6 py-4">
                <h3 class="font-semibold text-lg flex items-center">
                  <span class="w-3 h-3 rounded-full bg-bear mr-2"></span>
                  {{ currentMarketInfo.strategy.bear.title }} ({{ currentMarketInfo.strategy.bear.period }})
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-3">核心策略：{{ currentMarketInfo.strategy.bear.core }}</h4>
                    <ul class="list-disc pl-5 text-neutral space-y-2">
                      <li v-for="(point, index) in currentMarketInfo.strategy.bear.points" :key="index">
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium mb-3">策略效果预期</h4>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>普通定投收益率</span>
                          <span class="font-medium" :class="currentMarketInfo.strategy.bear.performance.normal < 0 ? 'text-bear' : ''">
                            {{ currentMarketInfo.strategy.bear.performance.normal > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.bear.performance.normal }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-neutral h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.bear.performance.normal)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>优化策略收益率</span>
                          <span class="font-medium" :class="currentMarketInfo.strategy.bear.performance.optimized < 0 ? 'text-bear' : 'text-bull'">
                            {{ currentMarketInfo.strategy.bear.performance.optimized > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.bear.performance.optimized }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div :class="currentMarketInfo.strategy.bear.performance.optimized < 0 ? 'bg-bear' : 'bg-bull'" 
                               class="h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.bear.performance.optimized)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>成本降低比例</span>
                          <span class="font-medium text-bull">-{{ currentMarketInfo.strategy.bear.performance.costReduction }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-primary h-2 rounded-full" 
                               :style="{ width: Math.min(100, currentMarketInfo.strategy.bear.performance.costReduction * 5) + '%' }">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 震荡市阶段策略 -->
            <div class="border border-volatile/30 rounded-lg overflow-hidden">
              <div class="bg-volatile/10 px-6 py-4">
                <h3 class="font-semibold text-lg flex items-center">
                  <span class="w-3 h-3 rounded-full bg-volatile mr-2"></span>
                  {{ currentMarketInfo.strategy.volatile.title }} ({{ currentMarketInfo.strategy.volatile.period }})
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-3">核心策略：{{ currentMarketInfo.strategy.volatile.core }}</h4>
                    <ul class="list-disc pl-5 text-neutral space-y-2">
                      <li v-for="(point, index) in currentMarketInfo.strategy.volatile.points" :key="index">
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium mb-3">策略效果预期</h4>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>普通定投收益率</span>
                          <span class="font-medium">
                            {{ currentMarketInfo.strategy.volatile.performance.normal > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.volatile.performance.normal }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-neutral h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.volatile.performance.normal)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>优化策略收益率</span>
                          <span class="font-medium text-bull">
                            {{ currentMarketInfo.strategy.volatile.performance.optimized > 0 ? '+' : '' }}
                            {{ currentMarketInfo.strategy.volatile.performance.optimized }}%
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-bull h-2 rounded-full" 
                               :style="{ width: Math.min(100, Math.abs(currentMarketInfo.strategy.volatile.performance.optimized)) + '%' }">
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span>成本降低比例</span>
                          <span class="font-medium text-bull">-{{ currentMarketInfo.strategy.volatile.performance.costReduction }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-primary h-2 rounded-full" 
                               :style="{ width: Math.min(100, currentMarketInfo.strategy.volatile.performance.costReduction * 5) + '%' }">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <div class="flex items-center">
                      <span>定投策略选择</span>
                      <!-- tooltip wrapper: 使用 group 以便在 hover 时显示 tooltip -->
                      <span class="relative inline-block ml-2 group">
                        <i class="fa fa-info-circle text-neutral/500 group-hover:text-primary cursor-pointer" aria-hidden="true"></i>

                        <!-- 优化后的自定义 tooltip：渐变背景、柔和阴影、淡入位移动画、整齐排版 -->
                        <div class="pointer-events-none absolute left-1/2 transform -translate-x-1/2 top-full mt-3 max-w-xs w-80 bg-light text-neutral-900 text-sm p-3 rounded-lg shadow-md border border-gray-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                          <!-- 箭头：与浅灰背景一致，使用轻边框 -->
                          <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-light rotate-45 border-t border-l border-gray-200"></div>

                          <div class="leading-relaxed text-sm">
                            <div class="font-medium mb-2">策略说明</div>
                            <ul class="list-disc ml-4 space-y-1 text-[13px] text-neutral-700">
                              <li><span class="font-medium">普通定投（DCA）</span> — 按固定金额在每个期次买入，长期成本平均化。</li>
                              <li><span class="font-medium">智能优化</span> — 根据价格波动动态调整投入，示例规则如下：</li>
                            </ul>
                            <div class="mt-2 text-[13px] text-neutral-600 pl-4">
                              • 若本期相对上期下跌 ≥ 4%，则本期投入 = 基础投入 × 1.5（加仓）
                            </div>
                            <div class="mt-1 text-[13px] text-neutral-600 pl-4">
                              • 若本期相对上期上涨 ≥ 4%，则本期投入 = 基础投入 × 0.7（减仓）
                            </div>
                            <div class="mt-2 text-xs text-neutral-500">提示：示例规则为演示用途，可后续扩展为可配置策略参数。</div>
                          </div>
                        </div>
                      </span>
                    </div>
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
                  
                  <div class="mt-4">
                    <canvas id="return-chart" height="180"></canvas>
                  </div>
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
              以下是基于历史数据的策略回测结果，展示了在{{ formatDate(startDate) }}-{{ formatDate(endDate) }}期间，普通定投与智能优化定投的表现对比：
            </p>
          </div>
          
          <div class="h-80 mb-8">
            <canvas id="backtest-chart"></canvas>
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
                  <span>严格按照市场趋势切换策略，避免情绪干扰</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>提前规划资金分配，确保熊市有足够加仓资金</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>定期（每月）回顾市场趋势，确认策略适用性</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>止盈资金需及时转出，避免回调吞噬收益</span>
                </li>
                <li class="flex">
                  <i class="fa fa-angle-right text-primary mt-1 mr-2"></i>
                  <span>不同市场采用差异化策略参数（如黄金ETF波动阈值可提高）</span>
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
    </main>
  </div>
</template>



<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import axios from 'axios';
import MonthPicker from './MonthPicker.vue';
import { useMarketAnalysis } from '../composables/useMarketAnalysis.js';


// 注册Chart.js组件
Chart.register(...registerables, annotationPlugin);

// 状态管理
const selectedMarket = ref('000008');
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

// 定投计算器状态
const monthlyInvestment = ref(1000);
const calculatorStartDate = ref('2020-01-01');
const calculatorEndDate = ref('2024-12-31');
const selectedStrategy = ref('optimized');
// 定投频率：'weekly' | 'biweekly' | 'monthly'
const contributionFrequency = ref('monthly');
const showCalculationResults = ref(false);
const calculationResults = ref({});
const returnChart = ref(null);

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
  const series = (currentMarketInfo.value && currentMarketInfo.value.dailySeries) || [];
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
const simulateInvestment = (startStr, endStr, freq, amountPerPeriod, strategyType) => {
  const schedule = buildScheduleDates(startStr, endStr, freq);
  if (!schedule.length) return null;
  const seriesPrices = schedule.map(d => ({ date: d, price: getPriceNearest(d) }));
  // 过滤掉所有无法取到价格的期次
  const valid = seriesPrices.filter(p => p.price != null);
  if (!valid.length) return null;

  const baselineStartPrice = valid[0].price;
  const baselineSeries = valid.map(p => (p.price / baselineStartPrice) * 10000);

  let normalTotalShares = 0;
  let normalTotalInvested = 0;
  const normalValueSeries = [];

  let optimizedTotalShares = 0;
  let optimizedTotalInvested = 0;
  const optimizedValueSeries = [];

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
      if (pct <= -0.04) multiplier = 1.5;
      else if (pct >= 0.04) multiplier = 0.7;
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
    labels: valid.map(v => v.date)
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
// 将 DOM canvas 与 Chart 实例分离
const marketTrendCanvas = ref(null);
const marketTrendChart = ref(null); // Chart 实例

// 从 composable 中获取数据加载方法（useMarketAnalysis 导出一个工厂函数）
const { fetchMarketData } = useMarketAnalysis();

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

// 初始化日期
onMounted(() => {
  // 设置默认结束日期为当前日期，格式 YYYY-MM-DD
  const today = new Date();
  const defaultEndDate = _formatDateYMD(today);
  endDate.value = defaultEndDate;
  calculatorEndDate.value = defaultEndDate;

});

// 监听市场变化
// watch(selectedMarket, () => {
//   loadMarketData(selectedMarket.value, startDate.value, endDate.value);
// });
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
  
  // 生成回测数据
  generateBacktestData();
  
  // 延迟显示结果，模拟加载过程
  setTimeout(async () => {
    // 先渲染结果区域，再初始化依赖 DOM 的图表
    showResults.value = true;
    await nextTick();
    initMarketTrendChart();
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
        pointBackgroundColor: '#165DFF',
        pointRadius: 2
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

  // 使用日序列计算按频率的定投结果
  if (!currentMarketInfo.value || !Array.isArray(currentMarketInfo.value.dailySeries)) {
    alert('市场日度数据不可用，请先分析市场以加载数据');
    return;
  }

  const sim = simulateInvestment(
    calculatorStartDate.value,
    calculatorEndDate.value,
    contributionFrequency.value,
    monthlyInvestment.value,
    selectedStrategy.value
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

  // 生成收益图表（柱状图）
  initReturnChart();

  showCalculationResults.value = true;
};

// 当用户切换定投频率或定投策略时，若当前已显示计算结果则自动刷新计算
watch([contributionFrequency, selectedStrategy], () => {
  if (showCalculationResults.value) {
    // 重新计算收益，保持交互即时响应
    try {
      calculateReturns();
    } catch (e) {
      console.error('自动刷新计算失败', e);
    }
  }
});

// 初始化收益图表
const initReturnChart = () => {
  // 销毁现有图表
  if (returnChart.value) {
    returnChart.value.destroy();
  }
  
  const el = document.getElementById('return-chart');
  const create = (ctx) => {
    returnChart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['总投入', '总收益', '期末总资产'],
        datasets: [{
          label: '金额 (元)',
          data: [
            calculationResults.value.totalInvestment,
            calculationResults.value.totalProfit,
            calculationResults.value.finalAmount
          ],
          backgroundColor: [
            'rgba(78, 89, 105, 0.7)',
            calculationResults.value.totalProfit > 0 ? 'rgba(0, 180, 42, 0.7)' : 'rgba(245, 63, 63, 0.7)',
            'rgba(22, 93, 255, 0.7)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `¥ ${formatNumber(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
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
  };

  if (!el) {
    nextTick(() => {
      const el2 = document.getElementById('return-chart');
      if (!el2) return;
      const ctx2 = el2.getContext && el2.getContext('2d');
      if (ctx2) create(ctx2);
    });
    return;
  }

  const ctx = el.getContext('2d');
  create(ctx);
};

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
  const baselineData = priceSeries.map(p => (p / baselineStartPrice) * 10000); // 以10000为基准金额

  // 定投模拟（普通定投）：每月在当月价格买入固定份额
  const monthlyAmt = Number(monthlyInvestment.value) || 1000;
  const normalShares = [];
  const normalValueSeries = [];
  let normalTotalShares = 0;
  let normalTotalInvested = 0;

  // 优化定投：基于简单的价格变动规则动态调整当月投入
  // 规则示例：本月相对上月下跌 >=4% => 加仓 1.5x；上涨 >=4% => 减仓 0.7x；否则 1x
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
      if (pct <= -0.04) multiplier = 1.5; // 跌幅>=4%加仓
      else if (pct >= 0.04) multiplier = 0.7; // 涨幅>=4%减少投入
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

  const labels = backtestInfo.value.labels.map(l => {
    // 只在每6个月显示标签，避免拥挤
    const parts = l.split('-');
    const date = new Date(parts[0], parseInt(parts[1], 10) - 1, 1);
    return date.getMonth() % 6 === 0 ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` : '';
  });

  const baselineData = backtestInfo.value.baselineSeries || [];
  const normalData = backtestInfo.value.normalSeries || [];
  const optimizedData = backtestInfo.value.optimizedSeries || [];

  const el = document.getElementById('backtest-chart');
  const create = (ctx) => {
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
  };

  if (!el) {
    nextTick(() => {
      const el2 = document.getElementById('backtest-chart');
      if (!el2) return;
      const ctx2 = el2.getContext && el2.getContext('2d');
      if (ctx2) create(ctx2);
    });
    return;
  }

  const ctx = el.getContext('2d');
  create(ctx);
};

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
            period: '无明显熊市阶段',
            core: '逆向布局，长期配置',
            points: [
              '实际利率上升阶段减少定投至70%',
              '美元指数走强时降低投入节奏',
              '每下跌8%增加40%定投金额，黄金波动相对较小',
              '作为组合对冲工具，保持基础仓位'
            ],
            performance: {
              normal: -3.2,
              optimized: 5.8,
              costReduction: 6.3
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