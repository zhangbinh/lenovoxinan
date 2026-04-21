# H5 Web App 快速开始

## 🎉 iPhone用户现在可以直接使用了！

您的应用已支持H5 Web平台，iPhone用户无需下载App即可使用。

---

## 📱 iPhone用户如何使用

### 方法1：直接访问（最简单）

1. 在Safari中打开应用链接
2. 开始使用

### 方法2：添加到主屏幕（推荐）⭐

1. 在Safari中打开应用链接
2. 点击分享按钮或长按地址栏
3. 选择"添加到主屏幕"
4. 点击"添加"
5. 从主屏幕打开，全屏体验

---

## 🚀 快速部署（3种方案）

### 方案1：Netlify（最简单，推荐）⭐⭐⭐⭐⭐

```bash
cd /workspace/projects
bash scripts/deploy-h5.sh
# 选择 2
```

然后按照提示操作：
1. 访问 https://app.netlify.com/drop
2. 拖拽 `client/dist` 文件夹
3. 等待部署完成

### 方案2：Vercel（快速，推荐）⭐⭐⭐⭐⭐

```bash
cd /workspace/projects
bash scripts/deploy-h5.sh
# 选择 3
```

### 方案3：本地测试

```bash
cd /workspace/projects
bash scripts/deploy-h5.sh
# 选择 1

# 构建完成后
cd client/dist
npx serve

# 访问 http://localhost:3000
```

---

## 🔗 分享给用户

部署完成后，您将获得一个访问链接，例如：
- `https://your-app.netlify.app`
- `https://your-app.vercel.app`

直接将这个链接分享给用户即可！

---

## 📖 详细文档

查看完整部署文档：
```bash
cat /workspace/projects/H5_DEPLOYMENT.md
```

---

## ✅ 核心功能支持

- ✅ 文案生成
- ✅ 脚本生成
- ✅ 内容运营建议（小红书/抖音）
- ✅ 已发布内容管理
- ✅ 版本更新
- ✅ 深色/浅色主题

---

## 💡 提示

- 完全免费，无需服务器
- 支持所有iPhone型号
- 体验接近原生App
- 自动HTTPS加密

---

## 🆘 遇到问题？

查看详细文档：`/workspace/projects/H5_DEPLOYMENT.md`
