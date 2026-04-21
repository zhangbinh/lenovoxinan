# H5 Web App 配置指南

## 🔑 重要：配置后端API地址

部署到Netlify后，**必须配置后端API地址**，否则登录和所有API调用都会失败。

---

## ⚙️ 配置方法

### 方法1：修改HTML文件（推荐）

#### 步骤：

1. **下载dist文件夹**
   - 从扣子下载 `dist.tar.gz`
   - 解压得到 `dist` 文件夹

2. **修改index.html**
   - 打开 `dist/index.html` 文件（使用文本编辑器）
   - 找到第10-15行的环境变量配置：

   ```html
   <script>
     // 在这里配置后端API地址
     window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://localhost:9091';
   </script>
   ```

3. **修改后端地址**
   - 将 `'http://localhost:9091'` 改为你的实际后端地址
   - 例如：
     - 本地开发：`http://localhost:9091`
     - 生产环境：`https://your-backend-domain.com`
     - 内网地址：`http://192.168.1.100:9091`

4. **保存并上传**
   - 保存 `index.html`
   - 上传整个 `dist` 文件夹到Netlify

---

### 方法2：Netlify环境变量（推荐用于生产环境）

#### 步骤：

1. **部署到Netlify**
   - 先按照正常流程部署（拖拽dist文件夹）

2. **进入项目设置**
   - 登录Netlify
   - 选择你的项目
   - 点击"Site settings"

3. **添加环境变量**
   - 在左侧菜单找到"Environment variables"
   - 点击"Add a variable"
   - 添加以下变量：

   ```
   Key: EXPO_PUBLIC_BACKEND_BASE_URL
   Value: http://your-backend-domain.com:9091
   ```

4. **保存并重新部署**
   - 点击"Save"
   - Netlify会自动重新部署

---

## 📋 常见后端地址配置

### 场景1：本地开发测试

```html
window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://localhost:9091';
```

### 场景2：本地网络访问（同一局域网）

```html
window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://192.168.1.100:9091';
```
（将192.168.1.100替换为你的电脑局域网IP）

### 场景3：生产服务器（域名）

```html
window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://api.yourdomain.com';
```

### 场景4：生产服务器（IP）

```html
window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://123.45.67.89:9091';
```

---

## 🧪 测试配置是否正确

配置完成后，可以通过以下方式测试：

### 方法1：浏览器控制台

1. 在浏览器中打开应用
2. 按F12打开开发者工具
3. 切换到Console标签
4. 输入：

```javascript
console.log(window.__EXPO_PUBLIC_BACKEND_BASE_URL__);
```

5. 应该显示你配置的后端地址

### 方法2：查看网络请求

1. 打开浏览器开发者工具（F12）
2. 切换到Network标签
3. 点击登录按钮
4. 查看是否有对 `/api/v1/auth/verify` 的请求
5. 点击该请求，查看请求URL是否正确

---

## ❌ 常见问题

### Q: 登录时点击没反应？

**A:** 可能的原因：
1. 后端地址配置错误
2. 后端服务未启动
3. 网络不通（CORS问题）

**解决方法：**
- 检查浏览器控制台是否有错误
- 确认后端服务正常运行：`curl http://your-backend:9091/api/v1/health`
- 检查后端地址配置是否正确

### Q: 提示"网络错误"？

**A:** 检查：
1. 后端地址是否正确
2. 后端服务是否运行
3. 浏览器控制台是否有CORS错误

### Q: 后端地址配置后不生效？

**A:**
- 方法1：清除浏览器缓存（Ctrl+Shift+Delete）
- 方法2：强制刷新页面（Ctrl+F5）
- 方法3：在Netlify中触发重新部署

---

## 🔍 如何获取后端地址

### 在服务器上运行后端时

```bash
# 查看环境变量
echo $EXPO_PUBLIC_BACKEND_BASE_URL

# 或者查看后端服务的监听端口
netstat -tlnp | grep 9091
```

### 本地开发环境

默认为：`http://localhost:9091`

---

## 💡 最佳实践

1. **开发环境**：使用 `http://localhost:9091`
2. **测试环境**：使用测试服务器地址
3. **生产环境**：使用HTTPS域名
4. **修改配置后**：强制刷新浏览器缓存

---

## 📝 配置示例

### 示例1：本地开发

```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://localhost:9091';
</script>
```

### 示例2：公司内网服务器

```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'http://10.0.0.100:9091';
</script>
```

### 示例3：公网服务器（HTTPS）

```html
<script>
  window.__EXPO_PUBLIC_BACKEND_BASE_URL__ = 'https://api.example.com';
</script>
```

---

## ✅ 配置检查清单

部署前检查：

- [ ] 已修改 `dist/index.html` 中的后端地址
- [ ] 后端服务正常运行
- [ ] 后端端口正确（默认9091）
- [ ] 网络可达（能ping通后端地址）
- [ ] 浏览器控制台无错误

---

## 🎯 总结

**重要步骤：**

1. 下载并解压 `dist.tar.gz`
2. 修改 `dist/index.html` 中的后端地址
3. 上传到Netlify
4. 在浏览器中测试登录功能

**完成后，所有平台（iPhone、Android、PC）都可以正常使用！**
