#!/bin/bash

# H5 Web App 快速构建和部署脚本
# 支持：本地测试、Vercel、Netlify

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  H5 Web App 构建和部署工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 显示菜单
echo "请选择操作："
echo "1. 本地构建Web版本（仅构建，不部署）"
echo "2. 部署到Netlify（推荐，免费且简单）"
echo "3. 部署到Vercel（推荐，免费且快速）"
echo "4. 部署到GitHub Pages（免费，需要GitHub仓库）"
echo "5. 查看部署文档"
echo ""
read -p "请输入选项 (1-5): " choice

case $choice in
  1)
    echo -e "${GREEN}开始构建Web版本...${NC}"
    echo ""

    # 检查是否在client目录
    if [ ! -f "package.json" ]; then
      echo -e "${YELLOW}正在切换到client目录...${NC}"
      cd /workspace/projects/client
    fi

    # 构建Web版本
    echo "执行: npx expo export --platform web"
    npx expo export --platform web

    if [ -d "dist" ]; then
      echo ""
      echo -e "${GREEN}✓ 构建成功！${NC}"
      echo -e "输出目录: ${BLUE}$(pwd)/dist${NC}"
      echo ""
      echo "本地测试方法："
      echo "1. 进入dist目录: cd dist"
      echo "2. 启动本地服务器: npx serve"
      echo "3. 访问: http://localhost:3000"
    else
      echo -e "${YELLOW}构建失败，dist目录不存在${NC}"
      exit 1
    fi
    ;;

  2)
    echo -e "${GREEN}部署到Netlify...${NC}"
    echo ""

    # 检查是否在client目录
    if [ ! -f "package.json" ]; then
      cd /workspace/projects/client
    fi

    # 先构建
    echo "步骤 1/2: 构建Web版本..."
    npx expo export --platform web

    if [ -d "dist" ]; then
      echo ""
      echo -e "${GREEN}✓ 构建成功！${NC}"
      echo ""
      echo "步骤 2/2: 部署到Netlify..."
      echo ""
      echo -e "${YELLOW}请按照以下步骤操作：${NC}"
      echo "1. 访问 https://app.netlify.com/drop"
      echo "2. 将 dist 文件夹拖拽到上传区域"
      echo "3. 等待部署完成"
      echo "4. 获取访问链接"
      echo ""
      echo -e "${BLUE}提示：${NC}dist文件夹位于: $(pwd)/dist"
      echo ""
      echo -e "${YELLOW}环境变量配置：${NC}"
      echo "在Netlify项目设置中添加："
      echo "  EXPO_PUBLIC_BACKEND_BASE_URL=你的后端API地址"
    else
      echo -e "${YELLOW}构建失败${NC}"
      exit 1
    fi
    ;;

  3)
    echo -e "${GREEN}部署到Vercel...${NC}"
    echo ""

    # 检查是否在client目录
    if [ ! -f "package.json" ]; then
      cd /workspace/projects/client
    fi

    # 先构建
    echo "步骤 1/2: 构建Web版本..."
    npx expo export --platform web

    if [ -d "dist" ]; then
      echo ""
      echo -e "${GREEN}✓ 构建成功！${NC}"
      echo ""
      echo "步骤 2/2: 部署到Vercel..."
      echo ""

      # 检查是否安装了vercel
      if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}正在安装Vercel CLI...${NC}"
        npm install -g vercel
      fi

      # 检查是否已登录
      if [ ! -f ~/.vercel/project.json ]; then
        echo -e "${YELLOW}请先登录Vercel${NC}"
        vercel login
      fi

      echo ""
      echo "开始部署..."
      vercel --prod --yes

      echo ""
      echo -e "${GREEN}✓ 部署完成！${NC}"
      echo ""
      echo -e "${YELLOW}环境变量配置：${NC}"
      echo "在Vercel项目设置中添加："
      echo "  EXPO_PUBLIC_BACKEND_BASE_URL=你的后端API地址"
    else
      echo -e "${YELLOW}构建失败${NC}"
      exit 1
    fi
    ;;

  4)
    echo -e "${GREEN}部署到GitHub Pages...${NC}"
    echo ""

    # 检查是否在client目录
    if [ ! -f "package.json" ]; then
      cd /workspace/projects/client
    fi

    # 检查Git仓库
    if [ ! -d ".git" ]; then
      echo -e "${YELLOW}未初始化Git仓库${NC}"
      echo "请先初始化Git仓库并推送到GitHub"
      exit 1
    fi

    # 先构建
    echo "步骤 1/3: 构建Web版本..."
    npx expo export --platform web

    if [ -d "dist" ]; then
      echo ""
      echo -e "${GREEN}✓ 构建成功！${NC}"
      echo ""
      echo "步骤 2/3: 推送到gh-pages分支..."

      # 检查是否有git subtree命令
      if command -v git subtree &> /dev/null; then
        git subtree push --prefix dist origin gh-pages
      else
        echo -e "${YELLOW}git subtree命令不可用${NC}"
        echo "请手动执行以下命令："
        echo "  git checkout -b gh-pages"
        echo "  git rm -rf ."
        echo "  cp -r dist/* ."
        echo "  git add ."
        echo "  git commit -m 'Deploy to GitHub Pages'"
        echo "  git push origin gh-pages"
        exit 1
      fi

      echo ""
      echo -e "${GREEN}✓ 推送成功！${NC}"
      echo ""
      echo "步骤 3/3: 配置GitHub Pages"
      echo ""
      echo -e "${YELLOW}请按照以下步骤操作：${NC}"
      echo "1. 访问GitHub仓库设置"
      echo "2. 找到'Pages'设置"
      echo "3. 选择'gh-pages'分支"
      echo "4. 点击'Save'"
      echo "5. 等待几分钟后访问"
      echo ""
      echo "访问地址: https://yourusername.github.io/yourrepo/"
    else
      echo -e "${YELLOW}构建失败${NC}"
      exit 1
    fi
    ;;

  5)
    echo -e "${GREEN}查看部署文档...${NC}"
    echo ""

    if [ -f "/workspace/projects/H5_DEPLOYMENT.md" ]; then
      cat /workspace/projects/H5_DEPLOYMENT.md
    else
      echo "部署文档不存在"
    fi
    ;;

  *)
    echo -e "${YELLOW}无效的选项${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}操作完成！${NC}"
echo -e "${BLUE}========================================${NC}"
