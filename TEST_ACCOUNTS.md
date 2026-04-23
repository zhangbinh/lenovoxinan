# 🧪 测试账号说明

## 正确的登录信息

### 测试账号

| 字段 | 值 |
|------|-----|
| **店面编号** | `test` |
| **店面名称** | `test` |
| **登录密码** | `test` 或 `lenovoxinan` |

---

## 🔑 授权码说明

后端支持的授权码：
- ✅ `test` - 测试用授权码
- ✅ `lenovoxinan` - 正式授权码

---

## 🚀 测试步骤

1. **访问H5应用**
   - 打开浏览器访问Netlify提供的地址

2. **填写登录信息**
   - 店面编号：`test`
   - 店面名称：`test`
   - 登录密码：`test`

3. **点击登录**
   - 点击"登录系统"按钮
   - 等待登录验证

4. **预期结果**
   - ✅ 弹出"登录成功"提示
   - ✅ 点击"确定"后跳转到首页
   - ✅ 可以正常使用所有功能

---

## 🔍 调试信息

### 查看浏览器控制台

打开浏览器控制台（F12），查看日志：

**成功登录的日志示例**：
```
=== 开始登录流程 ===
输入 - 店面编号: test
输入 - 店面名称: test
输入 - 登录密码: ***
验证通过，开始登录请求...
后端URL: https://marketing-backend-cu2q.onrender.com
请求URL: https://marketing-backend-cu2q.onrender.com/api/v1/auth/verify
响应状态: 200 OK
登录响应数据: { success: true, valid: true, message: '授权验证成功' }
登录成功，保存到本地存储
=== AuthContext.login 成功 ===
登录结果: true
用户点击确定，跳转到首页
```

**授权码错误的日志示例**：
```
登录响应数据: { success: true, valid: false, message: '授权码错误' }
登录失败：凭据错误
```

---

## ❌ 常见错误

### 1. "店面编号、店面名称或登录密码错误"

**原因**：授权码不正确

**解决**：
- 确认授权码是 `test` 或 `lenovoxinan`
- 检查输入是否有空格
- 尝试使用另一个授权码

### 2. "网络错误，请重试"

**原因**：后端服务无法访问

**解决**：
- 检查网络连接
- 查看浏览器控制台是否有网络错误
- 测试后端服务：`curl https://marketing-backend-cu2q.onrender.com/api/v1/health`

### 3. 点击登录无反应

**原因**：可能是前端代码未更新

**解决**：
- 确认已部署最新的H5版本
- 清除浏览器缓存
- 查看浏览器控制台是否有JavaScript错误

---

## 🔧 后端状态

### 检查后端服务

```bash
# 健康检查
curl https://marketing-backend-cu2q.onrender.com/api/v1/health

# 预期返回
# { "status": "ok", "timestamp": "..." }

# 测试登录接口
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"storeId":"test","storeName":"test","authCode":"test"}' \
  https://marketing-backend-cu2q.onrender.com/api/v1/auth/verify

# 预期返回
# { "success": true, "valid": true, "message": "授权验证成功" }
```

---

## 📊 后端部署状态

- **最新提交**：`99c25f7`
- **修改内容**：添加 `test` 授权码支持
- **部署状态**：等待Render自动部署
- **预计时间**：5-10分钟

---

## ✅ 验证清单

部署完成后，请验证：

- [ ] 后端服务正常（访问 health 接口）
- [ ] 测试账号可以登录
- [ ] 登录后跳转到首页
- [ ] 可以正常使用所有功能

---

## 💡 提示

- **授权码区分大小写**：`Test` 和 `test` 是不同的
- **不要使用空格**：确保输入框没有多余的空格
- **浏览器缓存**：如果遇到问题，尝试清除缓存后重试

---

**现在可以使用 `test` 作为授权码登录了！** 🚀
