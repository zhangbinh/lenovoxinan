#!/bin/bash

# 自动发布生产版本脚本

echo "========================================="
echo "开始构建生产版本"
echo "========================================="

# 检查是否已登录EAS
echo "1. 检查EAS登录状态..."
if ! npx eas whoami > /dev/null 2>&1; then
    echo "❌ 未登录EAS，请先运行: npx eas login"
    exit 1
fi

echo "✅ 已登录EAS"

# 获取当前版本号
CURRENT_VERSION=$(node -p "require('./app.json').expoClient.version")
echo "2. 当前版本号: $CURRENT_VERSION"

# 询问是否需要更新版本号
read -p "是否需要更新版本号? (y/n): " update_version

if [ "$update_version" = "y" ]; then
    read -p "请输入新版本号 (例如: 1.0.1): " new_version

    # 更新app.json中的版本号
    if [ "$OS" = "Windows_NT" ]; then
        powershell -Command "(Get-Content app.json) -replace '\"version\": \"[0-9.]*\"', '\"version\": \"$new_version\"' | Set-Content app.json"
    else
        sed -i "s/\"version\": \"[0-9.]*\"/\"version\": \"$new_version\"/" app.json
    fi

    echo "✅ 版本号已更新为: $new_version"
    CURRENT_VERSION=$new_version
fi

# 构建Android生产版本
echo "3. 开始构建Android生产版本..."
echo "构建命令: npx eas build --platform android --profile production"

npx eas build --platform android --profile production

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ Android生产版本构建成功"
else
    echo "❌ Android生产版本构建失败"
    exit 1
fi

# 提示用户下载二维码
echo ""
echo "========================================="
echo "📱 构建完成！"
echo "========================================="
echo "版本号: $CURRENT_VERSION"
echo ""
echo "请查看构建结果中的二维码，用户可以扫码下载"
echo ""
echo "========================================="
echo "下一步操作:"
echo "1. 复制二维码分享给用户"
echo "2. 或者在EAS控制台下载APK文件"
echo "========================================="
