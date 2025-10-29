<template>
     <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" v-if="showAddInvestModal">
      <div class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[calc(100vh-20px)] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">
                添加投资
            </h3>
            <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-6">
             <!-- 产品名称输入框 -->
             <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                产品名称 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <input
                type="text"
                v-model="formData.productName"
                @input="validateProductName"
                class="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.productName }"
                placeholder="请输入产品名称"
                >
                
                <!-- 错误提示 -->
                <p v-if="formErrors.productName" class="mt-1 text-xs text-error">
                {{ formErrors.productName }}
                </p>
            </div>
            </div>
            <!-- 下拉选框 - 产品类型 -->
            <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                产品类型 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <!-- 下拉选框触发按钮 -->
                <button 
                type="button"
                @click="toggleDropdown('productType')"
                class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.productType }"
                >
                <span v-if="formData.productType" class="text-gray-800">
                    {{ getProductTypeName(formData.productType) }}
                </span>
                <span v-else class="text-gray-500">选择产品类型</span>
                <i class="fa fa-chevron-down text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': dropdownOpen.productType }"></i>
                </button>
                
                <!-- 下拉选项列表 -->
                <div 
                v-if="dropdownOpen.productType"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-dropdown z-10 max-h-60 overflow-y-auto transition-custom"
                >
                <div 
                    v-for="type in productTypes" 
                    :key="type.value"
                    @click="selectDropdownValue('productType', type.value)"
                    class="px-4 py-2.5 text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer transition-custom"
                >
                    {{ type.label }}
                </div>
            </div>
                
                <!-- 错误提示 -->
                <p v-if="formErrors.productType" class="mt-1 text-xs text-error">
                {{ formErrors.productType }}
                </p>
            </div>
            </div>
        
            <!-- 下拉选框 - 风险等级 -->
            <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                风险等级 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <!-- 下拉选框触发按钮 -->
                <button 
                type="button"
                @click="toggleDropdown('riskLevel')"
                class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.riskLevel }"
                >
                <span v-if="formData.riskLevel" class="text-gray-800">
                    {{ getRiskLevelName(formData.riskLevel) }}
                </span>
                <span v-else class="text-gray-500">选择风险等级</span>
                <i class="fa fa-chevron-down text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': dropdownOpen.riskLevel }"></i>
                </button>
                
                <!-- 下拉选项列表 -->
                <div 
                v-if="dropdownOpen.riskLevel"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-dropdown z-10 max-h-60 overflow-y-auto transition-custom"
                >
                <div 
                    v-for="level in riskLevels" 
                    :key="level.value"
                    @click="selectDropdownValue('riskLevel', level.value)"
                    class="px-4 py-2.5 flex items-center text-gray-700 transition-custom dropdown-item-hover"
                >
                    <span class="w-3 h-3 rounded-full mr-2" :class="getRiskLevelColor(level.value)"></span>
                    {{ level.label }}
                </div>
                </div>
                
                <!-- 错误提示 -->
                <p v-if="formErrors.riskLevel" class="mt-1 text-xs text-error">
                {{ formErrors.riskLevel }}
                </p>
            </div>
            </div>
        
            <!-- 日期选择框 - 购买日期 -->
            <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                购买日期 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <!-- 日期选择框触发按钮 -->
                <button 
                type="button"
                @click="toggleDatePicker"
                class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.purchaseDate }"
                >
                <span v-if="formData.purchaseDate" class="text-gray-800">
                    {{ formatDate(formData.purchaseDate) }}
                </span>
                <span v-else class="text-gray-500">选择购买日期</span>
                <i class="fa fa-calendar text-gray-500"></i>
                </button>
                
                <!-- 日期选择器 -->
                <div 
                v-if="datePickerOpen"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-dropdown z-20 p-4 transition-custom"
                >
                <!-- 日期选择器头部 - 年月切换 -->
                <div class="flex items-center justify-between mb-4">
                    <button 
                    type="button"
                    @click="changeMonth(-1)"
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-custom"
                    >
                    <i class="fa fa-chevron-left text-gray-600"></i>
                    </button>
                    <h3 class="text-lg font-medium text-gray-800">
                    {{ currentDate.year }}年{{ currentDate.month + 1 }}月
                    </h3>
                    <button 
                    type="button"
                    @click="changeMonth(1)"
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-custom"
                    >
                    <i class="fa fa-chevron-right text-gray-600"></i>
                    </button>
                </div>
                
                <!-- 星期标题 -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <div class="text-center text-xs font-medium text-gray-500 py-1">日</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">一</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">二</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">三</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">四</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">五</div>
                    <div class="text-center text-xs font-medium text-gray-500 py-1">六</div>
                </div>
                
                <!-- 日期单元格 -->
                <div class="grid grid-cols-7 gap-1">
                    <div 
                    v-for="(day, index) in daysInMonth" 
                    :key="index"
                    @click="selectDate(day)"
                    class="text-center py-1.5 text-sm transition-custom"
                    :class="[
                        day === 0 ? 'invisible' : '',
                        isDateDisabled(day) ? 'date-cell-disabled' : '',
                        isDateSelected(day) ? 'date-cell-active' : 'date-cell-hover'
                    ]"
                    >
                    {{ day || '' }}
                    </div>
                </div>
                
                <!-- 日期选择器底部 - 今天按钮 -->
                <div class="mt-4 flex justify-center">
                    <button 
                    type="button"
                    @click="selectToday"
                    class="px-3 py-1.5 text-xs text-primary hover:text-primary/80 transition-custom"
                    >
                    今天
                    </button>
                </div>
                </div>
                
                <!-- 错误提示 -->
                <p v-if="formErrors.purchaseDate" class="mt-1 text-xs text-error">
                {{ formErrors.purchaseDate }}
                </p>
            </div>
            </div>
             <!-- 持仓金额输入框 -->
            <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                持仓金额 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <div class="absolute left-0 top-0 bottom-0 pl-3 flex items-center justify-center pointer-events-none">
                    <span class="text-gray-500 text-lg" style="position: absolute; top: 10px;left: 10px;">¥</span>
                </div>
                <input
                type="number"
                v-model="formData.positionAmount"
                @input="validatePositionAmount"
                class="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.positionAmount }"
                placeholder="请输入持仓金额"
                min="0"
                step="0.01"
                >
                
                <!-- 错误提示 -->
                <p v-if="formErrors.positionAmount" class="mt-1 text-xs text-error">
                {{ formErrors.positionAmount }}
                </p>
            </div>
            </div>
            <!-- 金额输入框 -->
            <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                投资金额 <span class="text-error">*</span>
            </label>
            <div class="relative">
                <div class="absolute left-0 top-0 bottom-0 pl-3 flex items-center justify-center pointer-events-none">
                    <span class="text-gray-500 text-lg" style="position: absolute; top: 10px;left: 10px;">¥</span>
                </div>
                <input
                type="number"
                v-model="formData.amount"
                @input="validateAmount"
                class="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-custom input-focus"
                :class="{ 'border-error': formErrors.amount }"
                placeholder="请输入投资金额"
                min="0"
                step="0.01"
                >
                
                <!-- 错误提示 -->
                <p v-if="formErrors.amount" class="mt-1 text-xs text-error">
                {{ formErrors.amount }}
                </p>
            </div>
            </div>
        
            <!-- 提交按钮 -->
            <div class="pt-4">
            <button 
                type="submit"
                class="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-custom"
            >
                <i class="fa fa-check-circle mr-2"></i>提交表单
            </button>
            </div>
          </form>
            <!-- 表单提交成功提示 -->
            <div v-if="formSubmitted" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div class="flex justify-center mb-2">
                <i class="fa fa-check-circle text-success text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-green-800">表单提交成功！</h3>
            <p class="mt-1 text-sm text-green-700">
                产品名称: {{ formData.productName }}<br>
                产品类型: {{ getProductTypeName(formData.productType) }}<br>
                风险等级: {{ getRiskLevelName(formData.riskLevel) }}<br>
                购买日期: {{ formatDate(formData.purchaseDate) }}<br>
                持仓金额: ¥{{ formData.positionAmount.toLocaleString() }}<br>
                投资金额: ¥{{ formData.amount.toLocaleString() }}
            </p>
            <button 
                @click="resetForm"
                class="mt-4 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-custom"
            >
                重新填写
            </button>
            </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import { ref, computed,watch } from 'vue'
