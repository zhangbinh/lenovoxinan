#!/bin/bash
# 生成H5应用访问二维码

# 检查是否安装了qrencode
if ! command -v qrencode &> /dev/null; then
    echo "正在安装qrencode..."
    apt-get update && apt-get install -y qrencode
fi

# H5应用地址（根据实际部署平台修改）
if [ "$1" ]; then
    URL="$1"
else
    echo "使用方法: ./qrcode.sh <H5应用URL>"
    echo ""
    echo "示例:"
    echo "  ./qrcode.sh https://lenovoxinan.pages.dev"
    echo "  ./qrcode.sh https://你的域名.vercel.app"
    echo ""
    echo "将二维码保存为图片:"
    echo "  ./qrcode.sh https://lenovoxinan.pages.dev qrcode.png"
    exit 1
fi

# 生成二维码
if [ "$2" ]; then
    # 保存为图片文件
    qrencode -o "$2" "$URL"
    echo "✓ 二维码已保存到: $2"
    echo "  URL: $URL"
else
    # 在终端显示ASCII二维码
    qrencode -t ANSIUTF8 "$URL"
    echo ""
    echo "URL: $URL"
    echo ""
    echo "保存为图片: ./qrcode.sh \"$URL\" qrcode.png"
fi
