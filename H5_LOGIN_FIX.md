# 🔧 H5登录问题已修复

## ✅ 修复内容

1. **添加Web环境适配**
   - 添加了后端地址环境变量支持
   - 优化了AsyncStorage在Web环境下的使用

2. **修改了dist/index.html**
   - 添加了后端地址配置脚本
   - 默认配置为 `http://localhost:9091`

3. **重新打包**
   - 新的压缩包：`/workspace/projects/client/dist.tar.gz`
   - 包含所有修复

---

## 📥 重新下载步骤

### 1. 下载新的压缩包

在扣子文件管理器中找到并下载：
```
/workspace/projects/client/dist.tar.gz
```

### 2. 解压文件

解压后得到 `dist` 文件夹。

### 3. 配置后端地址

**重要！** 打开 `dist/index.html` 文件，找到第10-15行：

```html
<script>
  // 在这里配置后端API地址
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://localhost:9091';
</script>
```

将 `'http://localhost:9091'` 修改为你的实际后端地址。

**常见配置：**
- 本地开发：`http://localhost:9091`
- 局域网访问：`http://192.168.1.100:9091`（替换为你的IP）
- 生产服务器：`https://api.yourdomain.com`

### 4. 上传到Netlify

配置完成后，上传整个 `dist` 文件夹到：
```
https://app.netlify.com/drop
```

---

## 🧪 测试登录

部署完成后：

1. **打开应用**
   - 在浏览器中打开Netlify提供的访问链接

2. **打开开发者工具**
   - 按F12打开浏览器开发者工具
   - 切换到Console标签

3. **检查配置**
   - 输入：
     ```javascript
     console.log(window.__EXPO_PUBLIC_BACKEND_BASE_URL__);
     ```
   - 应该显示你配置的后端地址

4. **测试登录**
   - 输入店面编号、店面名称、密码
   - 点击登录按钮
   - 应该能正常登录

---

## 📖 详细配置指南

查看完整配置指南：
```
/workspace/projects/H5_CONFIG_GUIDE.md
```

---

## ❌ 常见问题

### Q: 点击登录没反应？

**检查步骤：**
1. 打开浏览器开发者工具（F12）
2. 查看Console标签是否有错误信息
3. 查看Network标签，点击登录按钮后是否有请求

### Q: 提示"网络错误"？

**可能原因：**
1. 后端地址配置错误
2. 后端服务未启动
3. 网络不通

**解决方法：**
```bash
# 检查后端服务是否运行
curl http://your-backend:9091/api/v1/health

# 应该返回：{"status":"ok"}
```

### Q: CORS跨域错误？

**如果后端和前端在不同域名，需要在后端配置CORS：**

在 `server/src/index.ts` 中确保有以下配置：

```typescript
app.use(cors({
  origin: '*', // 或者指定前端域名
  credentials: true
}));
```

---

## 🎯 快速检查清单

部署前检查：

- [ ] 已下载最新的 `dist.tar.gz`
- [ ] 已修改 `dist/index.html` 中的后端地址
- [ ] 后端服务正常运行：`curl http://your-backend:9091/api/v1/health`
- [ ] 网络可达（能访问后端地址）
- [ ] 浏览器控制台无错误

---

## 📞 获取帮助

如果还有问题，请提供：
1. 浏览器控制台的错误信息
2. Network标签中的请求详情
3. 配置的后端地址

---

## ✨ 修复总结

**问题原因：**
- Web环境下后端地址环境变量未配置
- 导致前端无法连接后端API

**解决方案：**
- 在HTML中添加后端地址配置脚本
- 支持用户自定义后端地址

**现在可以正常使用了！** 🎉

---

## 🚀 立即部署

1. 下载新的 `dist.tar.gz`（已包含修复）
2. 修改后端地址
3. 上传到Netlify
4. 开始使用！

祝您使用顺利！