// 声明接收的 props 
// 模态框显示状态
defineProps({
    showAddInvestModal:{
        type: Boolean,
        default: false
    }
})
// 声明可出触发事件
const emit = defineEmits([
    'close-add-modal'
]
)
// 触发事件并传递模态框显示状态给父组件
const closeAddModal= () => {
    emit('close-add-modal', false)
}

// 表单数据
const formData = ref({
    productName: '',
    productType: '',
    riskLevel: '',
    purchaseDate: null,
    positionAmount: '',
    returnRate: '',
    amount: ''
});
// 表单错误
const formErrors = ref({
    productName:'',
    productType: '',
    riskLevel: '',
    purchaseDate: '',
    positionAmount: '',
    returnRate: '',
    amount: ''
});
 // 表单提交状态
 const formSubmitted = ref(false);
 // 产品类型选项
 const productTypes = [
    { value: 'wealthManagementProduct', label: '理财产品' },
    { value: 'indexFund', label: '指数基金' },
    { value: 'mixedFund', label: '混合基金' },
    { value: 'stock', label: '股票' },
    { value: 'qdiiFund', label: 'QDII基金' }
];
 // 风险等级选项
 const riskLevels = [
    { value: 'conservative', label: '保守型' },
    { value: 'balanced', label: '平衡型' },
    { value: 'aggressive', label: '进取型' }
];
// 下拉选框状态
const dropdownOpen = ref({
    productType: false,
    riskLevel: false
});
// 日期选择器状态
const datePickerOpen = ref(false);
// 当前日期（用于日期选择器）
const currentDate = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
});
 // 获取产品类型名称
 const getProductTypeName = (value) => {
    const type = productTypes.find(type => type.value === value);
    return type ? type.label : '';
};
// 获取风险等级名称
const getRiskLevelName = (value) => {
    const level = riskLevels.find(level => level.value === value);
    return level ? level.label : '';
};
 // 获取风险等级颜色
 const getRiskLevelColor = (value) => {
    switch (value) {
    case 'conservative': return 'bg-green-500';
    case 'balanced': return 'bg-yellow-500';
    case 'aggressive': return 'bg-red-500';
    default: return 'bg-gray-300';
    }
};
// 切换下拉选框
const toggleDropdown = (field) => {
    // 关闭其他下拉选框
    Object.keys(dropdownOpen.value).forEach(key => {
    if (key !== field) {
        dropdownOpen.value[key] = false;
    }
    });
    
    // 关闭日期选择器
    datePickerOpen.value = false;
    
    // 切换当前下拉选框
    dropdownOpen.value[field] = !dropdownOpen.value[field];
};
// 选择下拉选框值
const selectDropdownValue = (field, value) => {
    formData.value[field] = value;
    formErrors.value[field] = ''; // 清除错误
    dropdownOpen.value[field] = false; // 关闭下拉选框
};
// 切换日期选择器
const toggleDatePicker = () => {
    // 关闭所有下拉选框
    Object.keys(dropdownOpen.value).forEach(key => {
    dropdownOpen.value[key] = false;
    });
    
    datePickerOpen.value = !datePickerOpen.value;
};
 // 获取当月天数
 const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};
 // 获取当月第一天是星期几
 const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};
