# 🚀 主后端部署指南（Render）

## ✅ 当前状态

**主后端信息：**
- 位置：`/workspace/projects/server/`
- 本地运行：`http://localhost:9091`
- 状态：✅ 运行正常
- 包含接口：
  - ✅ `/api/v1/health` - 健康检查
  - ✅ `/api/v1/auth/verify` - 登录验证
  - ✅ 所有其他业务接口

---

## 📦 部署方案：Render（免费）

Render是一个提供免费部署的平台，非常适合Node.js后端和PostgreSQL数据库。

### 为什么选择Render？

- ✅ 完全免费
- ✅ 提供免费PostgreSQL数据库
- ✅ 自动HTTPS
- ✅ 支持自定义域名
- ✅ 自动部署（Git推送）

---

## 🎯 部署步骤

### 准备工作

#### 第1步：准备Git仓库

```bash
cd /workspace/projects

# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到Render"
```

#### 第2步：推送到GitHub

1. 在GitHub创建新仓库
2. 关联远程仓库：
   ```bash
   git remote add origin https://github.com/yourusername/yourrepo.git
   ```
3. 推送代码：
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

### 部署到Render

#### 第3步：注册Render账号

1. 访问 [render.com](https://render.com)
2. 点击 "Sign Up"
3. 使用GitHub账号注册（推荐）

#### 第4步：创建PostgreSQL数据库

1. 登录Render后，点击 "New +"
2. 选择 "Database"
3. 选择 "PostgreSQL"
4. 选择免费计划（Free）
5. 配置：
   - Name: `marketing-db`
   - Database: `marketing`
   - User: `marketing_user`
6. 点击 "Create Database"
7. 等待数据库创建完成（约2-3分钟）

#### 第5步：获取数据库连接信息

1. 在数据库页面，找到 "Connections"
2. 复制 "Internal Database URL"
3. 格式类似：
   ```
   postgres://marketing_user:password@dpg-xxx.oregon-postgres.render.com/marketing
   ```

#### 第6步：创建Web服务

1. 点击 "New +"
2. 选择 "Web Service"
3. 选择 "Build and deploy from a Git repository"
4. 选择刚才推送的GitHub仓库
5. 配置：
   - Name: `marketing-backend`
   - Region: `Oregon (US West)`
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `cd server && pnpm install && pnpm run build`
   - Start Command: `cd server && node dist/index.js`
6. 展开Advanced，添加环境变量：
   ```
   NODE_ENV: production
   PORT: 10000
   DATABASE_URL: postgres://marketing_user:password@dpg-xxx.oregon-postgres.render.com/marketing
   EXPO_PUBLIC_BACKEND_BASE_URL: https://marketing-backend.onrender.com
   ```
7. 点击 "Create Web Service"
8. 等待部署完成（约5-10分钟）

---

### 第7步：测试后端

部署完成后：

1. 在Render Dashboard点击服务名称
2. 查看服务状态（应该显示 "Live"）
3. 复制访问URL（例如：`https://marketing-backend.onrender.com`）
4. 测试接口：

```bash
# 测试健康检查
curl https://marketing-backend.onrender.com/api/v1/health

# 测试登录验证
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
  https://marketing-backend.onrender.com/api/v1/auth/verify
```

---

## 🔧 配置H5应用

### 第8步：修改H5配置

1. 下载 `dist.tar.gz`
2. 解压后打开 `dist/index.html`
3. 修改后端地址：

```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://marketing-backend.onrender.com';
</script>
```

4. 保存
5. 上传到Netlify

---

## 📊 预期结果

部署成功后：

- **后端地址**：`https://marketing-backend.onrender.com`
- **H5地址**：`https://your-app.netlify.app`
- **状态**：✅ 完全在线，公网可访问
- **HTTPS**：✅ 自动配置
- **数据库**：✅ PostgresSQL免费实例

---

## 💡 提示

### 数据库迁移

如果主后端使用了数据库迁移，需要：

1. 连接到Render数据库
2. 执行迁移脚本

```bash
# 连接到Render PostgreSQL
psql postgres://marketing_user:password@dpg-xxx.oregon-postgres.render.com/marketing

# 执行迁移
\i server/drizzle/0001_initial.sql
```

### 查看日志

在Render Dashboard中可以查看：
- 部署日志
- 运行时日志
- 错误日志

### 自动部署

推送代码到GitHub后，Render会自动重新部署。

---

## ❌ 常见问题

### 问题1：部署失败

**检查：**
1. GitHub仓库是否正确关联
2. Build Command和Start Command是否正确
3. 环境变量是否配置完整

### 问题2：数据库连接失败

**检查：**
1. DATABASE_URL是否正确
2. 数据库是否已经创建
3. 是否有网络连接问题

### 问题3：应用无法访问

**检查：**
1. 服务状态是否为"Live"
2. 健康检查是否通过
3. 是否有防火墙限制

---

## 📖 参考文档

- Render文档：https://render.com/docs
- PostgreSQL文档：https://www.postgresql.org/docs/
- Express文档：https://expressjs.com/

---

## 🎯 总结

**部署流程：**
1. 推送代码到GitHub
2. 在Render创建PostgreSQL数据库
3. 在Render创建Web服务
4. 配置环境变量
5. 等待部署完成
6. 测试后端接口
7. 修改H5配置
8. 部署H5到Netlify

**完成后，所有用户都可以公网访问H5应用！** 🚀
