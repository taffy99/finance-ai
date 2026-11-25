<template>
  <div class="min-h-screen bg-gray-50 font-inter text-dark">
    <header class="sticky top-0 z-30">
      <div class="container mx-auto rounded-xl bg-primary px-4 py-4 text-white shadow-lg shadow-primary/20 md:py-5">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/10">
              <i class="fa fa-line-chart text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold">智能定投策略分析工具</h1>
              <p class="mt-1 text-sm text-white/80">多基金分析 · 智能策略 · 收益优化</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button class="hidden rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 md:inline-flex">
              导出报告
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <nav class="mb-6 flex rounded-xl bg-white p-2 shadow-sm" aria-label="基金分析类型">
        <router-link
          to="/multiStrategy"
          class="flex-1 rounded-lg px-4 py-3 text-center font-medium transition-colors"
          active-class="bg-primary text-white"
        >
          单个基金分析
        </router-link>
        <router-link
          to="/fundCorrelation"
          class="flex-1 rounded-lg px-4 py-3 text-center font-medium transition-colors"
          active-class="bg-primary text-white"
        >
          多基金相关分析
        </router-link>
      </nav>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { MarketAPI } from '../lib/api.js';

void MarketAPI.getMarkets().catch(error => {
  console.error('[FundAnalysis] Failed to preload fund list', error);
});
</script>