// 生成当月日期数组（包含前面的空白）
const daysInMonth = computed(() => {
    const { year, month } = currentDate.value;
    const days = [];
    const firstDay = getFirstDayOfMonth(year, month);
    const totalDays = getDaysInMonth(year, month);
    
    // 添加前面的空白
    for (let i = 0; i < firstDay; i++) {
    days.push(0);
    }
    
    // 添加当月日期
    for (let i = 1; i <= totalDays; i++) {
    days.push(i);
    }
    
    return days;
});
// 切换月份
const changeMonth = (offset) => {
    const { year, month } = currentDate.value;
    let newMonth = month + offset;
    let newYear = year;
    
    if (newMonth < 0) {
    newMonth = 11;
    newYear--;
    } else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
    }
    
    currentDate.value = { year: newYear, month: newMonth };
};
// 格式化日期
const formatDate = (date) => {
    if (!date) return '';
    return `${date.year}年${date.month + 1}月${date.day}日`;
};
        
// 选择日期
const selectDate = (day) => {
    if (day === 0 || isDateDisabled(day)) return; 
    const { year, month } = currentDate.value;
    formData.value.purchaseDate = { year, month, day };
    formErrors.value.purchaseDate = ''; // 清除错误
    datePickerOpen.value = false; // 关闭日期选择器
};
        
// 选择今天
const selectToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    formData.value.purchaseDate = { year, month, day };
    formErrors.value.purchaseDate = ''; // 清除错误
    datePickerOpen.value = false; // 关闭日期选择器
    
    // 更新当前日期
    currentDate.value = { year, month };
};
        
// 检查日期是否已选择
const isDateSelected = (day) => {
    if (day === 0 || !formData.value.purchaseDate) return false;
    
    const { year, month, day: selectedDay } = formData.value.purchaseDate;
    return (
    year === currentDate.value.year &&
    month === currentDate.value.month &&
    selectedDay === day
    );
};
        
