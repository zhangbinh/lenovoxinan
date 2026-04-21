# 🚀 主后端快速公网访问方案（ngrok）

## ✅ 两种方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **ngrok（临时）** | ⚡ 立即可用<br>💰 完全免费<br>🔧 配置简单 | ⚠️ 地址会变<br>⚠️ 临时访问 | 快速测试H5 |
| **Render（永久）** | ✅ 永久地址<br>✅ 自动HTTPS<br>✅ 云端运行 | 🕐 需要5-10分钟<br>📋 需要GitHub | 生产环境 |

---

## 🎯 方案1：ngrok临时访问（推荐用于测试）

### 什么是ngrok？

ngrok是一个反向代理工具，可以让本地的服务通过公网访问。

### 步骤：

#### 第1步：安装ngrok

```bash
# 下载ngrok（Linux）
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && \
sudo apt update && sudo apt install ngrok

# 或者直接下载二进制文件
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvf ngrok-v3-stable-linux-amd64.tgz
```

#### 第2步：认证ngrok

1. 访问 https://ngrok.com 注册账号（免费）
2. 复制Authtoken
3. 认证：
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

#### 第3步：启动ngrok

```bash
# 启动ngrok，映射主后端端口9091
ngrok http 9091
```

#### 第4步：获取公网地址

ngrok启动后会显示：
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:9091
```

**复制这个地址**：`https://abc123.ngrok-free.app`

#### 第5步：测试后端

```bash
# 测试健康检查
curl https://abc123.ngrok-free.app/api/v1/health

# 测试登录验证
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
  https://abc123.ngrok-free.app/api/v1/auth/verify
```

#### 第6步：配置H5应用

1. 下载 `dist.tar.gz`
2. 解压后打开 `dist/index.html`
3. 修改后端地址：

```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://abc123.ngrok-free.app';
</script>
```

4. 保存
5. 上传到Netlify

#### 第7步：测试H5应用

1. 打开Netlify提供的H5地址
2. 尝试登录功能
3. 应该可以正常工作！

---

## 🚀 方案2：Render永久部署

详见完整指南：`/workspace/projects/BACKEND_DEPLOY_GUIDE.md`

**简要步骤：**
1. 推送代码到GitHub
2. 在Render创建PostgreSQL数据库
3. 在Render创建Web服务
4. 配置环境变量
5. 等待部署完成
6. 修改H5配置

---

## 💡 我的建议

### 推荐使用ngrok进行测试

**原因：**
- ✅ 立即可用（1分钟内）
- ✅ 完全免费
- ✅ 无需GitHub
- ✅ 配置简单

**测试通过后，再考虑部署到Render**

---

## 📋 完整测试流程（ngrok）

### 1. 启动ngrok

```bash
ngrok http 9091
```

### 2. 复制公网地址

例如：`https://abc123.ngrok-free.app`

### 3. 修改H5配置

编辑 `dist/index.html`：
```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://abc123.ngrok-free.app';
</script>
```

### 4. 上传到Netlify

拖拽 `dist` 文件夹到 https://app.netlify.com/drop

### 5. 测试H5应用

打开Netlify提供的H5地址，测试登录功能。

### 6. 确认正常工作

✅ 如果一切正常，说明H5应用和后端连接成功！

---

## ⚠️ ngrok注意事项

1. **地址会变**：每次重启ngrok，地址都会变化
2. **临时使用**：适合测试，不适合生产
3. **免费限制**：免费版有一些限制，但测试够用
4. **连接数限制**：免费版同时连接数有限

---

## 🎯 总结

### 快速测试（推荐）
```bash
# 1. 启动ngrok
ngrok http 9091

# 2. 复制地址，修改H5配置
# 3. 上传到Netlify
# 4. 测试
```

### 生产部署
参考 `/workspace/projects/BACKEND_DEPLOY_GUIDE.md` 部署到Render。

---

**现在就试试ngrok吧！1分钟内就能让H5应用公网访问！** 🚀
