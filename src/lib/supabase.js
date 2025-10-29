// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// 从环境变量获取配置（Vite 会自动加载 .env.local）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建并导出 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);