#!/bin/bash
# Cloudflare Pages 构建脚本

echo "=== 开始构建 ==="

# 进入client目录
cd client

# 安装依赖
echo "安装依赖..."
npm install

# 导出为Web版本
echo "导出Web版本..."
npx expo export --platform web --output-dir dist

echo "=== 构建完成 ==="
