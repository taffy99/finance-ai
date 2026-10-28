# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## AI ETF 分析器（新增）

项目已新增一个演示用的 AI Agent 页面，用于分析国内 ETF/指数基金近一年的市场趋势并给出综合说明。

使用方法：

- 启动本地开发服务器：

```bash
npm run dev
```

### AkTools 接口

项目通过 [`src/lib/aktools.js`](./src/lib/aktools.js) 调用 AkTools
公开 API。默认地址为 `http://127.0.0.1:8080/api/public`，也可以配置
`VITE_AKTOOLS_BASE_URL`：

```env
VITE_AKTOOLS_BASE_URL=/aktools-api/api/public
```

#### 启动本地 AkTools 服务

项目提供了本地启动脚本，会自动创建 `.aktools-venv` 虚拟环境并安装当前
最新版本 `aktools==0.0.95`（见
[`requirements-aktools.txt`](./requirements-aktools.txt)）：

```bash
npm run aktools
```

服务启动后可访问：

- API 文档：`http://127.0.0.1:8080/docs`
- 公共 API：`http://127.0.0.1:8080/api/public`

可以通过环境变量修改监听地址和端口：

```bash
AKTOOLS_HOST=0.0.0.0 AKTOOLS_PORT=8080 AKTOOLS_WORKERS=2 npm run aktools
```

当前封装提供基金列表、基金分级信息和 ETF 历史数据接口：

```js
import { AkToolsAPI } from './src/lib/aktools.js';

const history = await AkToolsAPI.getFundHistory('510300', {
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

- 在浏览器打开：

	http://localhost:5173/#/ai-eft-analyzer

- 在页面中输入基金名或代码（例如 `沪深300` 或 `hs300`），点击“分析”。

实现说明：

- 分析逻辑位于 `src/composables/useEftAgent.js`。它会：
	- 尝试使用 `src/lib/api.js` 中的 `MarketAPI` 获取月度历史与指标（如后端可用）。
	- 在无法获取后端数据时回退到本地 mock 或合成时间序列（`src/mocks/investments.js`）。
	- 计算近一年收益、年化波动、简单移动平均，并给出基于规则的文字化说明与置信度估计。

- 展示页面：`src/views/AiEftAnalyzer.vue`，复用 `src/composables/useCharts.js` 绘图。

注意：当前 agent 是基于可用数据的启发式/规则分析示例，不等同于外部大模型推理。若需集成 LLM（例如 OpenAI / Anthropic），请添加安全的后端代理并在 `useEftAgent` 中把文本上下文通过后端发送到 LLM，由服务端负责秘钥与速率控制。
