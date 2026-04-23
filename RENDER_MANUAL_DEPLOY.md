# 🔧 Render手动重新部署指南

## 步骤1：访问Render Dashboard

1. 访问：https://dashboard.render.com
2. 使用你的GitHub账号（zhangbinh）登录（如果还没有登录）

---

## 步骤2：找到marketing-backend服务

1. 在Dashboard中，你会看到所有服务列表
2. 找到名为 "marketing-backend" 的服务
3. 点击进入服务详情页

---

## 步骤3：手动触发部署

### 方法A：手动部署（清除缓存）⭐ 推荐

1. 在服务详情页右上角，点击 "Manual Deploy" 按钮
2. 选择 "Clear build cache & deploy"
3. 点击 "Confirm"
4. 等待5-10分钟

### 方法B：推送空提交

如果你有git访问权限，也可以：

```bash
cd /workspace/projects
git commit --allow-empty -m "触发Render重新部署"
git push origin main
```

---

## 步骤4：查看部署进度

### 在Dashboard中：

1. 进入 "marketing-backend" 服务详情页
2. 点击 "Events" 标签
3. 查看最新的部署事件
4. 状态应该是 "In progress" 或 "Live"

### 部署状态说明：

| 状态 | 含义 |
|------|------|
| In progress | 正在部署中 |
| Build succeeded | 构建成功 |
| Deploy succeeded | 部署成功 |
| Live | 服务正在运行 |
| Build failed | 构建失败 |
| Deploy failed | 部署失败 |

---

## 步骤5：查看部署日志

### 如果部署失败或想查看详细信息：

1. 在服务详情页点击 "Logs" 标签
2. 查看实时日志
3. 查找错误信息（红色文字）

---

## 步骤6：测试服务

### 部署成功后（状态为"Live"），在终端测试：

```bash
# 测试根路径
curl https://marketing-backend.onrender.com/

# 应该返回（而不是 "hello there"）：
# {
#   "message": "西南战区营销API服务",
#   "version": "1.0.0",
#   "status": "running",
#   "timestamp": "2025-01-21T..."
# }

# 测试健康检查
curl https://marketing-backend.onrender.com/api/v1/health

# 应该返回：
# {
#   "status": "ok",
#   "timestamp": "2025-01-21T..."
# }

# 测试登录接口
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
  https://marketing-backend.onrender.com/api/v1/auth/verify
```

---

## ✅ 部署成功的标志

1. **Dashboard状态**：服务显示 "Live"
2. **根路径测试**：返回JSON响应（不是"hello there"）
3. **健康检查**：`{"status":"ok","timestamp":"..."}`

---

## ❌ 如果部署失败

### 查看日志：

1. 点击 "Logs" 标签
2. 查找错误信息
3. 常见错误：

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `ERR_MODULE_NOT_FOUND: esbuild` | esbuild未安装 | ✅ 已修复 |
| `Cannot find module` | 依赖未安装 | 检查package.json |
| `ECONNREFUSED` | 数据库连接失败 | 检查DATABASE_URL |
| `timeout` | 构建超时 | 等待更长时间或优化构建 |

### 常见错误排查：

1. **esbuild错误**
   - ✅ 已修复，应该不会再出现

2. **依赖安装失败**
   - 查看pnpm install日志
   - 确保所有依赖都在package.json中

3. **数据库连接失败**
   - 检查DATABASE_URL环境变量
   - 确认数据库正在运行

4. **构建超时**
   - Free计划限制15分钟
   - 如果超时，检查是否有死循环或大型依赖

---

## 📊 预期部署时间

| 阶段 | 预计时间 |
|------|----------|
| 检测代码更改 | 1-2分钟 |
| 安装依赖（pnpm install） | 3-5分钟 |
| 构建代码（esbuild） | 1-2分钟 |
| 启动服务 | 1-2分钟 |
| 健康检查 | 1分钟 |
| **总计** | **7-12分钟** |

---

## 💡 提示

1. **耐心等待**：首次成功部署需要7-12分钟
2. **查看日志**：如果部署时间过长，查看日志是否有错误
3. **清除缓存**：如果有问题，再次点击 "Clear build cache & deploy"
4. **保存日志**：如果部署失败，保存错误日志以便排查

---

## 🎯 完成后

部署成功后，告诉我，我会帮你：

1. ✅ 测试所有接口
2. ✅ 更新H5配置为Render地址
3. ✅ 重新打包H5
4. ✅ 部署到Netlify

---

## 📞 需要帮助？

如果遇到问题，提供以下信息：

1. **部署状态**：Build succeeded / Build failed
2. **错误日志**：Logs标签中的错误信息
3. **部署时间**：已经等待了多久

---

**现在就去Render Dashboard手动触发部署吧！** 🚀

访问：https://dashboard.render.com
