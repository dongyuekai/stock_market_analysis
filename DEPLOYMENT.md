# 部署指南

## 方式一：使用 Vercel（推荐，最简单）

### 1. 前提条件
- 拥有 GitHub 账号
- 拥有 Vercel 账号（可以用 GitHub 账号登录）

### 2. 部署步骤

#### 步骤1: 推送代码到 GitHub

1. 在 GitHub 创建新仓库：https://github.com/new
   - 仓库名：`stock-market-analysis`
   - 设置为 Public（公开）
   - 不要勾选任何初始化选项

2. 在终端执行以下命令：
```bash
cd /Users/dongyuekai/Desktop/demos/stock_market_analysis

# 添加 GitHub 远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/stock-market-analysis.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 步骤2: 在 Vercel 部署

1. 访问 Vercel：https://vercel.com
2. 点击 "Sign Up" 或 "Login"，使用 GitHub 账号登录
3. 点击 "Add New..." → "Project"
4. 选择刚才创建的 `stock-market-analysis` 仓库
5. 点击 "Import"
6. 保持默认设置，点击 "Deploy"
7. 等待 2-3 分钟，部署完成！

#### 步骤3: 访问你的网站

部署成功后，Vercel 会自动分配一个域名，类似：
```
https://stock-market-analysis-xxx.vercel.app
```

这个地址可以直接分享给任何人访问，不需要 VPN！

### 3. 自定义域名（可选）

如果你有自己的域名，可以在 Vercel 项目设置中添加自定义域名。

---

## 方式二：使用国内平台

### Zeabur（国内可访问）

1. 访问：https://zeabur.com
2. 使用 GitHub 登录
3. 点击 "Create Project" → 选择你的仓库
4. 等待部署完成

### Railway（国内访问较慢）

1. 访问：https://railway.app
2. 使用 GitHub 登录
3. 新建项目，连接仓库
4. 自动检测 Next.js 并部署

---

## 方式三：使用阿里云/腾讯云（需要备案）

如果想使用国内服务器且拥有已备案域名，可以：

1. 购买云服务器（ECS）
2. 安装 Node.js 和 PM2
3. 拉取代码并运行：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 使用 PM2 运行
pm2 start npm --name "stock-market" -- start
```

---

## 环境变量配置（如果需要）

如果未来需要添加 API Key 或其他配置，在 Vercel 项目设置中添加环境变量：

- Settings → Environment Variables
- 添加所需变量
- 重新部署

---

## 常见问题

### Q1: 部署后 API 报错
**A**: 检查 Next.js 版本和 Node.js 版本是否匹配，确保使用 Node.js 18+

### Q2: 数据不显示
**A**: 可能是数据源 API 被限流，等待几分钟后刷新

### Q3: 如何更新网站
**A**: 只需要推送代码到 GitHub，Vercel 会自动重新部署：
```bash
git add .
git commit -m "更新说明"
git push
```

---

## 快速命令

```bash
# 克隆到新机器
git clone https://github.com/你的用户名/stock-market-analysis.git
cd stock-market-analysis

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

---

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: ECharts
- **部署**: Vercel
- **数据源**: 腾讯财经API、东方财富API

---

## 性能优化建议

1. 启用 Next.js Image 优化
2. 添加 Redis 缓存（减少API调用）
3. 使用 CDN 加速静态资源
4. 添加错误监控（如 Sentry）

---

## 联系与支持

如有问题，请提交 GitHub Issue 或通过邮件联系。
