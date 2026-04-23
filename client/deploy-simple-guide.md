# 🚀 极简部署指南（3个文件搞定）

## 📁 只需要3个文件

在 `client/dist/` 目录下确保有这3个文件：

### 1. `index.html` - 包含CSP Meta标签
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; img-src * data: blob: https: http:; font-src * data: blob:; connect-src * data: blob: ws: wss: https: http:; worker-src * 'unsafe-inline' 'unsafe-eval' data: blob:; object-src 'none'" />
  <!-- 其他内容 -->
</head>
<body>
  <!-- 应用内容 -->
</body>
</html>
```

### 2. `netlify.toml` - 空文件（不添加任何CSP）
```toml
# 空文件 - 让Netlify不添加任何CSP
```

### 3. `_redirects` - SPA路由支持
```
/*  /index.html  200
```

## 🎯 部署步骤（3步）

### 第1步：构建
```bash
cd /workspace/projects/client
npx expo export --platform web --output-dir dist
```

### 第2步：添加CSP Meta标签到index.html
```bash
sed -i '/<title>/a\    <meta http-equiv="Content-Security-Policy" content="default-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; script-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; style-src * '\''unsafe-inline'\'' data: blob:; img-src * data: blob: https: http:; font-src * data: blob:; connect-src * data: blob: ws: wss: https: http:; worker-src * '\''unsafe-inline'\'' '\''unsafe-eval'\'' data: blob:; object-src '\''none'\''" />' dist/index.html
```

### 第3步：部署到Netlify
- 拖拽 `dist` 文件夹到Netlify
- 完成！

## ✅ 验证

访问你的网站，如果无CSP错误，就成功了。

## 🔑 核心原理

1. `netlify.toml` 空文件 → Netlify不添加任何CSP响应头
2. `index.html` Meta标签 → 浏览器使用Meta标签的CSP（因为服务端没发CSP）
3. Meta标签包含 `unsafe-eval` → 允许React Native Web使用eval

> **注意**：HTTP响应头CSP优先级 > HTML Meta CSP。我们之所以成功，是因为删除了所有服务端CSP，浏览器才使用Meta标签的CSP。

## 📌 注意事项

- 如果Netlify Dashboard中有全局CSP配置，需要删除
- 如果有安全插件，需要禁用

---
