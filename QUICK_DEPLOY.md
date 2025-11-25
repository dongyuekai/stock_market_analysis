# 🚀 快速部署到 Vercel（3 分钟完成）

## 第一步：推送到 GitHub

### 1. 创建 GitHub 仓库

访问：https://github.com/new

- 仓库名：`stock-market-analysis`
- 可见性：**Public**（公开）
- ❌ 不要勾选任何初始化选项

### 2. 推送代码（在终端执行）

```bash
cd /Users/dongyuekai/Desktop/demos/stock_market_analysis

# 添加远程仓库（替换成你的GitHub用户名）
git remote add origin https://github.com/你的用户名/stock-market-analysis.git

# 推送代码
git push -u origin main
```

---

## 第二步：在 Vercel 部署

### 1. 登录 Vercel

访问：https://vercel.com/login

点击 **Continue with GitHub** 使用 GitHub 账号登录

### 2. 导入项目

1. 登录后，点击右上角 **Add New...** → **Project**
2. 在列表中找到 `stock-market-analysis` 仓库
3. 点击右侧的 **Import** 按钮

### 3. 配置项目（保持默认）

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `next build`（默认）
- **Output Directory**: `.next`（默认）

### 4. 部署

点击蓝色的 **Deploy** 按钮

等待 2-3 分钟... ⏳

### 5. 完成！🎉

部署成功后，你会看到：

- ✅ 成功页面
- 🌐 你的网站地址：`https://stock-market-analysis-xxx.vercel.app`

**这个地址可以直接分享给任何人，不需要 VPN！**

---

## 第三步：分享网址

复制 Vercel 给你的域名（类似 `https://xxx.vercel.app`），分享给朋友即可！

---

## 常见问题

### Q: 部署失败怎么办？

**A**: 检查以下几点：

1. Node.js 版本是否为 18+（Vercel 自动使用最新版）
2. 代码是否成功推送到 GitHub
3. 查看 Vercel 的部署日志（Deployments → 点击失败的部署 → View Function Logs）

### Q: 如何更新网站？

**A**: 只需要推送新代码到 GitHub：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动检测并重新部署！

### Q: 可以绑定自己的域名吗？

**A**: 可以！在 Vercel 项目设置中：

1. Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 其他部署方式

### 方式二：Netlify（备选）

1. 访问：https://www.netlify.com
2. 登录并导入 GitHub 仓库
3. 构建命令：`npm run build`
4. 发布目录：`.next`

### 方式三：国内平台 Zeabur

1. 访问：https://zeabur.com
2. 使用 GitHub 登录
3. 创建项目，选择仓库
4. 自动检测并部署

---

## 截图示例

部署成功后，你的网站会是这样：

```
🏠 首页
├─ 📊 A股市场（上证、深证、北交所指数 + 热门股票）
├─ 🌍 美股市场（道琼斯、纳斯达克、标普500 + 中概股）
└─ 💰 资金流向（主力资金净流入排行）
```

---

## 技术支持

如果遇到问题：

1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 详细文档
2. 提交 GitHub Issue
3. 查看 Vercel 官方文档：https://vercel.com/docs

---

**祝部署顺利！🎊**
