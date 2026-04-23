#!/bin/bash
# 在构建后的index.html中添加CSP meta标签

INDEX_HTML="dist/index.html"

# 在<title>标签后添加CSP meta标签
sed -i '/<title>/a\    <meta http-equiv="Content-Security-Policy" content="default-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; script-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; style-src * '\''unsafe-inline'\'' data: blob:; img-src * data: blob: https: http:; font-src * data: blob:; connect-src * data: blob: ws: wss: https: http:; worker-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; object-src '\''none'\''" />' "$INDEX_HTML"

echo "CSP meta标签已添加到 $INDEX_HTML"
