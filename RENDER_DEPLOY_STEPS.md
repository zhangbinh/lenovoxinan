# 🚀 Render 部署详细步骤

## ✅ 当前状态

- **Git仓库**：已初始化，代码已准备
- **主后端**：运行在 `localhost:9091`
- **临时公网访问**：`https://rich-phones-sort.loca.lt`（localtunnel）

---

## 📋 完整部署步骤

### 第1步：创建GitHub仓库

#### 方法A：通过GitHub网站（推荐）

1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 配置仓库：
   - Repository name: `marketing-app`
   - Description: `西南战区营销App - H5 + 后端`
   - Public/Private: Private（推荐）
   - 不要勾选 "Initialize with README"（因为已有代码）
4. 点击 "Create repository"
5. 复制仓库URL，例如：
   ```
   https://github.com/yourusername/marketing-app.git
   ```

#### 方法B：通过GitHub CLI

```bash
# 安装gh CLI（如果还没有）
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录GitHub
gh auth login

# 创建仓库
gh repo create marketing-app --private --description "西南战区营销App"
```

---

### 第2步：推送代码到GitHub

```bash
cd /workspace/projects

# 添加远程仓库
git remote add origin https://github.com/yourusername/marketing-app.git

# 推送代码
git branch -M main
git push -u origin main
```

**将 `yourusername/marketing-app` 替换为你的实际仓库路径**

---

### 第3步：注册Render账号

1. 访问 https://render.com
2. 点击 "Sign Up"
3. 选择 "Sign up with GitHub"（推荐，免费）
4. 授权GitHub访问
5. 等待账号创建完成

---

### 第4步：创建PostgreSQL数据库

1. 登录Render后，点击右上角 "+" → "New +"
2. 选择 "Database"
3. 选择 "PostgreSQL"
4. 配置：
   - **Name**: `marketing-db`
   - **Database**: `marketing`
   - **User**: `marketing_user`
   - **Region**: Oregon (US West)（免费区域）
   - **PostgreSQL Version**: 16（最新版本）
   - **Plan**: Free（免费计划）
5. 点击 "Create Database"
6. 等待创建完成（约2-3分钟）
7. 记下数据库名称，后面会用到

---

### 第5步：获取数据库连接信息

1. 在数据库详情页面，找到左侧菜单的 "Connections"
2. 向下滚动到 "Internal Database" 部分
3. 复制连接字符串，格式类似：
   ```
   postgres://marketing_user:AbCdEf123456@dpg-abc123.oregon-postgres.render.com/marketing
   ```
4. **保存这个连接字符串**，后面配置Web服务时需要用到

---

### 第6步：创建Web服务

1. 点击右上角 "+" → "New +"
2. 选择 "Web Service"
3. 点击 "Build and deploy from a Git repository"
4. 选择刚才推送的GitHub仓库（marketing-app）
5. 配置基本信息：
   - **Name**: `marketing-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && pnpm install && pnpm run build`
   - **Start Command**: `cd server && node dist/index.js`

6. 配置高级选项（展开 "Advanced"）：

   **添加环境变量**（点击 "Add Environment Variable"）：

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `DATABASE_URL` | （粘贴刚才复制的PostgreSQL连接字符串） |
   | `EXPO_PUBLIC_BACKEND_BASE_URL` | `https://marketing-backend.onrender.com` |

   注意：`DATABASE_URL` 的值就是第5步复制的连接字符串。

7. 点击 "Create Web Service"
8. 等待部署完成（约5-10分钟）
9. 部署过程中可以查看日志

---

### 第7步：测试后端

1. 在Render Dashboard点击服务名称 "marketing-backend"
2. 查看服务状态（应该显示 "Live"）
3. 复制访问URL（例如：`https://marketing-backend.onrender.com`）

4. 在终端测试：

   ```bash
   # 测试健康检查
   curl https://marketing-backend.onrender.com/api/v1/health

   # 应该返回：
   # {"status":"ok"}

   # 测试登录接口
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
     https://marketing-backend.onrender.com/api/v1/auth/verify
   ```

