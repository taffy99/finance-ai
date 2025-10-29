<!-- MonthPicker.vue -->
<template>
  <div class="relative" @click.stop>
    <!-- 输入框触发器 -->
    <div class="relative group" @click="showPicker = true">
      <input 
        type="text" 
        :value="formatDate(modelValue)"
        readonly
        class="bg-light border-2 border-gray-100 rounded-xl py-3.5 px-5 w-full text-lg cursor-pointer
               transition-all duration-300 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
               group-hover:border-primary/30"
        :placeholder="placeholder"
      >
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral/70 group-hover:text-primary/70 transition-colors duration-300">
        <i class="fa fa-calendar"></i>
      </div>
    </div>

    <!-- 弹出选择框 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div v-if="showPicker" 
           class="absolute z-50 mt-2 w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 p-4"
           :class="position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'"
           v-click-outside="closePicker">
        <!-- 头部：年份选择 -->
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="changeYear(-1)"
            class="p-2 hover:bg-light rounded-lg transition-colors duration-200"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <span class="text-lg font-medium">{{ currentYear }}年</span>
          <button 
            @click="changeYear(1)"
            class="p-2 hover:bg-light rounded-lg transition-colors duration-200"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <!-- 月份网格 -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="month in 12"
            :key="month"
            @click="selectMonth(month)"
            class="py-3 px-2 rounded-lg text-center transition-all duration-200 relative group"
            :class="[
              isSelected(month) ? 'bg-primary text-white' : 'hover:bg-light',
              isDisabled(month) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
            :disabled="isDisabled(month)"
          >
            <span class="relative z-10">{{ month }}月</span>
            <span v-if="isSelected(month)" 
                  class="absolute inset-0 bg-primary rounded-lg animate-pulse opacity-20">
            </span>
          </button>
        </div>

        <!-- 底部快捷操作 -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
          <button 
            @click="selectCurrentMonth"
            class="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            选择当月
          </button>
          <button 
            @click="closePicker"
            class="text-sm text-neutral hover:text-neutral/80 transition-colors duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { vClickOutside } from '../directives/click-outside';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  min: {
    type: String,
    default: '2020-01'
  },
  max: {
    type: String,
    default: '2024-12'
  },
  placeholder: {
    type: String,
    default: '选择月份'
  },
  position: {
    type: String,
    default: 'bottom'
  }
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const currentYear = ref(props.modelValue ? parseInt(props.modelValue.split('-')[0]) : new Date().getFullYear());

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  return `${year}年${parseInt(month)}月`;
};

// 判断是否选中
const isSelected = (month) => {
  if (!props.modelValue) return false;
  const [year, selectedMonth] = props.modelValue.split('-');
  return currentYear.value === parseInt(year) && month === parseInt(selectedMonth);
};

// 判断是否禁用
const isDisabled = (month) => {
  const dateStr = `${currentYear.value}-${month.toString().padStart(2, '0')}`;
  return dateStr < props.min || dateStr > props.max;
};

// 选择月份
const selectMonth = (month) => {
  if (isDisabled(month)) return;
  const dateStr = `${currentYear.value}-${month.toString().padStart(2, '0')}`;
  emit('update:modelValue', dateStr);
  showPicker.value = false;
};

// 切换年份
const changeYear = (delta) => {
  const newYear = currentYear.value + delta;
  if (newYear < parseInt(props.min.split('-')[0]) || 
      newYear > parseInt(props.max.split('-')[0])) return;
  currentYear.value = newYear;
};

// 选择当前月份
const selectCurrentMonth = () => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  if (dateStr >= props.min && dateStr <= props.max) {
    emit('update:modelValue', dateStr);
    currentYear.value = now.getFullYear();
    showPicker.value = false;
  }
};

// 关闭选择器
const closePicker = () => {
  showPicker.value = false;
};

// 监听值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    currentYear.value = parseInt(newValue.split('-')[0]);
  }
});
</script>