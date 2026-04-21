# H5 Web App 部署指南

## 概述

本应用已支持H5 Web平台，iPhone用户可以通过浏览器访问并使用所有功能。

---

## 一、当前H5支持情况

### ✅ 已配置的功能

1. **Web平台支持**
   - 使用 `metro` bundler
   - 单文件输出（`output: single`）
   - 支持所有核心功能

2. **跨平台兼容**
   - ✅ Android浏览器
   - ✅ iOS Safari
   - ✅ PC浏览器
   - ✅ iPad浏览器

3. **核心功能支持**
   - ✅ 文案生成
   - ✅ 脚本生成
   - ✅ 内容运营建议
   - ✅ 已发布内容管理
   - ✅ 版本更新

### ⚠️ 部分限制

- **相机功能**：仅在原生App中支持，Web端有限制
- **图片上传**：支持，但需要用户手动选择文件
- **推送通知**：不支持（需要原生App）
- **离线使用**：不支持（需要网络连接）

---

## 二、部署方案

### 方案1：Vercel部署（推荐）⭐⭐⭐⭐⭐

**优点：**
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署
- ✅ 自定义域名

**步骤：**

#### 1. 构建Web版本

```bash
cd /workspace/projects/client

# 构建Web版本
npx expo export --platform web

# 构建完成后，dist目录包含所有Web文件
```

#### 2. 部署到Vercel

**方法A：通过Vercel CLI**

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 部署
vercel --prod

# 按提示操作，选择dist目录作为输出目录
```

**方法B：通过Vercel网站**

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub/邮箱登录
3. 点击"New Project"
4. 选择"Import Git Repository"或直接上传dist目录
5. 配置：
   - Framework Preset: Other
   - Output Directory: dist
6. 点击"Deploy"

#### 3. 配置环境变量

在Vercel项目设置中添加环境变量：
```
EXPO_PUBLIC_BACKEND_BASE_URL=你的后端API地址
```

---

### 方案2：Netlify部署（推荐）⭐⭐⭐⭐⭐

**优点：**
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 拖拽部署

**步骤：**

#### 1. 构建Web版本

```bash
cd /workspace/projects/client

# 构建Web版本
npx expo export --platform web
```

#### 2. 部署到Netlify

1. 访问 [netlify.com](https://www.netlify.com)
2. 注册/登录
3. 点击"Add new site" → "Deploy manually"
4. 将 `dist` 文件夹拖拽到上传区域
5. 等待部署完成
6. 获取访问链接

#### 3. 配置环境变量

在Netlify设置中添加：
```
EXPO_PUBLIC_BACKEND_BASE_URL=你的后端API地址
```

---

### 方案3：自建服务器部署⭐⭐⭐

**优点：**
- ✅ 完全控制
- ✅ 支持自定义配置
- ✅ 可集成到现有系统

**步骤：**

#### 1. 构建Web版本

```bash
cd /workspace/projects/client

