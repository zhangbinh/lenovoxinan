# 🚀 部署到Vercel（推荐方案）

## ✅ 为什么选择Vercel？

- ✅ 对React Native Web的原生支持
- ✅ 不会强制添加CSP策略
- ✅ 更快的构建速度
- ✅ 更大的免费额度
- ✅ 更简单的配置
- ✅ 全球CDN加速

---

## 📋 部署步骤（10分钟）

### 第1步：创建Vercel账户

1. 访问 https://vercel.com/
2. 点击 "Sign Up"
3. 使用GitHub、GitLab或Bitbucket账户登录（推荐GitHub）

---

### 第2步：导入项目

1. 登录后，点击 "Add New..." > "Project"
2. 在 "Import Git Repository" 中选择你的GitHub仓库
3. 点击 "Import"

---

### 第3步：配置项目

**Framework Preset**: 选择 "Other"

**Build Command**:
```bash
cd client && npx expo export --platform web --output-dir dist
```

**Output Directory**:
```bash
client/dist
```

**Install Command**:（留空）

---

### 第4步：环境变量（可选）

如果需要配置后端URL，添加：
- **Name**: `EXPO_PUBLIC_BACKEND_BASE_URL`
- **Value**: `https://marketing-backend-cu2q.onrender.com`
- **Environment**: 选择所有环境（Production, Preview, Development）

---

### 第5步：部署

点击 "Deploy" 按钮，等待2-3分钟。

---

### 第6步：获取访问地址

部署完成后，Vercel会提供一个 `.vercel.app` 域名，例如：
```
https://你的项目名.vercel.app
```

---

## ✅ 验证部署

### 第1步：打开网站

访问你的Vercel域名

### 第2步：检查控制台

按 `F12` 打开开发者工具，查看是否有CSP错误。

**预期结果**：✅ 无CSP错误

### 第3步：测试登录

- 店面编号：`test`
- 店面名称：`test`
- 登录密码：`test`

**预期结果**：✅ 登录成功

---

## 🔧 自定义域名（可选）

### 第1步：添加域名

1. 进入项目设置
2. 点击 "Domains"
3. 点击 "Add" 输入你的域名

### 第2步：配置DNS

根据Vercel的提示，在你的域名DNS服务商处添加记录：

```
类型: CNAME
名称: @ 或 www
值: cname.vercel-dns.com
```

### 第3步：等待生效

DNS生效需要5-10分钟。

---

## 📊 对比：Netlify vs Vercel

| 功能 | Netlify | Vercel |
|------|---------|--------|
| React Native Web支持 | ⚠️ 需要配置CSP | ✅ 原生支持 |
| CSP策略 | ❌ 强制添加 | ✅ 不添加 |
| 构建速度 | ⚠️ 中等 | ✅ 快 |
| 免费额度 | 100GB/月 | 100GB/月 |
| 自定义域名 | ✅ 免费 | ✅ 免费 |
| 配置复杂度 | ⚠️ 复杂 | ✅ 简单 |

---

## 🎯 快速命令行部署

如果你已经安装了Vercel CLI：

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

## 💡 提示

- ✅ Vercel会自动检测 `vercel.json` 配置文件
- ✅ 每次git push都会自动部署
- ✅ 可以在Vercel Dashboard中查看部署日志
- ✅ 支持回滚到之前的版本

---

## 🚀 立即开始

1. 访问 https://vercel.com/
2. 导入你的GitHub仓库
3. 配置构建命令和输出目录
4. 点击部署

**10分钟后，你的应用就能正常运行了！** 🎉