// 检查日期是否禁用（只能选择今天及之前的日期）
const isDateDisabled = (day) => {
    if (day === 0) return false;
    
    const { year, month } = currentDate.value;
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date > today;
};
// 验证产品名称
const validateProductName = () => {
    if (!formData.value.productName) {
    formErrors.value.productName = '请输入产品名称';
    } else {
    formErrors.value.productName = '';
    }
};
// 验证金额
const validatePositionAmount = () => {
    const positionAmount = parseFloat(formData.value.positionAmount);
    
    if (isNaN(positionAmount) || positionAmount <= 0) {
    formErrors.value.positionAmount = '请输入有效的持仓金额';
    } else {
    formErrors.value.positionAmount = '';
    }
};
// 验证金额
const validateAmount = () => {
    const amount = parseFloat(formData.value.amount);
    
    if (isNaN(amount) || amount <= 0) {
    formErrors.value.amount = '请输入有效的投资金额';
    } else {
    formErrors.value.amount = '';
    }
};
 // 表单验证
 const validateForm = () => {
    let isValid = true;
    // 验证产品名称
    if (!formData.value.productName) {
        formErrors.value.productName = '请输入产品名称';
        isValid = false;
    }

    // 验证产品类型
    if (!formData.value.productType) {
    formErrors.value.productType = '请选择产品类型';
    isValid = false;
    }
    
    // 验证风险等级
    if (!formData.value.riskLevel) {
    formErrors.value.riskLevel = '请选择风险等级';
    isValid = false;
    }
    
    // 验证购买日期
    if (!formData.value.purchaseDate) {
    formErrors.value.purchaseDate = '请选择购买日期';
    isValid = false;
    }
    validatePositionAmount();
    if (formErrors.value.positionAmount) {
    isValid = false;
    }
    // 验证投资金额
    validateAmount();
    if (formErrors.value.amount) {
    isValid = false;
    }
    
    return isValid;
};
// 表单提交
const handleSubmit = () => {
    if (validateForm()) {
    formSubmitted.value = true;
    console.log('表单提交数据:', formData.value);
    }
};

// 重置表单
const resetForm = () => {
    formData.value = {
        productType: '',
        riskLevel: '',
        purchaseDate: null,
        positionAmount: '',
        returnRate: '',
        amount: ''
    };
    
    formErrors.value = {
        productType: '',
        riskLevel: '',
        purchaseDate: '',
        positionAmount: '',
        returnRate: '',
        amount: ''
    };
    
    formSubmitted.value = false;
};
 // 点击外部关闭下拉选框和日期选择器
 const handleClickOutside = (event) => {
    // 检查是否点击了下拉选框内部
    const dropdowns = document.querySelectorAll('.form-group > div.relative');
    let isClickInsideDropdown = false;
    
    dropdowns.forEach(dropdown => {
    if (dropdown.contains(event.target)) {
        isClickInsideDropdown = true;
    }
    });
    
    // 如果不是点击下拉选框内部，则关闭所有下拉选框和日期选择器
    if (!isClickInsideDropdown) {
    Object.keys(dropdownOpen.value).forEach(key => {
        dropdownOpen.value[key] = false;
    });
    
    datePickerOpen.value = false;
    }
};
// 添加点击外部事件监听
document.addEventListener('click', handleClickOutside);
        
// 清理事件监听
const cleanup = () => {
    document.removeEventListener('click', handleClickOutside);
};
// 组件卸载时清理
watch(() => {}, cleanup, { once: true });
</script>
<style type="text/tailwindcss" scoped>
     /* eslint-disable */
    /* tailwindcss v3 */
    @layer utilities {
      .content-auto {
        content-visibility: auto;
      }
      .transition-custom {
        transition: all 300ms ease-in-out;
      }
      .input-focus {
        outline: none;
      }
      .input-focus:focus {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        --tw-ring-color: rgba(59, 130, 246, 0.5);
        --tw-ring-offset-width: 0px;
        --tw-ring-inset: inset;
        border-color: #3b82f6;
      }
      .dropdown-item-hover {
        cursor: pointer;
      }
      .dropdown-item-hover:hover {
        background-color: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }
      .date-cell-hover {
        cursor: pointer;
      }
      .date-cell-hover:hover {
        background-color: rgba(59, 130, 246, 0.1);
        border-radius: 9999px;
      }
      .date-cell-active {
        background-color: #3b82f6;
        color: white;
        border-radius: 9999px;
      }
      .date-cell-disabled {
        color: #d1d5db;
        cursor: not-allowed;
      }
      .input-icon-container {
        position: absolute;
        left: 0px;
        top: 0px;
        bottom: 0px;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .input-icon {
        color: #6b7280;
        font-size: 1.125rem;
        line-height: 1.75rem;
        vertical-align: middle;
      }
    }
    
    /* 确保输入框内的内容垂直居中 */
    input[type="number"] {
      display: flex;
      align-items: center;
    }
    
    /* 确保输入框获得焦点时图标仍然居中 */
    .form-group .relative input:focus + .input-icon-container .input-icon {
      transform: none;
    }
</style>