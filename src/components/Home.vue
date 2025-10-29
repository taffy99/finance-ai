
<template>
  <div class="min-h-screen">
    <div class="flex flex-col md:flex-row min-h-screen">
    <!-- 侧边导航栏 -->
    <aside class="sidebar bg-white shadow-lg h-auto md:h-screen fixed md:sticky top-0 left-0 z-10 transition-all" :class="sidebarCollapsed ? 'sidebar-collapsed' : ''">
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <i class="fas fa-chart-pie"></i>
          </div>
          <h1 class="ml-3 text-xl font-bold" v-if="!sidebarCollapsed">AI理财助手</h1>
        </div>
        <button @click="toggleSidebar" class="p-2 rounded-full hover:bg-gray-100">
          <i class="fas" :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>
      <nav class="sidebar-menu">
        <router-link 
          to="/dashboard" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('dashboard') ? 'active' : ''"
        >
          <i class="fas fa-tachometer-alt w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">仪表盘</span>
        </router-link>
        <router-link 
          to="/transactions" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('transactions') ? 'active' : ''"
        >
          <i class="fas fa-exchange-alt w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">智能记账</span>
        </router-link>
        <router-link 
          to="/budget" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('budget') ? 'active' : ''"
        >
          <i class="fas fa-piggy-bank w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">预算管理</span>
        </router-link>
        <router-link 
          to="/investments" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('investments') ? 'active' : ''"
        >
          <i class="fas fa-chart-line w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">投资分析</span>
        </router-link>
        <router-link 
          to="/reports" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('reports') ? 'active' : ''"
        >
          <i class="fas fa-file-alt w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">财务报告</span>
        </router-link>
        <router-link 
          to="/ai-assistant" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('ai-assistant') ? 'active' : ''"
        >
          <i class="fas fa-robot w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">AI助手</span>
        </router-link>
        <router-link 
          to="/settings" 
          class="sidebar-item flex items-center p-4 text-gray-700 hover:text-blue-500"
          :class="isActive('settings') ? 'active' : ''"
        >
          <i class="fas fa-cog w-6"></i>
          <span class="ml-3" v-if="!sidebarCollapsed">设置</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <main class="flex-1 p-4 md:p-6 main-content">
      <header class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold"></h2>
          <p class="text-gray-500"></p>
        </div>
        <!-- <div class="flex items-center">
          <div class="relative mr-4">
            <input type="text" placeholder class="input-field pl-10">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i class="fas fa-user text-gray-600"></i>
          </div>
        </div> -->
      </header>
      <!-- 路由视图 -->
      <router-view />
    </main>
  </div>
</div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useRoute }  from 'vue-router'
// 注册数据类型
// 侧边栏状态
const sidebarCollapsed = ref(false)
// 路由
const route = useRoute()
const currentRoute = ref(route.path)
// 注册 Chart.js 组件
Chart.register(...registerables)
onMounted(() => {
   // currentRoute.value = route.path

})
watch (()=> route.path, (newPath)=>{
  currentRoute.value = newPath
})


// 方法 修改值（必须使用 .value）
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
const isActive = (route) => {
  if(route == 'investments' && (currentRoute.value=='/multiStrategy' || currentRoute.value=='/fundStrategy')) {
      return true
  }
  return currentRoute.value === `/${route}`
}
</script>

    
   