# 构建Web版本
npx expo export --platform web
```

#### 2. 上传到服务器

```bash
# 使用SCP上传
scp -r dist/* user@yourserver:/var/www/html/

# 或使用rsync
rsync -avz dist/ user@yourserver:/var/www/html/
```

#### 3. 配置Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html;
    index index.html;

    # 支持SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4. 配置HTTPS（可选）

使用Let's Encrypt免费SSL证书：
```bash
sudo certbot --nginx -d yourdomain.com
```

---

### 方案4：GitHub Pages部署⭐⭐⭐⭐

**优点：**
- ✅ 完全免费
- ✅ 自动部署
- ✅ 支持自定义域名

**步骤：**

#### 1. 创建GitHub仓库

```bash
# 初始化Git仓库
cd /workspace/projects/client
git init
git add .
git commit -m "Initial commit"

# 推送到GitHub
git branch -M main
git remote add origin https://github.com/yourusername/yourrepo.git
git push -u origin main
```

#### 2. 构建Web版本

```bash
npx expo export --platform web
```

#### 3. 创建gh-pages分支

```bash
# 将dist目录推送到gh-pages分支
git subtree push --prefix dist origin gh-pages
```

#### 4. 启用GitHub Pages

1. 访问GitHub仓库设置
2. 找到"Pages"设置
3. 选择"gh-pages"分支
4. 点击"Save"
5. 等待几分钟后，访问 `https://yourusername.github.io/yourrepo/`

---

## 三、iPhone用户使用指南

### 方案1：直接访问Safari（最简单）

**步骤：**

1. **打开Safari浏览器**
2. **输入应用网址**
   ```
   例如：https://your-app.vercel.app
   ```
3. **开始使用**

---

### 方案2：添加到主屏幕（推荐）⭐⭐⭐⭐⭐

**优点：**
- ✅ 像原生App一样
- ✅ 全屏显示（无地址栏）
- ✅ 独立图标
- ✅ 快速启动

**步骤：**

1. **在Safari中打开应用**
   ```
   https://your-app.vercel.app
   ```

2. **点击分享按钮**
   - 底部工具栏的"分享"图标
   - 长按URL地址栏

3. **选择"添加到主屏幕"**
   - 滑动找到"添加到主屏幕"
   - 点击进入

4. **确认添加**
   - 可以修改图标名称
   - 点击"添加"按钮

5. **从主屏幕打开**
   - 回到主屏幕
   - 点击应用图标
   - 全屏运行，体验接近原生App

---

## 四、优化H5体验

### 1. 配置Web App Manifest

已自动支持，包含以下特性：
- 应用名称
- 图标
- 主题色
- 启动屏幕

### 2. 启用全屏模式（iOS Safari）

访问时会自动识别为Web App，支持全屏。

### 3. 优化加载速度

使用以下优化：
- ✅ 代码压缩
- ✅ 图片优化
- ✅ 缓存策略
- ✅ CDN加速

### 4. 支持深色模式

自动跟随系统主题：
- 浅色主题
- 深色主题

---

## 五、当前测试访问

### 本地开发环境

```bash
# 启动开发服务器
cd /workspace/projects/client
npx expo start --web

# 访问
http://localhost:8081
```

### 生产环境

根据选择的部署方案，访问对应URL：
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- GitHub Pages: `https://yourusername.github.io/yourrepo/`

---

## 六、常见问题

### Q1: iPhone用户需要安装App吗？

A: 不需要！用户只需：
1. 在Safari中打开应用网址
2. 可选：添加到主屏幕

### Q2: Web版本功能有限制吗？

A: 核心功能完全支持，部分原生功能有限制：
- ✅ 文案生成、脚本生成
- ✅ 内容运营建议
- ✅ 版本更新
- ⚠️ 相机、推送通知等仅原生App支持

### Q3: 如何更新Web版本？

A: 根据部署方案不同：
- **Vercel/Netlify**: 推送代码后自动部署
- **自建服务器**: 重新构建并上传dist目录
- **GitHub Pages**: 推送dist目录到gh-pages分支

### Q4: 用户如何获取访问链接？

A: 你可以通过以下方式分享：
- 直接发送URL链接
- 生成二维码
- 使用短链接服务

### Q5: Web版本支持离线使用吗？

A: 不支持。用户需要网络连接才能使用。

---

## 七、推荐部署流程

### 快速部署（5分钟）⚡

1. **构建Web版本**
   ```bash
   cd /workspace/projects/client
   npx expo export --platform web
   ```

2. **部署到Netlify（最简单）**
   - 访问 [netlify.com](https://www.netlify.com)
   - 拖拽dist文件夹
   - 获取访问链接

3. **分享给用户**
   - 发送URL链接
   - 或生成二维码

---

## 八、后续优化

### 可选优化项

1. **自定义域名**
   - 在Vercel/Netlify中配置自定义域名

2. **添加PWA支持**
   - 实现离线缓存
   - 支持离线使用

3. **添加Analytics**
   - 集成Google Analytics
   - 统计用户使用情况

4. **优化SEO**
   - 添加meta标签
   - 提升搜索引擎排名

---

## 九、技术支持

### 查看部署日志

- **Vercel**: 在项目Dashboard查看
- **Netlify**: 在Deploys页面查看
- **自建服务器**: 查看Nginx/Apache日志

### 常见问题排查

1. **页面无法加载**
   - 检查后端API是否正常
   - 检查环境变量配置
   - 查看浏览器控制台错误

2. **部分功能不工作**
   - 检查浏览器兼容性
   - 确认功能是否支持Web平台

3. **部署失败**
   - 检查构建输出
   - 确认dist目录存在
   - 查看部署平台错误日志

---

## 总结

### 最佳实践

1. **部署选择**: 推荐使用Vercel或Netlify（免费且简单）
2. **用户使用**: 推荐添加到主屏幕（体验最佳）
3. **更新维护**: 使用Git自动部署

### 成本

- ✅ 完全免费
- ✅ 无需服务器
- ✅ 无需证书

### 用户体验

- ⭐⭐⭐⭐⭐ iPhone用户体验优秀
- ⭐⭐⭐⭐⭐ Android用户体验优秀
- ⭐⭐⭐⭐⭐ PC用户体验优秀

