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

            <!-- 视图：月份 / 日期 -->
            <div v-if="viewMode === 'month'" class="grid grid-cols-3 gap-2">
              <button
                v-for="month in 12"
                :key="month"
                @click="enterMonth(month)"
                class="py-3 px-2 rounded-lg text-center transition-all duration-200 relative group"
                :class="[
                  isSelectedMonth(month) ? 'bg-primary text-white' : 'hover:bg-light',
                  isDisabledMonth(month) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                ]"
                :disabled="isDisabledMonth(month)"
              >
                <span class="relative z-10">{{ month }}月</span>
                <span v-if="isSelectedMonth(month)" 
                      class="absolute inset-0 bg-primary rounded-lg animate-pulse opacity-20">
                </span>
              </button>
            </div>

            <div v-else class=""> 
              <!-- 日期视图头部 -->
              <div class="flex items-center justify-between mb-3">
                <button @click="backToMonth" class="text-sm text-neutral hover:text-neutral/80">返回</button>
                <div class="text-sm font-medium">{{ currentYear }}年 {{ selectedMonth }}月</div>
                <div style="width:36px" />
              </div>

              <!-- 星期表头 -->
              <div class="grid grid-cols-7 gap-1 text-xs text-neutral mb-2">
                <div class="text-center">日</div>
                <div class="text-center">一</div>
                <div class="text-center">二</div>
                <div class="text-center">三</div>
                <div class="text-center">四</div>
                <div class="text-center">五</div>
                <div class="text-center">六</div>
              </div>

              <!-- 日期格子 -->
              <div class="grid grid-cols-7 gap-1">
                <button v-for="slot in daySlots" :key="slot.key" 
                        @click="slot.day ? selectDay(slot.day) : null"
                        :disabled="!slot.day || isDisabledDay(slot.day)"
                        class="py-2 text-sm rounded-lg transition-colors duration-150 text-center"
                        :class="[!slot.day ? 'invisible' : (isSelectedDay(slot.day) ? 'bg-primary text-white' : 'hover:bg-light')]">
                  {{ slot.day || '' }}
                </button>
              </div>
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
  // 兼容旧格式 'YYYY-MM' 或新的 'YYYY-MM-DD'
  min: {
    type: String,
    default: '2020-01'
  },
  max: {
    type: String,
    default: '2025-11'
  },
  placeholder: {
    type: String,
    default: '选择日期'
  },
  position: {
    type: String,
    default: 'bottom'
  }
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const currentYear = ref(props.modelValue ? parseInt(props.modelValue.split('-')[0]) : new Date().getFullYear());
const viewMode = ref('month'); // 'month' 或 'day'
const selectedMonth = ref(props.modelValue ? parseInt((props.modelValue.split('-')[1] || '1')) : (new Date().getMonth() + 1));

// 规范化 min/max 为 Date 对象边界（支持 'YYYY-MM' 和 'YYYY-MM-DD'）
const normalizeBoundary = (str, isStart) => {
  if (!str) return isStart ? new Date(-8640000000000000) : new Date(8640000000000000000);
  const parts = str.split('-').map(Number);
  if (parts.length === 2) {
    const [y, m] = parts;
    return isStart ? new Date(y, m - 1, 1, 0, 0, 0, 0) : new Date(y, m, 0, 23, 59, 59, 999);
  }
  // assume full date
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return isStart ? new Date(-8640000000000000) : new Date(8640000000000000000);
};

const minDate = normalizeBoundary(props.min, true);
const maxDate = normalizeBoundary(props.max, false);

// day slots will be computed for day view
const daySlots = ref([]);

// 格式化日期显示，支持 YYYY-MM 或 YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 2) {
    const [year, month] = parts;
    return `${year}年${parseInt(month)}月`;
  }
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${year}年${parseInt(month)}月${parseInt(day)}日`;
  }
  return dateString;
};

// 判断是否选中（月视图）
const isSelectedMonth = (month) => {
  if (!props.modelValue) return false;
  const parts = props.modelValue.split('-');
  const year = parseInt(parts[0]);
  const mon = parseInt(parts[1] || selectedMonth.value);
  return currentYear.value === year && month === mon;
};

// 判断是否选中（天视图）
const isSelectedDay = (day) => {
  if (!props.modelValue) return false;
  const parts = props.modelValue.split('-');
  if (parts.length < 3) return false;
  const year = parseInt(parts[0]);
  const mon = parseInt(parts[1]);
  const d = parseInt(parts[2]);
  return currentYear.value === year && selectedMonth.value === mon && day === d;
};

// 判断月份是否禁用（如果整个月都超出边界，则禁用）
const isDisabledMonth = (month) => {
  const startOfMonth = new Date(currentYear.value, month - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(currentYear.value, month, 0, 23, 59, 59, 999);
  return endOfMonth < minDate || startOfMonth > maxDate;
};

// 判断具体某天是否禁用
const isDisabledDay = (day) => {
  const d = new Date(currentYear.value, selectedMonth.value - 1, day, 0, 0, 0, 0);
  return d < minDate || d > maxDate;
};

// 进入某个月的日期视图
const enterMonth = (month) => {
  if (isDisabledMonth(month)) return;
  selectedMonth.value = month;
  viewMode.value = 'day';
  buildDaySlots(currentYear.value, month);
};

// 返回月份视图
const backToMonth = () => {
  viewMode.value = 'month';
};

// 选择某天（输出 YYYY-MM-DD）
const selectDay = (day) => {
  if (isDisabledDay(day)) return;
  const y = currentYear.value;
  const m = String(selectedMonth.value).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;
  emit('update:modelValue', dateStr);
  showPicker.value = false;
  viewMode.value = 'month';
};

// 构建日期格子（包含空位）
const buildDaySlots = (year, month) => {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeek = first.getDay(); // 0-6 (日..六)
  const slots = [];
  // 前置空位
  for (let i = 0; i < startWeek; i++) slots.push({ key: `b-${i}`, day: null });
  // 天数
  for (let d = 1; d <= daysInMonth; d++) slots.push({ key: `d-${d}`, day: d });
  daySlots.value = slots;
};

// 切换年份
const changeYear = (delta) => {
  const newYear = currentYear.value + delta;
  const minY = parseInt(props.min.split('-')[0]);
  const maxY = parseInt(props.max.split('-')[0]);
  if (newYear < minY || newYear > maxY) return;
  currentYear.value = newYear;
  // 如果在日视图，重新构建天格
  if (viewMode.value === 'day') buildDaySlots(currentYear.value, selectedMonth.value);
};

// 选择当前日期
const selectCurrentMonth = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const day = now.getDate();
  const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const d = new Date(dateStr);
  if (d >= minDate && d <= maxDate) {
    emit('update:modelValue', dateStr);
    currentYear.value = y;
    selectedMonth.value = m;
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
    const parts = newValue.split('-');
    currentYear.value = parseInt(parts[0]);
    if (parts.length >= 2) selectedMonth.value = parseInt(parts[1]);
  }
});

// 初次构建日格（如果 modelValue 指定了日）
if (props.modelValue && props.modelValue.split('-').length === 3) {
  const parts = props.modelValue.split('-');
  buildDaySlots(parseInt(parts[0]), parseInt(parts[1]));
}
</script>