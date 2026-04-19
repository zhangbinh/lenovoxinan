# OTA热更新功能说明

## 什么是OTA热更新？

OTA（Over-The-Air）热更新允许您在不重新下载APP的情况下，自动推送代码更新到用户的设备。

## 更新类型

### 1. OTA更新（推荐）
- ✅ **适用范围**：JavaScript代码修改、UI调整、业务逻辑修改
- ✅ **更新方式**：自动推送，用户无需操作
- ✅ **更新时间**：几秒钟到几分钟
- ✅ **用户感知**：APP自动更新，可能需要重启

**示例**：
- 修改登录页面布局
- 调整热榜功能
- 优化投流建议显示
- 修复Bug

### 2. 应用商店更新
- ⚠️ **适用范围**：原生依赖变更、权限修改、大版本升级
- ⚠️ **更新方式**：用户需从应用商店下载新版本
- ⚠️ **更新时间**：取决于应用商店审核和用户下载
- ⚠️ **用户感知**：需要手动更新APP

**示例**：
- 添加新的原生功能（如相机、相册权限）
- 修改应用图标
- 升级React Native版本
- 修改包名或签名

## 如何使用OTA更新？

### 开发环境测试
```bash
cd client
npx expo start
```

### 构建预览版（支持OTA更新）
```bash
cd client
npm run eas:build:preview
```

### 构建生产版（支持OTA更新）
```bash
cd client
npm run eas:build:production
```

### 推送OTA更新
```bash
cd client
npm run eas:update
```

## 更新配置说明

当前配置在`client/app.config.ts`中：

```typescript
"updates": {
  "url": "https://u.expo.dev",
  "enabled": true,
  "checkAutomatically": "ON_ERROR_RECOVERY",
  "fallbackToCacheTimeout": 0
}
```

- `enabled`: true - 启用OTA更新
- `checkAutomatically`: "ON_ERROR_RECOVERY" - 仅在出错时自动检查更新
- `fallbackToCacheTimeout`: 0 - 立即使用缓存的更新

## 用户体验

### 更新过程
1. 用户打开APP
2. APP后台自动检查更新（无需用户操作）
3. 如果有新版本，自动下载
4. 下载完成后，下次启动APP时自动应用更新

### 更新提示（可选）
如果需要在更新时提示用户，可以在代码中添加：
```typescript
import * as Updates from 'expo-updates';

async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log('更新检查失败:', error);
  }
}
```

## 注意事项

### ✅ OTA更新支持
- JavaScript代码修改
- UI组件修改
- 业务逻辑调整
- 样式修改
- Bug修复

### ❌ OTA更新不支持
- 添加新的原生依赖
- 修改原生配置
- 修改应用图标和启动页
- 修改应用权限
- 修改包名和签名

## 常见问题

### Q: OTA更新会丢失用户数据吗？
A: 不会。OTA更新只更新代码，不会影响本地存储的数据（如登录状态、缓存等）。

### Q: 如何强制用户立即更新？
A: 可以在代码中添加强制更新逻辑，检测到新版本后立即重启APP。

### Q: OTA更新失败怎么办？
A: APP会自动回退到上一个版本，用户可以正常使用。

### Q: 如何查看更新历史？
A: 在Expo控制台的Updates页面可以查看所有更新历史。

## 最佳实践

1. **小步快跑**：频繁推送小更新，而不是一次推送大更新
2. **充分测试**：在预览版测试后再推送到生产环境
3. **版本管理**：使用语义化版本号（1.0.1、1.0.2等）
4. **回滚机制**：保留上一个版本的备份，必要时可以快速回滚
5. **监控反馈**：关注用户反馈，及时发现并解决问题

## 总结

通过配置OTA热更新功能，您可以：
- ✅ 快速响应问题，无需重新发布APP
- ✅ 提高用户体验，减少更新等待时间
- ✅ 降低发布成本，避免应用商店审核
- ✅ 支持快速迭代，持续优化产品

大部分的代码修改（包括今天的登录页面优化、投流建议升级等）都可以通过OTA更新自动推送到用户设备！
