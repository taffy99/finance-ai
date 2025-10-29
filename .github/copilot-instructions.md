# Copilot 指导说明（针对本仓库）

目的：快速让 AI 编码代理在本项目中马上可用。包含大体架构、关键文件、常用命令、约定与可直接引用的示例路径。

- 项目类型：Vue 3 + Vite 单页应用（使用 `<script setup>` SFC）。入口位于 `src/main.js`，路由在 `src/router/index.js`。
- 主要依赖：`vue`、`vue-router`、`pinia`（已加入依赖但未全面使用）、`@supabase/supabase-js`（主后端集成）、`chart.js`、`element-plus`。

- 后端与集成点：
  - Supabase 客户端：`src/lib/supabase.js`（通过 Vite 环境变量 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 配置）。
  - 组合式封装：`src/composables/useSupabase.js`（示例：`useProducts()`，在 `src/views/Investments.vue` 中被调用）。
  - 本地 serverless 示例：`vercel-serverless-demo/api/*.js` 和 `vercel-serverless-demo/db/index.js`（可参考实现小型 API 与事务逻辑）。

- 路由与页面约定：
  - 父级视图：`src/components/Home.vue` 作为包含子路由的外壳，子路由在 `src/router/index.js` 中声明（如 `dashboard`, `investments`, `ai-assistant` 等）。
  - 组件与视图分层：页面级视图在 `src/views/`，可复用视图/UI 组件在 `src/components/`。

- 开发 / 构建 / 预览：
  - 本地开发：`npm run dev`（启动 Vite 开发服务器）。
  - 打包：`npm run build`。
  - 预览构建：`npm run preview`。
  - 注意：仓库未包含测试脚本（`package.json` 无 test 字段）；不要假定存在自动化测试，新增测试时请把脚本加入 `package.json`。

- 常见代码模式与示例引用（可直接复制或修改）：
  - 使用 Supabase：
    - 客户端：`import { supabase } from '../lib/supabase'` （见 `src/composables/useSupabase.js`）
    - 在页面使用：`const { products, fetchProducts } = useProducts()`（见 `src/views/Investments.vue` 中的 onMounted 调用）。
  - 路由跳转示例：`router.push('fundStrategy')`（见 `src/views/Investments.vue`）。

- 风格与约定（可被 AI 用来生成一致代码）：
  - SFC 使用 `<script setup>`。优先用组合式 API（composables）封装可复用逻辑。
  - 组件命名以 PascalCase（例如 `InvestDetailModal.vue`），路由路径以 kebab 或小写字符串声明。
  - 数据访问通过 `composables` -> `src/lib/supabase.js`。避免在组件中直接创建 supabase 客户端。

- 注意事项 / 限制：
  - 环境变量：本地 `.env.local` 包含 Supabase 配置；不要在提交或返回内容时泄露真实密钥。AI 若需示例，可使用 placeholder（例如 `VITE_SUPABASE_URL=https://<your-project>.supabase.co`）。
  - 如果要修改后端逻辑，请同步更新 `vercel-serverless-demo/api` 下的示例 API；生产后端并未内置（仅示例）。

- 模型偏好（仓库层面声明，仅作建议）：
  - Preferred model: Claude Sonnet 3.5 — 这是仓库对 AI 代理生成建议时的首选模型风格与能力偏好。注意：此项仅为偏好声明，实际启用/配置需在你的 LLM 平台或 Copilot/团队设置控制台中完成（仓库无法直接切换第三方模型）。

如果有遗漏或你想加上团队偏好的编码格式或 PR 模板（例如 lint、prettier、测试策略），告诉我我会把这些规则合并进来。
