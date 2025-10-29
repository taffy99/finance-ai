 <!-- 设置页面 -->
 <template id="settings-page">
    <div>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">设置</h2>
        <p class="text-gray-500">管理您的账户和应用设置</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="btn btn-primary">
          <i class="fas fa-save mr-2"></i> 保存设置
        </button>
      </div>
    </div>
    
    <!-- 设置选项卡 -->
    <div class="border-b mb-6">
      <div class="flex overflow-x-auto">
        <button class="tab active">个人信息</button>
        <button class="tab">账户管理</button>
        <button class="tab">通知设置</button>
        <button class="tab">数据与隐私</button>
        <button class="tab">AI助手设置</button>
        <button class="tab">主题与外观</button>
      </div>
    </div>
    
    <!-- 设置内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 个人信息 -->
      <div class="card p-6 lg:col-span-2">
        <h3 class="text-lg font-semibold mb-6">个人信息</h3>
        <form>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">姓名</label>
              <input type="text" class="input-field" value="张三">
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">性别</label>
              <select class="input-field">
                <option>男</option>
                <option>女</option>
                <option>其他</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">出生日期</label>
              <input type="date" class="input-field" value="1990-01-01">
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">手机号码</label>
              <input type="tel" class="input-field" value="138****1234">
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">电子邮箱</label>
              <input type="email" class="input-field" value="zhangsan@example.com">
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">职业</label>
              <input type="text" class="input-field" value="软件工程师">
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-2">月收入范围</label>
            <select class="input-field">
              <option>5000元以下</option>
              <option>5000-10000元</option>
              <option selected>10000-20000元</option>
              <option>20000-50000元</option>
              <option>50000元以上</option>
            </select>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-2">财务目标</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3" checked>
                <span>短期储蓄</span>
              </label>
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3" checked>
                <span>购房计划</span>
              </label>
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3">
                <span>子女教育</span>
              </label>
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3" checked>
                <span>退休规划</span>
              </label>
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3">
                <span>投资增值</span>
              </label>
              <label class="flex items-center p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" class="mr-3">
                <span>债务偿还</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">风险承受能力</label>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-3">低</span>
              <input type="range" min="1" max="5" value="3" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              <span class="text-sm text-gray-500 ml-3">高</span>
            </div>
            <div class="text-center mt-2 text-sm text-gray-500">中等风险</div>
          </div>
        </form>
      </div>
      
      <!-- 头像和密码 -->
      <div class="space-y-6">
        <!-- 头像设置 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">头像设置</h3>
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
              <i class="fas fa-user text-gray-400 text-4xl"></i>
            </div>
            <button class="btn btn-outline mb-2">
              <i class="fas fa-upload mr-2"></i> 上传头像
            </button>
            <button class="btn btn-outline text-sm">
              <i class="fas fa-trash mr-2"></i> 移除头像
            </button>
          </div>
        </div>
        
        <!-- 密码设置 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">密码设置</h3>
          <form>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">当前密码</label>
              <input type="password" class="input-field" placeholder="输入当前密码">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">新密码</label>
              <input type="password" class="input-field" placeholder="输入新密码">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">确认新密码</label>
              <input type="password" class="input-field" placeholder="再次输入新密码">
            </div>
            <button type="button" class="btn btn-primary w-full">
              <i class="fas fa-key mr-2"></i> 修改密码
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  </template>