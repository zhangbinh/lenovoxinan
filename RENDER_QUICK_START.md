# 🚀 Render 部署快速开始

## ⏱️ 总耗时：约20-25分钟

---

## 第1步：创建GitHub仓库（2分钟）

1. 访问 https://github.com/new
2. 仓库名：`marketing-app`
3. 描述：`西南战区营销App`
4. 勾选：Private
5. 点击 "Create repository"
6. 复制仓库URL：`https://github.com/yourusername/marketing-app.git`

### 推送代码：

```bash
cd /workspace/projects
git remote add origin https://github.com/yourusername/marketing-app.git
git branch -M main
git push -u origin main
```

---

## 第2步：注册Render（1分钟）

1. 访问 https://render.com
2. 点击 "Sign Up" → "Sign up with GitHub"
3. 授权GitHub

---

## 第3步：创建PostgreSQL数据库（3分钟）

1. Render点击 "New +" → "Database" → "PostgreSQL"
2. 配置：
   - Name: `marketing-db`
   - Database: `marketing`
   - User: `marketing_user`
   - Plan: Free
3. 点击 "Create Database"
4. 等待2-3分钟
5. 复制 "Internal Database URL"

---

## 第4步：创建Web服务（5-10分钟）

1. Render点击 "New +" → "Web Service"
2. 选择你的GitHub仓库
3. 配置：
   - Name: `marketing-backend`
   - Runtime: Node
   - Build Command: `cd server && pnpm install && pnpm run build`
   - Start Command: `cd server && node dist/index.js`
4. 添加环境变量（点击Advanced → Add Environment Variable）：

```
NODE_ENV=production
PORT=10000
DATABASE_URL=粘贴刚才复制的PostgreSQL连接字符串
EXPO_PUBLIC_BACKEND_BASE_URL=https://marketing-backend.onrender.com
```

5. 点击 "Create Web Service"
6. 等待5-10分钟

---

## 第5步：测试后端（2分钟）

```bash
# 测试健康检查
curl https://marketing-backend.onrender.com/api/v1/health

# 应该返回：{"status":"ok"}
```

---

## 第6步：更新H5配置（2分钟）

### 编辑文件：

```bash
nano /workspace/projects/client/dist/index.html
```

修改第13行为：
```html
window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://marketing-backend.onrender.com';
```

### 重新打包：

```bash
cd /workspace/projects/client
tar -czf dist.tar.gz dist
```

### 上传到Netlify：

1. 访问 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹

---

## 第7步：测试完整功能（3分钟）

1. 在浏览器打开Netlify提供的H5地址
2. 按F12打开开发者工具
3. 测试登录功能

---

## ✅ 完成后你将拥有

- **后端**：`https://marketing-backend.onrender.com`
- **H5**：`https://your-app.netlify.app`
- **状态**：✅ 完全在线

---

## 📖 详细文档

查看完整步骤：`/workspace/projects/RENDER_DEPLOY_STEPS.md`

---

**开始部署吧！** 🚀
