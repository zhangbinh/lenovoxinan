# 🚀 H5 Web App 部署指南（最终版）

## 📦 准备工作

### 1. 下载H5包

**文件位置**：`/workspace/projects/client/dist.tar.gz`

**文件大小**：2.9 MB

**下载方式**：
- 使用FileZilla、WinSCP等工具下载到本地
- 或者直接在服务器上下载

---

## 🌐 部署到Netlify

### 方法一：拖拽部署（最快）⭐

1. **访问Netlify**：https://app.netlify.com
2. **登录账号**
3. **进入"Sites"页面**
4. **将 `dist.tar.gz` 解压**
5. **拖拽 `dist` 文件夹到Netlify页面**
6. **等待上传完成**
7. **获得访问地址**：`https://xxx.netlify.app`

### 方法二：手动上传

1. **解压文件**：
   ```bash
   tar -xzf dist.tar.gz
   ```

2. **上传到Netlify**：
   - 访问：https://app.netlify.com
   - 点击 "Add new site" → "Deploy manually"
   - 选择 `dist` 文件夹
   - 点击 "Deploy site"

3. **访问H5应用**：
   - Netlify会提供一个访问地址
   - 例如：`https://lenovoxinan-app.netlify.app`

---

## ✅ 部署后测试

### 1. 访问H5应用

打开浏览器访问Netlify提供的地址，应该能看到：
- ✅ 登录页面
- ✅ 用户名输入框
- ✅ 授权码输入框
- ✅ 登录按钮

### 2. 测试登录功能

使用测试账号登录：
- **门店编号**：`test`
- **门店名称**：`test`
- **授权码**：`test`

**预期结果**：
- ✅ 如果授权码正确：跳转到首页
- ✅ 如果授权码错误：显示错误提示

---

## 🔍 调试信息

### 查看浏览器控制台

**打开浏览器控制台**（F12），查看日志：

```
=== H5 Web App 初始化 ===
后端地址已配置: https://marketing-backend-cu2q.onrender.com
```

**确保后端地址显示为：**
```
https://marketing-backend-cu2q.onrender.com
```

---

## 🌐 配置信息

### 后端服务地址

**Render服务地址**：
```
https://marketing-backend-cu2q.onrender.com
```

### 测试接口

**健康检查**：
```bash
curl https://marketing-backend-cu2q.onrender.com/api/v1/health
```

**预期返回**：
```json
{
  "status": "ok",
  "timestamp": "2026-04-23T09:38:32.425Z"
}
```

**登录验证**：
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
  https://marketing-backend-cu2q.onrender.com/api/v1/auth/verify
```

**预期返回**：
```json
{
  "success": true,
  "valid": false,
  "message": "授权码错误"
}
```

---

## 📱 支持的平台

✅ **iPhone / iPad**（iOS Safari）
✅ **Android**（Chrome / Firefox）
✅ **PC浏览器**（Chrome / Firefox / Safari / Edge）

---

## 🔧 故障排查

### 问题1：登录无响应

**检查清单**：
1. ✅ 浏览器控制台是否有错误
2. ✅ 后端地址是否正确：`https://marketing-backend-cu2q.onrender.com`
3. ✅ 网络是否可以访问后端服务

**测试后端连接**：
```bash
curl https://marketing-backend-cu2q.onrender.com/api/v1/health
```

### 问题2：页面空白

**检查清单**：
1. ✅ JavaScript是否启用
2. ✅ 浏览器是否支持ES6+
3. ✅ 查看控制台是否有错误

### 问题3：部署后仍使用旧地址

**解决方法**：
1. 确认下载的是最新的 `dist.tar.gz`（2.9 MB）
2. 确认解压后的 `index.html` 中后端地址正确
3. 清除Netlify缓存，重新部署

---

## 📊 部署架构图

```
用户浏览器
    ↓
Netlify (H5静态托管)
    ↓ (API调用)
Render (后端服务)
    ↓ (数据查询)
PostgreSQL (数据库)
```

---

## 🎯 快速部署清单

- [ ] 下载 `dist.tar.gz`（2.9 MB）
- [ ] 解压文件
- [ ] 登录Netlify
- [ ] 上传 `dist` 文件夹
- [ ] 获取访问地址
- [ ] 测试登录功能
- [ ] 分享给用户

---

## 📞 获取帮助

如果遇到问题，提供以下信息：

1. **访问地址**：Netlify提供的URL
2. **错误信息**：浏览器控制台的错误日志
3. **测试结果**：后端接口测试结果

---

## 🎉 完成！

部署完成后，你将拥有：

✅ **跨平台H5应用**：支持iPhone、Android、PC
✅ **稳定后端服务**：Render托管，24/7在线
✅ **安全数据库**：PostgreSQL，数据持久化
✅ **用户友好**：无需下载App，扫码即用

---

**现在开始部署吧！** 🚀
