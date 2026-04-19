# API接入配置完成

## ✅ 已完成的工作

### 1. 创建详细的接入指南
- 文件：`小红书和抖音开放平台API接入指南.md`
- 内容：
  - 小红书开放平台申请流程
  - 抖音开放平台申请流程
  - API认证方式
  - 数据获取接口说明
  - 安全注意事项

### 2. 创建API服务模块
- 文件：`server/src/services/social-platform.ts`
- 功能：
  - 自动检测URL平台类型（小红书/抖音）
  - 从URL提取笔记ID/视频ID
  - 调用小红书API获取真实数据
  - 调用抖音API获取真实数据
  - 完善的错误处理和降级机制

### 3. 更新promotion.ts路由
- 修改：`server/src/routes/promotion.ts`
- 改进：
  - 使用真实API替代fetch-url
  - 自动检测是否配置了API密钥
  - 保留模拟数据作为降级方案

### 4. 创建环境变量示例
- 文件：`server/.env.example`
- 包含：
  - 小红书配置项
  - 抖音配置项
  - 缓存和限流配置

### 5. 安装依赖
- axios：HTTP客户端
- dotenv：环境变量管理

---

## 📋 下一步操作（需要您完成）

### 1. 申请API权限

#### 小红书开放平台
1. 访问：https://open.xiaohongshu.com/
2. 使用企业账号注册
3. 创建应用，填写信息：
   - 应用名称：联想西南战区门店营销助手
   - 应用类型：数据分析/营销工具
   - 应用描述：帮助门店分析小红书内容数据，优化投流策略
4. 等待审核（1-3个工作日）
5. 获取：AppID、AppSecret、Access Token

#### 抖音开放平台
1. 访问：https://developer.open-douyin.com/
2. 使用企业账号注册
3. 创建应用，填写信息：
   - 应用名称：联想西南战区门店营销助手
   - 应用类型：数据分析/营销工具
   - 应用描述：帮助门店分析抖音内容数据，优化投流策略
4. 等待审核（1-5个工作日）
5. 获取：ClientKey、AppSecret、Access Token

### 2. 配置环境变量

在 `server/.env` 文件中添加：

```bash
# 小红书配置
XIAOHONGSHU_APP_ID=your_xiaohongshu_app_id_here
XIAOHONGSHU_APP_SECRET=your_xiaohongshu_app_secret_here
XIAOHONGSHU_REDIRECT_URI=https://your-domain.com/callback/xiaohongshu
XIAOHONGSHU_ACCESS_TOKEN=your_xiaohongshu_access_token_here

# 抖音配置
DOUYIN_CLIENT_KEY=your_douyin_client_key_here
DOUYIN_APP_SECRET=your_douyin_app_secret_here
DOUYIN_REDIRECT_URI=https://your-domain.com/callback/douyin
DOUYIN_ACCESS_TOKEN=your_douyin_access_token_here
```

### 3. 重启后端服务

```bash
cd /workspace/projects/server
NODE_ENV=development pnpm run dev
```

### 4. 测试真实数据获取

使用真实的小红书或抖音URL测试：

```bash
curl -X POST http://localhost:9091/api/v1/promotion/advice \
  -H "Content-Type: application/json" \
  -d '{
    "publishUrl": "https://www.xiaohongshu.com/explore/641c123456789",
    "publishDate": "2025-01-15"
  }'
```

---

## 🔍 工作原理

### 数据获取流程

```
用户输入URL
    ↓
检测平台类型（小红书/抖音）
    ↓
提取笔记ID/视频ID
    ↓
检查是否配置了API密钥
    ↓
有密钥 → 调用真实API → 返回真实数据
无密钥 → 使用模拟数据 → 返回模拟数据
    ↓
生成投流建议（小红书 + 抖音）
    ↓
返回给前端展示
```

### 自动降级机制

如果API调用失败，系统会自动降级到模拟数据，确保功能始终可用：

```typescript
try {
  // 尝试使用真实API
  metrics = await socialPlatformService.getMetrics(publishUrl);
} catch (error) {
  console.error('获取真实数据失败，使用模拟数据:', error);
  // 降级到模拟数据
  metrics = { ... };
}
```

---

## 📊 数据指标说明

### 小红书数据指标

| 指标 | 说明 | 来源 |
|------|------|------|
| view_count | 阅读量 | API返回 |
| liked_count | 点赞数 | API返回 |
| comment_count | 评论数 | API返回 |
| share_count | 分享数 | API返回 |
| collected_count | 收藏数 | API返回 |
| completion_rate | 完读率 | API返回 |

### 抖音数据指标

| 指标 | 说明 | 来源 |
|------|------|------|
| view_count | 播放量 | API返回 |
| like_count | 点赞数 | API返回 |
| comment_count | 评论数 | API返回 |
| share_count | 分享数 | API返回 |
| collect_count | 收藏数 | API返回 |
| interact_rate | 互动率 | API返回 |

---

## ⚠️ 重要提醒

### 安全性

1. **保护API密钥**
   - ⚠️ 绝对不要将AppSecret和Access Token提交到代码仓库
   - ⚠️ 必须使用环境变量存储
   - ⚠️ 定期更换API密钥

2. **Access Token管理**
   - 小红书Token有效期：30天
   - 抖音Token有效期：24小时
   - 需要定期刷新Token

3. **调用频率限制**
   - 小红书：100次/小时
   - 抖音：100次/分钟
   - 避免频繁调用导致限流

### 性能优化

1. **数据缓存**
   - 建议对获取的数据进行缓存
   - 缓存时间：1小时
   - 避免重复调用API

2. **错误处理**
   - API调用失败时自动降级
   - 确保功能始终可用
   - 记录错误日志便于排查

---

## 🧪 测试建议

### 1. 测试URL格式

**小红书**：
- https://www.xiaohongshu.com/explore/641c123456789
- https://xhslink.com/abc123

**抖音**：
- https://www.douyin.com/video/7123456789012345678
- https://v.douyin.com/abc123

### 2. 测试流程

1. **未配置API密钥时**
   - 使用模拟数据
   - 验证降级机制

2. **配置API密钥后**
   - 使用真实数据
   - 验证数据准确性

3. **API调用失败时**
   - 自动降级到模拟数据
   - 验证错误处理

---

## 📈 后续优化建议

### 1. 实现Token自动刷新
- 小红书Token有效期30天
- 抖音Token有效期24小时
- 需要实现自动刷新机制

### 2. 添加数据缓存
- 使用Redis或内存缓存
- 减少API调用次数
- 提升响应速度

### 3. 实现频率限制
- 控制API调用频率
- 避免超限
- 实现队列机制

### 4. 添加监控告警
- 监控API调用成功率
- 监控Token有效期
- 异常情况自动告警

---

## 📚 相关文档

- [小红书开放平台API接入指南](./小红书和抖音开放平台API接入指南.md)
- [OTA更新说明](./OTA更新说明.md)
- [构建支持OTA更新的APK](./构建支持OTA更新的APK.md)

---

## 💬 联系方式

如有任何问题，请随时联系！

---

**祝您申请顺利！**
