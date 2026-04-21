# 🔍 H5登录问题调试指南

## 📋 问题排查步骤

### 第1步：检查浏览器控制台

1. **打开浏览器开发者工具**
   - Windows/Linux: 按 `F12` 或 `Ctrl+Shift+I`
   - Mac: 按 `Cmd+Option+I`

2. **切换到Console标签**

3. **查看是否有错误信息**
   - 红色文字表示错误
   - 黄色文字表示警告
   - 查找关键词：`error`, `failed`, `undefined`

---

### 第2步：测试登录按钮点击

1. **点击登录按钮**

2. **查看Console是否输出**
   - 应该看到：`=== 开始登录流程 ===`
   - 如果没有输出，说明点击事件未触发

3. **检查是否有JavaScript错误**
   - 如果有错误，通常会阻止后续代码执行

---

### 第3步：检查后端地址配置

1. **在Console中输入以下命令检查配置：**
   ```javascript
   console.log(window.__EXPO_PUBLIC_BACKEND_BASE_URL__);
   ```

2. **应该显示：**
   - `http://localhost:9091` 或你配置的后端地址
   - 如果显示 `undefined`，说明配置未生效

---

### 第4步：测试后端连接

1. **在Console中输入以下命令测试后端：**
   ```javascript
   fetch('http://localhost:9091/api/v1/health')
     .then(r => r.json())
     .then(d => console.log('后端健康检查:', d))
     .catch(e => console.error('后端连接失败:', e));
   ```

2. **应该显示：**
   ```
   后端健康检查: {status: "ok"}
   ```

3. **如果显示错误：**
   - 检查后端服务是否运行
   - 检查后端地址是否正确
   - 检查是否有网络/CORS问题

---

### 第5步：查看网络请求

1. **切换到Network标签**

2. **点击登录按钮**

3. **查找 `/api/v1/auth/verify` 请求**
   - 红色表示请求失败
   - 黄色表示重定向
   - 绿色表示成功

4. **点击该请求查看详情**
   - **Headers**: 查看请求URL和方法
   - **Payload**: 查看请求体数据
   - **Response**: 查看服务器响应
   - **Preview**: 查看响应内容

---

### 第6步：查看完整的登录日志

在Console中应该看到以下日志顺序：

```
=== H5 Web App 初始化 ===
后端地址已配置: http://localhost:9091
=== 开始登录流程 ===
输入 - 店面编号: xxx
输入 - 店面名称: xxx
输入 - 登录密码: ***
验证通过，开始登录请求...
=== AuthContext.login 开始 ===
参数 - storeId: xxx
参数 - storeName: xxx
参数 - authCode: ***
环境变量 EXPO_PUBLIC_BACKEND_BASE_URL: undefined
Platform.OS: web
从 window.__EXPO_PUBLIC_BACKEND_BASE_URL__ 获取: http://localhost:9091
最终使用后端URL: http://localhost:9091
请求URL: http://localhost:9091/api/v1/auth/verify
响应状态: 200 OK
登录响应数据: {success: true, valid: true, message: "..."}
登录成功，保存到本地存储
=== AuthContext.login 成功 ===
登录结果: true
```

---

## 🔧 常见问题及解决方案

### 问题1：点击登录按钮没有任何反应

**可能原因：**
- JavaScript错误阻止了事件处理
- 按钮被其他元素遮挡
- TouchableOpacity在Web下不兼容

**解决方案：**

1. 检查Console是否有红色错误
2. 尝试强制刷新页面（`Ctrl+F5` 或 `Cmd+Shift+R`）
3. 清除浏览器缓存
4. 尝试使用Chrome浏览器

---

### 问题2：点击后按钮文字变为"登录中..."，但没有响应

**可能原因：**
- 后端请求超时
- 后端服务未启动
- 网络连接问题
- CORS跨域问题

**解决方案：**

1. 检查后端服务是否运行：
   ```bash
   curl http://localhost:9091/api/v1/health
   ```

2. 检查Network标签中的请求状态

3. 查看后端日志：
   ```bash
   tail -n 50 /app/work/logs/bypass/app.log
   ```

4. 检查CORS配置（如果前后端不同域）

---

### 问题3：提示"店面编号、店面名称或登录密码错误"

**可能原因：**
- 输入的凭据错误
- 后端验证逻辑问题

**解决方案：**

1. 确认输入的数据正确
2. 检查Network标签中的请求Payload
3. 查看后端日志确认验证逻辑

---

### 问题4：提示"网络错误，请重试"

**可能原因：**
- fetch请求失败
- 后端服务未响应
- 网络连接问题

**解决方案：**

1. 检查后端服务是否运行
2. 检查后端地址配置是否正确
3. 查看Console中的详细错误信息
4. 检查Network标签中的请求详情

---

### 问题5：后端地址配置不生效

**可能原因：**
- HTML文件未正确修改
- 浏览器缓存了旧版本

**解决方案：**

1. 重新下载最新的 `dist.tar.gz`
2. 重新修改 `dist/index.html` 中的后端地址
3. 强制刷新浏览器（`Ctrl+F5`）
4. 清除浏览器缓存

---

## 📝 提供调试信息

如果问题仍未解决，请提供以下信息：

### 1. 浏览器Console截图或文本
- 查看Console标签
- 选择所有日志（Ctrl+A）
- 复制（Ctrl+C）
- 粘贴到问题描述中

### 2. Network请求详情
- 切换到Network标签
- 点击 `/api/v1/auth/verify` 请求
- 截图或复制请求详情
- 包括：Headers、Payload、Response

### 3. 配置信息
```javascript
// 在Console中运行，复制输出结果
console.log('Platform:', window.navigator.platform);
console.log('Backend URL:', window.__EXPO_PUBLIC_BACKEND_BASE_URL__);
console.log('User Agent:', navigator.userAgent);
```

### 4. 测试账号信息
- 使用的店面编号、店面名称、密码
- （注意：密码可以部分隐藏）

---

## 🎯 快速修复检查清单

- [ ] 已下载最新的 `dist.tar.gz`
- [ ] 已修改 `dist/index.html` 中的后端地址
- [ ] 后端服务正在运行：`curl http://localhost:9091/api/v1/health`
- [ ] 浏览器Console无红色错误
- [ ] 点击登录按钮有Console输出
- [ ] Network中有 `/api/v1/auth/verify` 请求
- [ ] 后端地址配置正确：`console.log(window.__EXPO_PUBLIC_BACKEND_BASE_URL__)`

---

## 💡 提示

1. **使用Chrome浏览器** - 兼容性最好，调试工具最完善
2. **强制刷新** - `Ctrl+F5` 清除缓存
3. **清除浏览器缓存** - 如果怀疑缓存问题
4. **查看完整日志** - Console中应该有完整的登录流程日志
5. **检查网络请求** - Network标签可以看到所有HTTP请求

---

## 📞 获取帮助

如果以上步骤都无法解决问题，请提供：

1. 浏览器Console的完整日志
2. Network标签中 `/api/v1/auth/verify` 请求的详情
3. 浏览器类型和版本
4. 操作系统类型和版本
5. 后端地址配置
6. 测试账号信息

这些信息将帮助快速定位和解决问题！
