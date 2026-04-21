#!/bin/bash

# Netlify 快速部署脚本
# 自动构建并提示如何部署到Netlify

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  H5 Web App Netlify 部署工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 进入client目录
cd /workspace/projects/client

# 检查dist目录
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}开始构建Web版本...${NC}"
    npx expo export --platform web
    echo -e "${GREEN}✓ 构建完成！${NC}"
else
    echo -e "${GREEN}✓ Web版本已构建${NC}"
    read -p "是否重新构建？(y/N): " rebuild
    if [[ $rebuild == "y" || $rebuild == "Y" ]]; then
        npx expo export --platform web
        echo -e "${GREEN}✓ 重新构建完成！${NC}"
    fi
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  部署到Netlify${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}请按照以下步骤操作：${NC}"
echo ""
echo "1️⃣  打开浏览器，访问："
echo -e "   ${BLUE}https://app.netlify.com/drop${NC}"
echo ""
echo "2️⃣  打开文件管理器，找到以下文件夹："
echo -e "   ${BLUE}$(pwd)/dist${NC}"
echo ""
echo "3️⃣  将整个 dist 文件夹拖拽到Netlify网页上的"
echo "    \"Drag and drop your site folder here\" 区域"
echo ""
echo "4️⃣  等待上传完成（约30秒-1分钟）"
echo ""
echo "5️⃣  获取访问链接并分享给用户"
echo ""
echo -e "${YELLOW}⚠️  重要提示：${NC}"
echo "部署完成后，记得在Netlify项目设置中配置环境变量："
echo ""
echo "  Key: EXPO_PUBLIC_BACKEND_BASE_URL"
echo "  Value: ${EXPO_PUBLIC_BACKEND_BASE_URL}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo ""
echo "按任意键打开Netlify部署页面..."
read -n 1

# 尝试打开浏览器（根据操作系统）
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://app.netlify.com/drop" 2>/dev/null || \
        google-chrome "https://app.netlify.com/drop" 2>/dev/null || \
        firefox "https://app.netlify.com/drop" 2>/dev/null || \
        echo "请手动打开浏览器访问: https://app.netlify.com/drop"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://app.netlify.com/drop"
fi

echo ""
echo -e "${GREEN}🎉 准备完成！祝您部署顺利！${NC}"
