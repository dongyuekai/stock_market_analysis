# 📈 股市分析系统

一个基于 Next.js 14 开发的实时股市数据分析与可视化平台，支持 A 股和美股市场数据。

## ✨ 功能特性

### 已实现功能

#### 🇨🇳 A 股市场

- ✅ **市场指数监控**：实时显示上证指数、深证成指、创业板指
- ✅ **热门股票榜单**：涨幅榜、跌幅榜、成交量榜
- ✅ **个股详情页面**：
  - 实时行情（价格、涨跌幅、成交量等）
  - K 线图（日 K、周 K、月 K、60 分钟、30 分钟、15 分钟）
  - 买卖盘口（五档买卖盘）
  - 成交量柱状图
- ✅ **主力资金流向**：
  - 主力净流入排行
  - 超大单、大单、中单、小单资金分析
  - 按资金流向和涨跌幅排序

#### 🇺🇸 美股市场

- ✅ **市场指数监控**：实时显示道琼斯、纳斯达克、标普 500 指数
- ✅ **热门美股榜单**：AAPL、TSLA、GOOGL 等 20 只热门股票
- ✅ **个股详情页面**：
  - 实时行情（美元计价）
  - K 线图（日 K、周 K、月 K）
  - 成交量展示

### 技术特点

- 📊 **可视化图表**：使用 ECharts 实现专业的 K 线图和成交量展示
- 🔄 **真实数据**：集成新浪财经、东方财富等真实数据源
- 🔄 **实时更新**：自动定时刷新数据，保持信息同步（延迟 3-5 秒）
- 📱 **响应式设计**：适配桌面和移动设备
- 🎨 **现代化 UI**：基于 Tailwind CSS 的简洁美观界面
- ⚡ **性能优化**：Next.js 14 App Router 带来更快的加载速度

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: ECharts 5
- **HTTP 客户端**: Axios
- **数据获取**: SWR
- **状态管理**: Zustand

## 📦 安装和运行

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

\`\`\`bash
npm install

# 或

yarn install

# 或

pnpm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev

# 或

yarn dev

# 或

pnpm dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

\`\`\`bash
npm run build
npm run start

# 或

yarn build
yarn start

# 或

pnpm build
pnpm start
\`\`\`

## 📁 项目结构

\`\`\`
stock_market_analysis/
├── app/ # Next.js App Router 页面
│ ├── a-share/ # A 股市场相关页面
│ │ ├── page.tsx # A 股市场概览
│ │ └── stock/[code]/ # 个股详情页面
│ ├── capital-flow/ # 主力资金流向页面
│ ├── us-market/ # 美股市场页面
│ ├── api/ # API 路由
│ │ ├── a-share/ # A 股数据接口
│ │ └── capital-flow/ # 资金流向接口
│ ├── layout.tsx # 根布局
│ ├── page.tsx # 首页
│ └── globals.css # 全局样式
├── components/ # React 组件
│ ├── Navigation.tsx # 导航栏
│ ├── KlineChart.tsx # K 线图组件
│ ├── StockCard.tsx # 股票卡片
│ └── MarketIndexCard.tsx # 市场指数卡片
├── lib/ # 工具函数和 API
│ └── stockApi.ts # 股票数据爬取 API
├── types/ # TypeScript 类型定义
│ ├── stock.ts # 股票相关类型
│ └── api.ts # API 相关类型
├── public/ # 静态资源
├── next.config.js # Next.js 配置
├── tailwind.config.ts # Tailwind CSS 配置
├── tsconfig.json # TypeScript 配置
└── package.json # 项目依赖
\`\`\`

## 🔌 数据来源

本项目已集成真实数据源：

### A 股数据

- ✅ **新浪财经 API**：获取实时行情、指数数据、五档盘口、K 线数据
- ✅ **东方财富 API**：获取热门股票榜单、主力资金流向

### 美股数据

- ✅ **新浪财经美股 API**：获取美股指数、个股实时行情、K 线数据

### 数据特点

- 📡 **实时性**：交易时间延迟 3-5 秒
- 🔄 **自动刷新**：页面自动更新（30-60 秒间隔）
- 💯 **真实数据**：完全来自公开金融 API，非模拟数据
- 🆓 **免费使用**：使用免费公开 API，无需注册

> ⚠️ **注意**:
>
> - 免费 API 可能存在频率限制和访问限制
> - 非交易时间显示上一交易日数据
> - 数据仅供参考，投资决策请以官方数据为准
> - 生产环境建议使用付费数据服务：同花顺 iFinD、Wind 万得、聚宽数据、Tushare 等

详细数据源说明请查看 [DATA_SOURCE.md](./DATA_SOURCE.md)

## 📊 主要功能说明

### 1. 市场概览

- 显示主要指数的实时行情
- 提供涨幅榜、跌幅榜、成交量榜
- 自动 30 秒刷新数据

### 2. 个股详情

- 实时价格、涨跌幅、成交量等关键指标
- 可切换不同周期的 K 线图（日、周、月、分钟）
- 五档买卖盘口实时数据
- 支持图表缩放和拖动

### 3. 主力资金

- 展示主力资金净流入排行
- 区分超大单、大单、中单、小单
- 支持按资金流向或涨跌幅排序
- 资金单位自动格式化（万/亿）

## 🚀 后续计划

- [ ] 美股市场数据集成
- [ ] 自选股功能
- [ ] 股票搜索功能
- [ ] 更多技术指标（MACD、KDJ、RSI 等）
- [ ] 消息面资讯集成
- [ ] 用户登录和个性化设置
- [ ] 移动端 App
- [ ] WebSocket 实时推送

## ⚠️ 免责声明

本项目仅供学习和技术交流使用，不构成任何投资建议。

- 数据仅供参考，请以官方数据为准
- 投资有风险，入市需谨慎
- 使用本系统产生的任何投资决策后果由用户自行承担

## 📝 开发说明

### 添加新的数据源

1. 在 `lib/stockApi.ts` 中添加新的 API 函数
2. 在 `app/api/` 下创建对应的路由处理
3. 在页面组件中调用新的 API

### 自定义图表

K 线图基于 ECharts 实现，可以在 `components/KlineChart.tsx` 中修改图表配置来自定义样式和功能。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

Made with ❤️ by [Your Name]
