#!/bin/bash

# ngrok快速启动脚本
# 让本地主后端可以通过公网访问

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  主后端公网访问配置工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查主后端是否运行
echo -e "${YELLOW}检查主后端状态...${NC}"
if curl -s http://localhost:9091/api/v1/health > /dev/null; then
    echo -e "${GREEN}✓ 主后端运行中 (localhost:9091)${NC}"
else
    echo -e "${YELLOW}主后端未运行，尝试启动...${NC}"
    cd /workspace/projects/server && pnpm run dev > /dev/null 2>&1 &
    sleep 3
    if curl -s http://localhost:9091/api/v1/health > /dev/null; then
        echo -e "${GREEN}✓ 主后端启动成功${NC}"
    else
        echo -e "${YELLOW}主后端启动失败，请手动启动${NC}"
    fi
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  配置公网访问${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查ngrok是否安装
if command -v ngrok &> /dev/null; then
    echo -e "${GREEN}✓ ngrok已安装${NC}"

    # 检查是否已认证
    if [ -f ~/.config/ngrok/ngrok.yml ]; then
        echo -e "${GREEN}✓ ngrok已认证${NC}"
        echo ""
        echo "启动ngrok..."

        # 启动ngrok
        ngrok http 9091
    else
        echo -e "${YELLOW}ngrok未认证${NC}"
        echo ""
        echo "请先认证ngrok："
        echo "1. 访问 https://ngrok.com 注册账号（免费）"
        echo "2. 复制Authtoken"
        echo "3. 运行: ngrok config add-authtoken YOUR_TOKEN"
        echo ""
        read -p "认证完成后按回车继续..."

        # 重新检查认证
        if [ -f ~/.config/ngrok/ngrok.yml ]; then
            echo -e "${GREEN}✓ ngrok认证成功${NC}"
            echo ""
            echo "启动ngrok..."
            ngrok http 9091
        else
            echo -e "${YELLOW}请先完成认证${NC}"
        fi
    fi
else
    echo -e "${YELLOW}ngrok未安装${NC}"
    echo ""
    echo "安装ngrok："
    echo ""
    echo "方法1（推荐，使用apt）："
    echo "  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null"
    echo "  echo \"deb https://ngrok-agent.s3.amazonaws.com buster main\" | sudo tee /etc/apt/sources.list.d/ngrok.list"
    echo "  sudo apt update && sudo apt install ngrok"
    echo ""
    echo "方法2（下载二进制文件）："
    echo "  wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz"
    echo "  tar xvf ngrok-v3-stable-linux-amd64.tgz"
    echo "  sudo mv ngrok /usr/local/bin/"
    echo ""
    echo "安装完成后，重新运行此脚本。"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}  下一步${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "1. 复制ngrok显示的公网地址（例如：https://abc123.ngrok-free.app）"
echo "2. 修改 dist/index.html 中的后端地址"
echo "3. 上传到Netlify"
echo "4. 测试H5应用"
echo ""
echo "详细指南: /workspace/projects/BACKEND_NGROK_GUIDE.md"
