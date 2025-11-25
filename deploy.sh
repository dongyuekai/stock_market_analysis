#!/bin/bash

echo "🚀 股票分析系统 - 快速部署指南"
echo "================================"
echo ""

# 检查是否有GitHub仓库
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  请先设置GitHub远程仓库："
    echo ""
    echo "1. 访问 https://github.com/new 创建新仓库"
    echo "2. 仓库名建议：stock-market-analysis"
    echo "3. 设置为 Public（公开）"
    echo "4. 然后运行："
    echo ""
    echo "   git remote add origin https://github.com/你的用户名/stock-market-analysis.git"
    echo "   git push -u origin main"
    echo ""
else
    echo "✅ 已配置 GitHub 远程仓库"
    git remote get-url origin
    echo ""
    echo "📤 推送代码到 GitHub..."
    git push origin main
    echo ""
fi

echo "🌐 部署到 Vercel："
echo "================================"
echo ""
echo "方式一：网页部署（推荐，最简单）"
echo "1. 访问：https://vercel.com/new"
echo "2. 使用 GitHub 账号登录"
echo "3. 选择 stock-market-analysis 仓库"
echo "4. 点击 Deploy"
echo "5. 等待 2-3 分钟即可完成！"
echo ""
echo "方式二：使用 Vercel CLI"
echo "1. 升级 Node.js 到 18+ 版本"
echo "2. 运行：npm install -g vercel"
echo "3. 运行：vercel --prod"
echo ""
echo "================================"
echo ""
echo "📱 部署成功后，你会获得一个类似这样的地址："
echo "   https://stock-market-analysis-xxx.vercel.app"
echo ""
echo "🎉 这个地址可以分享给任何人，不需要VPN访问！"
