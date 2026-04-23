# 🔄 Netlify 清除缓存详细步骤

## 方法一：清除缓存并重新部署（推荐）

### 步骤1：登录Netlify
访问：https://app.netlify.com
使用你的GitHub账号登录

### 步骤2：选择你的站点
在Dashboard中，找到并点击你的H5应用站点

### 步骤3：进入站点设置
在站点页面，点击右上角或侧边栏的 "Site settings"

### 步骤4：找到构建设置
在左侧菜单中，找到并点击：
- "Site configuration" → "Build & deploy"
或直接在设置页面查找 "Build & deploy"

### 步骤5：清除缓存
在 "Build & deploy" 页面中：
- 向下滚动找到 "Post processing" 部分
- 你会看到 "Clear cache" 按钮
- 点击 "Clear cache and redeploy site"

### 步骤6：等待部署
等待2-5分钟，直到部署完成

---

## 方法二：手动触发部署

### 步骤1：进入Deploys页面
在站点主页，点击顶部的 "Deploys" 标签

### 步骤2：查找最新部署
在部署历史中，找到最新的部署

### 步骤3：重新部署
在最新部署的右侧，点击 "Trigger deploy" 按钮
选择 "Retry deploy"

---

## 方法三：拖拽重新部署（最简单）⭐

### 步骤1：下载最新的dist文件
从 `/workspace/projects/client/dist.tar.gz` 下载

### 步骤2：解压文件
```bash
tar -xzf dist.tar.gz
```

### 步骤3：重新上传
- 访问你的Netlify站点
- 点击 "Site overview"
- 将解压后的 `dist` 文件夹拖拽到页面上
- 覆盖现有文件
- 等待部署完成

---

## 方法四：使用netlify-cli清除缓存

如果你有netlify-cli工具：

```bash
# 安装netlify-cli（如果没有）
npm install -g netlify-cli

# 登录
netlify login

# 清除缓存
netlify cache:clear

# 重新部署
netlify deploy --prod --dir=dist
```

---

## 🔍 验证缓存是否清除

### 检查1：查看部署时间
在 "Deploys" 页面，查看最新部署的时间
- 如果是几分钟前，说明缓存已清除
- 如果是旧的时间，说明还没有重新部署

### 检查2：检查_headers文件
1. 访问你的H5应用
2. 按F12打开开发者工具
3. 切换到 "Network" 标签
4. 刷新页面
5. 在列表中找到 `_headers` 文件
6. 点击查看，查看响应内容

**应该显示**：
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; ...
```

### 检查3：检查Response Headers
在Network标签中，点击任意一个JS文件
查看 "Response Headers" 部分
查找 `Content-Security-Policy` 头

**应该包含**：
```
Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; ...
```

---

## 💡 如果找不到清除缓存按钮

### 可能的原因：
1. Netlify界面更新，位置改变
2. 使用的是Netlify免费版，功能受限
3. 站点配置不同

### 解决方案：
**使用方法三（拖拽重新部署）**，这是最简单直接的方法

---

## 🚀 推荐操作

**最简单的方法**：
1. 下载最新的 `dist.tar.gz`（2.9 MB）
2. 解压文件
3. 重新拖拽到Netlify页面
4. 等待部署完成
5. 使用 `Ctrl + Shift + R` 强制刷新浏览器

---

## 📞 如果仍然有问题

如果上述方法都不行，请提供：
1. Netlify站点的URL
2. 截图显示Netlify的界面
3. 具体看到了什么错误

我会提供更具体的指导！
