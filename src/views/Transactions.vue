  <!-- 智能记账页面 -->
  <template id="transactions-page">
    <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">智能记账</h2>
        <p class="text-gray-500">记录和管理您的所有收支交易</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button class="btn btn-outline">
          <i class="fas fa-filter mr-2"></i> 筛选
        </button>
        <button class="btn btn-primary" @click="showAddModal">
          <i class="fas fa-plus mr-2"></i> 添加交易
        </button>
      </div>
    </div>
    
    <!-- 交易统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card p-6">
        <p class="text-gray-500 text-sm">本月收入</p>
        <h3 class="text-2xl font-bold mt-1 text-green-500">¥12,580</h3>
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span>较上月</span>
            <span class="text-green-500">+12.5%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-green-500" style="width: 75%"></div>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">本月支出</p>
        <h3 class="text-2xl font-bold mt-1 text-red-500">¥8,340</h3>
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span>较上月</span>
            <span class="text-red-500">+8.2%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-red-500" style="width: 68%"></div>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <p class="text-gray-500 text-sm">本月结余</p>
        <h3 class="text-2xl font-bold mt-1 text-blue-500">¥4,240</h3>
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span>储蓄率</span>
            <span class="text-blue-500">33.7%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-blue-500" style="width: 33.7%"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 交易分类标签 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button class="px-4 py-2 rounded-full bg-blue-500 text-white">全部</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">日常消费</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">餐饮</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">交通</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">住房</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">娱乐</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">购物</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">医疗</button>
      <button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">教育</button>
    </div>
    
    <!-- 交易列表 -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">描述</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">分类</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">账户</th>
              <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
              <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
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
              <td class="py-3 px-4 text-sm">招商银行</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥358</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
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
              <td class="py-3 px-4 text-sm">工商银行</td>
              <td class="py-3 px-4 text-sm text-right text-green-500">+¥10,000</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
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
              <td class="py-3 px-4 text-sm">微信支付</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥245</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
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
              <td class="py-3 px-4 text-sm">中国石油</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥300</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
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
              <td class="py-3 px-4 text-sm">建设银行</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥3,500</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-sm">2023-06-05</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <i class="fas fa-film text-red-500"></i>
                  </div>
                  <span>电影票</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm"><span class="badge badge-warning">娱乐</span></td>
              <td class="py-3 px-4 text-sm">支付宝</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥98</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-sm">2023-06-03</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <i class="fas fa-hand-holding-usd text-green-500"></i>
                  </div>
                  <span>兼职收入</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm"><span class="badge badge-success">其他收入</span></td>
              <td class="py-3 px-4 text-sm">微信支付</td>
              <td class="py-3 px-4 text-sm text-right text-green-500">+¥2,580</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-sm">2023-06-01</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <i class="fas fa-mobile-alt text-blue-500"></i>
                  </div>
                  <span>手机话费</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm"><span class="badge badge-info">通讯</span></td>
              <td class="py-3 px-4 text-sm">中国移动</td>
              <td class="py-3 px-4 text-sm text-right text-red-500">-¥199</td>
              <td class="py-3 px-4 text-sm text-right">
                <button class="text-gray-500 hover:text-blue-500 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t flex justify-between items-center">
        <div class="text-sm text-gray-500">显示 1-8 条，共 42 条</div>
        <div class="flex space-x-1">
          <button class="w-8 h-8 flex items-center justify-center rounded border text-gray-400 cursor-not-allowed">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded border bg-blue-500 text-white">1</button>
          <button class="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50">2</button>
          <button class="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50">3</button>
          <button class="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加交易模态框 -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" v-if="showAddTransactionModal">
      <div class="bg-white rounded-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">添加交易</h3>
            <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">交易类型</label>
              <div class="flex space-x-4">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="type" value="expense" class="hidden" checked>
                  <div class="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center mr-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <span>支出</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="type" value="income" class="hidden">
                  <div class="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center mr-2">
                    <div class="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  <span>收入</span>
                </label>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">金额</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                <input type="text" class="input-field pl-8" placeholder="0.00">
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">分类</label>
              <select class="input-field">
                <option>日常消费</option>
                <option>餐饮</option>
                <option>交通</option>
                <option>住房</option>
                <option>娱乐</option>
                <option>购物</option>
                <option>医疗</option>
                <option>教育</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">描述</label>
              <input type="text" class="input-field" placeholder="请输入交易描述">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">日期</label>
              <input type="date" class="input-field">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">账户</label>
              <select class="input-field">
                <option>招商银行</option>
                <option>工商银行</option>
                <option>建设银行</option>
                <option>微信支付</option>
                <option>支付宝</option>
              </select>
            </div>
            <div class="flex space-x-3">
              <button type="button" class="btn btn-outline flex-1" @click="closeAddModal">
                取消
              </button>
              <button type="button" class="btn btn-primary flex-1" @click="closeAddModal">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</div>
  </template>

<script setup>
import { ref } from 'vue'
// 显示模态框
const showAddTransactionModal = ref(false)

const showAddModal= () => {
  showAddTransactionModal.value = true
}
const closeAddModal= () => {
  showAddTransactionModal.value = false
}

</script>