# 🚀 Cloudflare Pages 部署指南

## ✅ 为什么选择 Cloudflare Pages？

- ⚡ **全球CDN加速** - 速度比Vercel快
- 🌍 **200+ 全球节点** - 就在用户身边
- 🆓 **超大免费额度** - 无限带宽，每月500次构建
- 🔒 **默认安全** - DDoS防护，SSL证书
- 🎯 **简单易用** - 只需几分钟部署
- ✅ **支持React Native Web** - 不会强制添加CSP

---

## 📋 部署步骤（5分钟）

### 第1步：创建Cloudflare账户

1. 访问 https://dash.cloudflare.com/sign-up
2. 使用邮箱注册（免费）
3. 验证邮箱

---

### 第2步：连接GitHub

1. 登录Cloudflare Dashboard
2. 点击 "Workers & Pages" > "Pages"
3. 点击 "Create a project"
4. 点击 "Connect to Git"
5. 点击 "Connect GitHub"
6. 授权Cloudflare访问你的GitHub

---

### 第3步：选择仓库

1. 在仓库列表中，选择 `lenovoxinan`
2. 点击 "Begin setup"

---

### 第4步：配置项目

#### 构建设置

```
Project name: lenovoxinan (自动填充)
Production branch: main (自动填充)
Framework preset: None (选择"None")
Build command: chmod +x build.sh && ./build.sh
Build output directory: client/dist
```

#### 详细说明

**Project name**：
- 可以自定义，例如：`lenovoxinan-app`
- 这将影响你的访问地址：`https://lenovoxinan-app.pages.dev`

**Production branch**：
- 保持默认：`main`
- 这是GitHub的主分支

**Framework preset**：
- 选择 **"None"**
- 我们使用自定义构建脚本

**Build command**：
```bash
chmod +x build.sh && ./build.sh
```
- 给构建脚本添加执行权限
- 执行构建脚本

**Build output directory**：
```bash
client/dist
```
- 这是构建产物的目录

---

### 第5步：环境变量（可选）

点击 "Environment variables" > "Add variable"

**变量1**：
- Variable name: `EXPO_PUBLIC_BACKEND_BASE_URL`
- Value: `https://marketing-backend-cu2q.onrender.com`
- Environment: Production, Preview, Development (全部勾选)

**变量2**：
- Variable name: `NODE_ENV`
- Value: `production`
- Environment: Production, Preview, Development (全部勾选)

---

### 第6步：部署

点击 "Save and Deploy"

**部署过程**（需要2-3分钟）：

1. **克隆代码** - Cloning repository...
2. **安装依赖** - Installing dependencies...
3. **构建项目** - Building...
4. **上传文件** - Uploading...
5. **完成** - ✓ Deployed

---

### 第7步：访问网站

部署完成后，你会看到：

```
✓ Deployed to Production

Your live site:
https://lenovoxinan.pages.dev

Preview URL:
https://deploy-preview-xxx.pages.dev
```

**点击 "Your live site" 地址访问你的网站**

---

## ✅ 验证部署

### 第1步：打开网站

访问你的Cloudflare Pages域名：
```
https://lenovoxinan.pages.dev
```

### 第2步：检查控制台

按 `F12` 打开开发者工具，查看是否有CSP错误：

**预期结果**：
- ✅ 无 "Content Security Policy" 错误
- ✅ 无 "script-src" 错误
- ✅ 无 "eval" 错误
- ✅ 页面正常加载

### 第3步：测试登录

- 店面编号：`test`
- 店面名称：`test`
- 登录密码：`test`

**预期结果**：✅ 登录成功

---

## 🔧 自定义域名（可选）

### 第1步：添加域名

1. 进入你的项目
2. 点击 "Custom domains"
3. 点击 "Set up a custom domain"

### 第2步：输入域名

输入你的域名，例如：`app.yourdomain.com`

### 第3步：配置DNS

Cloudflare会自动配置DNS，你只需要：

1. 如果域名在Cloudflare，自动完成
2. 如果域名在其他服务商，添加CNAME记录：
   ```
   类型: CNAME
   名称: app
   值: lenovoxinan.pages.dev
   ```

### 第4步：等待生效

DNS生效需要5-10分钟

---

## 📊 Cloudflare Pages vs Vercel vs Netlify

| 功能 | Cloudflare Pages | Vercel | Netlify |
|------|----------------|--------|---------|
| 全球节点数 | 200+ | 60+ | 50+ |
| 免费带宽 | 无限 | 100GB/月 | 100GB/月 |
| 免费构建 | 500次/月 | 无限 | 无限 |
| 速度 | ⚡ 最快 | ⚡ 快 | ⚡ 快 |
| CSP问题 | ✅ 不添加 | ✅ 不添加 | ❌ 强制添加 |
| 自定义域名 | ✅ 免费 | ✅ 免费 | ✅ 免费 |
| DDoS防护 | ✅ 内置 | ✅ 内置 | ✅ 内置 |

---

## 💡 优势总结

### Cloudflare Pages的优势

1. **速度最快**
   - 200+全球节点
   - 就在用户身边
   - 无限免费带宽

2. **免费额度大**
   - 无限带宽
   - 500次构建/月（足够使用）

3. **默认安全**
   - DDoS防护
   - SSL证书
   - Web应用防火墙

4. **支持React Native Web**
   - 不会强制添加CSP
   - React Native Web正常工作

5. **简单易用**
   - 只需几分钟部署
   - 自动部署
   - 回滚简单

---

## 🎯 快速命令行部署（可选）

如果你安装了Wrangler CLI：

```bash
# 安装Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy client/dist --project-name=lenovoxinan
```

---

## 🚀 立即开始

1. 访问 https://dash.cloudflare.com/sign-up
2. 连接GitHub
3. 选择 `lenovoxinan` 仓库
4. 配置构建设置
5. 点击部署

**5分钟后，你的应用就能在全球范围内快速访问！** ⚡

---

## ❓ 常见问题

### Q1: Cloudflare Pages支持React Native Web吗？

**A**: ✅ 支持！Cloudflare Pages不会强制添加CSP，React Native Web可以正常工作。

### Q2: 部署需要多长时间？

**A**: 2-3分钟。Cloudflare Pages的构建速度很快。

### Q3: 免费额度够用吗？

**A**: ✅ 足够！无限带宽，500次构建/月，对于大多数项目来说完全够用。

### Q4: 可以回滚到之前的版本吗？

**A**: ✅ 可以！在Cloudflare Dashboard中，点击 "Deployments"，选择之前的版本，点击 "Rollback"。

### Q5: 支持自定义域名吗？

**A**: ✅ 支持！而且免费。

---

## 📋 检查清单

部署前检查：
- [ ] 已创建Cloudflare账户
- [ ] 已连接GitHub
- [ ] Framework preset: None
- [ ] Build command: `chmod +x build.sh && ./build.sh`
- [ ] Output directory: `client/dist`
- [ ] 已添加环境变量（可选）

部署后验证：
- [ ] 部署成功，无错误
- [ ] 页面可以正常访问
- [ ] 浏览器控制台无CSP错误
- [ ] 登录功能正常
- [ ] 页面加载速度快

---

**现在就去Cloudflare Pages部署吧！5分钟搞定，全球快速访问！** 🚀⚡
