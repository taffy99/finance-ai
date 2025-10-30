import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import HomeView from "../components/Home.vue"
import Dashboard from "../views/Dashboard.vue"
import Transactions from "../views/Transactions.vue"
import Budget from "../views/Budget.vue"
import Investments from "../views/Investments.vue"
import Reports from "../views/Reports.vue"
import AiAssistant from "../views/AiAssistant.vue"
import AiEftAnalyzer from "../views/AiEftAnalyzer.vue"
import Settings from "../views/Settings.vue"
import FundStrategy from "../components/FundStrategy.vue"
import MultiStrategy from "../components/MultiStrategy.vue"
const routes = [
  {
    path: '/',
    redirect: '/dashboard'  // 根路径重定向到仪表盘
  },
  {// 父页面包含子页面内容 <router-view />
    path: '/',
    name: 'home',
    component: HomeView,  // 父组件
    children: [
      {
        path: 'dashboard', //仪表盘 子路径（相对路径）
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'transactions', //智能记账 子路径（相对路径）
        name: 'transactions',
        component: Transactions
      },
      {
        path: 'budget', //预算管理
        name: 'budget',
        component: Budget
      },
      {
        path: 'investments', // 投资分析
        name: 'investments',
        component: Investments,
      },
      {
        path: 'reports', // 财务报告
        name: 'reports',
        component: Reports
      },
      {
        path: 'ai-assistant', // AI助手
        name: 'aiAssistant',
        component: AiAssistant
      },
      {
        path: 'ai-eft-analyzer', // AI ETF 分析器
        name: 'aiEftAnalyzer',
        component: AiEftAnalyzer
      },
      {
        path: 'settings', // 设置
        name: 'settings',
        component: Settings
      },
      {
        path: 'multiStrategy', // 多维度策略
        name: MultiStrategy,
        component: MultiStrategy
      },
      {
        path: 'fundStrategy', // 基金定投策略
        name: FundStrategy,
        component: FundStrategy
      }
    ]
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router