5. 如果返回成功，说明部署成功！

---

### 第8步：更新H5配置

#### 修改后端地址

1. 编辑 `dist/index.html`：
   ```bash
   nano /workspace/projects/client/dist/index.html
   ```

2. 找到第13行，修改为Render地址：
   ```html
   <script>
     window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://marketing-backend.onrender.com';
   </script>
   ```

3. 保存并退出（Ctrl+X, Y, Enter）

#### 重新打包

```bash
cd /workspace/projects/client
tar -czf dist.tar.gz dist
```

#### 上传到Netlify

1. 访问 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹到上传区域
3. 等待上传完成
4. 复制Netlify访问链接

---

### 第9步：测试完整功能

1. 在浏览器中打开Netlify提供的H5地址
2. 按F12打开开发者工具
3. 在Console中确认配置：
   ```
   === H5 Web App 初始化 ===
   后端地址已配置: https://marketing-backend.onrender.com
   ```
4. 测试登录功能
5. 测试其他功能

---

## ✅ 完成后你将拥有

- **后端地址**：`https://marketing-backend.onrender.com`（永久）
- **H5地址**：`https://your-app.netlify.app`（永久）
- **数据库**：PostgreSQL免费实例
- **状态**：✅ 完全在线，公网可访问

---

## ❌ 常见问题

### 问题1：推送GitHub失败

**错误**：`Permission denied (publickey)`

**解决**：
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 添加到GitHub：Settings → SSH and GPG keys → New SSH key
```

### 问题2：Render部署失败

**检查**：
1. Build Command和Start Command是否正确
2. 环境变量是否配置完整
3. DATABASE_URL是否正确
4. 查看部署日志

### 问题3：数据库连接失败

**检查**：
1. DATABASE_URL格式是否正确
2. 数据库是否创建成功
3. 查看Render日志中的错误信息

### 问题4：H5无法访问后端

**检查**：
1. 后端地址是否正确
2. 后端服务是否运行（状态为"Live"）
3. 浏览器Console是否有错误

---

## 📊 时间估算

| 步骤 | 预计时间 |
|------|----------|
| 创建GitHub仓库 | 2分钟 |
| 推送代码 | 1分钟 |
| 注册Render | 1分钟 |
| 创建PostgreSQL数据库 | 3分钟 |
| 创建Web服务 | 5-10分钟 |
| 测试后端 | 2分钟 |
| 更新H5配置 | 2分钟 |
| 测试完整功能 | 3分钟 |
| **总计** | **20-25分钟** |

---

## 🎯 快速检查清单

部署前检查：
- [ ] GitHub账号已创建
- [ ] 本地Git仓库已初始化
- [ ] 代码已提交

部署中检查：
- [ ] Render账号已注册
- [ ] PostgreSQL数据库已创建
- [ ] DATABASE_URL已获取
- [ ] Web服务已创建
- [ ] 环境变量已配置

部署后检查：
- [ ] 后端状态为"Live"
- [ ] 健康检查接口返回200
- [ ] 登录接口正常工作
- [ ] H5配置已更新
- [ ] 完整功能测试通过

---

## 💡 提示

1. **使用免费计划**：Render和Netlify都有免费计划，足够使用
2. **保存重要信息**：DATABASE_URL、GitHub仓库地址等
3. **查看日志**：遇到问题先查看Render日志
4. **耐心等待**：首次部署需要5-10分钟

---

## 🚀 开始部署

按照上述步骤操作，20-25分钟后你将拥有完全在线的H5应用！

需要帮助可以参考详细文档：
- Render部署指南：`/workspace/projects/BACKEND_DEPLOY_GUIDE.md`
- 渲染部署脚本：`bash /workspace/projects/scripts/deploy-to-render.sh`

**祝你部署顺利！** 🎉
