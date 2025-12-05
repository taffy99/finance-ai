import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

// 2. 数据库操作相关功能（以理财产品表为例）
export function useProducts() {
    const products = ref([]); // 产品列表
    const loading = ref(false); // 加载状态
  
    // 获取理财产品
    const fetchProducts = async () => {
      loading.value = true;
      const { data, error } = await supabase
        .from('financial_products') // 表名
        .select('*')
  
      if (error) {
        console.error('获取产品失败：', error);
      } else {
        products.value = data || [];
        console.log('获取产品成功', data);
      }
      loading.value = false;
      return { data, error };
    };
  
    // 添加产品
    const addProduct = async (productData) => {
      const { data, error } = await supabase
        .from('financial_products')
        .insert([productData])
        .select('*'); // 返回插入的记录
      return { data, error };
    };
  
    return { products, loading, fetchProducts, addProduct };
  }
 // 3. 理财产品概览相关功能
  export function useInvestOverview() {
    const investOverview = ref([]); // 产品列表
    const loading = ref(false); // 加载状态
  
    // 获取理财产品
    const fetchInvestOverview = async () => {
      loading.value = true;
      const { data, error } = await supabase
        .from('invest_overview') // 表名
        .select('*')
        .order('invest_month', { ascending: false })
        .limit(1)
  
      if (error) {
        console.error('获取产品概览失败：', error);
      } else {
        investOverview.value = data || [];
        console.log('获取产品概览成功', data);
      }
      loading.value = false;
      return { data, error };
    };
  
    return { investOverview, loading, fetchInvestOverview };
  }
    