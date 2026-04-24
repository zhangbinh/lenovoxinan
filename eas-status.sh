#!/bin/bash
# 查询Expo EAS构建历史和下载信息

echo "=== Expo EAS 构建查询工具 ==="
echo ""

# 检查是否安装了EAS CLI
if ! command -v eas &> /dev/null; then
    echo "EAS CLI 未安装，正在安装..."
    cd client
    npm install -g eas-cli
    cd ..
fi

echo "正在查询构建历史..."
echo ""

cd client

# 查看所有构建
eas build:list

echo ""
echo "=================================================="
echo "获取下载链接的方法:"
echo ""
echo "1. 在EAS Dashboard查看:"
echo "   访问: https://expo.dev/accounts/[你的账户名]/projects/[项目名]/builds"
echo ""
echo "2. 获取特定构建的下载链接:"
echo "   eas build:view [构建ID]"
echo ""
echo "3. 生成安装二维码（需要EAS账户权限）:"
echo "   访问 EAS Dashboard -> 选择构建 -> 查看二维码"
echo ""
echo "=================================================="

cd ..
