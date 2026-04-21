# 版本管理和自动更新文档

## 概述

本应用已配置完整的版本管理系统，包括：
1. ✅ 自动发布为生产版本
2. ✅ 强制更新机制
3. ✅ 版本管理功能

---

## 一、自动发布为生产版本

### 1.1 使用构建脚本

项目提供了自动构建脚本 `scripts/build-production.sh`：

```bash
# 进入client目录
cd /workspace/projects/client

# 给脚本添加执行权限
chmod +x ../scripts/build-production.sh

# 运行构建脚本
bash ../scripts/build-production.sh
```

### 1.2 手动构建命令

```bash
# 进入client目录
cd /workspace/projects/client

# 检查EAS登录状态
npx eas whoami

# 如果未登录，执行登录
npx eas login

# 构建Android生产版本
npx eas build --platform android --profile production

# 构建iOS生产版本
npx eas build --platform ios --profile production
```

### 1.3 构建配置

构建配置在 `client/eas.json` 中：

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

---

## 二、强制更新机制

### 2.1 工作原理

强制更新机制基于以下流程：

1. **应用启动时**：自动检查后端API获取最新版本信息
2. **检测到新版本**：
   - 如果需要强制更新：弹出强制更新弹窗，用户必须更新才能继续使用
   - 如果是可选更新：用户可以选择稍后更新或立即更新
3. **下载更新**：使用 `expo-updates` 进行OTA更新
4. **安装更新**：重启应用以应用更新

### 2.2 版本检查组件

版本检查组件在 `client/components/VersionChecker.tsx` 中：

- 在应用启动时自动检查更新
- 显示强制更新弹窗
- 处理更新下载和安装流程

### 2.3 强制更新触发条件

强制更新会在以下情况触发：

1. **当前版本低于最低支持版本**
2. **后端API设置了 `forceUpdate: true`**

---

## 三、版本管理功能

### 3.1 后端API

版本管理API在 `server/src/routes/version.ts` 中提供以下接口：

#### a) 获取最新版本信息

```
GET /api/v1/version/latest
```

返回：
```json
{
  "success": true,
  "data": {
    "latestVersion": "1.0.0",
    "minSupportedVersion": "1.0.0",
    "forceUpdate": false,
    "updateMessage": "发现新版本，请更新以获得更好的体验",
    "releaseNotes": "- 修复了若干bug\n- 优化了用户体验\n- 新增了内容运营建议功能",
    "downloadUrl": "",
    "releaseDate": "2025-01-09T00:00:00.000Z"
  }
}
```

#### b) 检查是否需要更新

```
GET /api/v1/version/check?currentVersion=1.0.0
```

参数：
- `currentVersion`: 当前应用版本号

返回：
```json
{
  "success": true,
  "data": {
    "currentVersion": "1.0.0",
    "latestVersion": "1.0.1",
    "needsUpdate": true,
    "needsForceUpdate": false,
    "forceUpdate": false,
    "updateMessage": "发现新版本，请更新以获得更好的体验",
    "releaseNotes": "...",
    "downloadUrl": "https://..."
  }
}
```

#### c) 更新版本信息（管理员）

```
POST /api/v1/version/update
```

Body：
```json
{
  "latestVersion": "1.0.1",
  "minSupportedVersion": "1.0.0",
  "forceUpdate": false,
  "updateMessage": "发现新版本，请更新以获得更好的体验",
  "releaseNotes": "- 修复了若干bug\n- 优化了用户体验",
  "downloadUrl": "https://..."
}
```

### 3.2 前端版本服务

版本服务在 `client/utils/versionService.ts` 中提供以下方法：

```typescript
// 获取当前应用版本号
VersionService.getCurrentVersion(): string

// 检查是否有更新
VersionService.checkForUpdate(): Promise<VersionCheckResult | null>

// 下载并安装更新
VersionService.fetchAndInstallUpdate(): Promise<boolean>

// 立即重启应用以应用更新
VersionService.reloadApp()
```

### 3.3 个人中心版本管理

在个人中心（我的）页面，用户可以：

1. **查看当前版本号**
   - 显示在右上角，格式：`v1.0.0`
   - 如果有更新，显示"有更新"红色徽章

2. **手动检查更新**
   - 点击"检查更新"按钮
   - 手动触发版本检查
   - 查看更新详情和更新内容

---

## 四、发布流程

### 4.1 发布新版本步骤

1. **更新版本号**
   ```bash
   # 编辑 client/app.json
   # 修改 "version": "1.0.0" 为 "1.0.1"
   ```

2. **构建生产版本**
   ```bash
   cd /workspace/projects/client
   bash ../scripts/build-production.sh
   ```

3. **获取下载链接**
   - 构建完成后，EAS会生成下载二维码
   - 复制二维码或APK下载链接

4. **更新后端版本信息**
   ```bash
   # 调用后端API更新版本信息
   POST /api/v1/version/update
   Body: {
     "latestVersion": "1.0.1",
     "minSupportedVersion": "1.0.0",
     "forceUpdate": false,
     "updateMessage": "发现新版本，请更新以获得更好的体验",
     "releaseNotes": "- 修复了若干bug\n- 优化了用户体验\n- 新增了内容运营建议功能",
     "downloadUrl": "https://..."
   }
   ```

5. **通知用户更新**
   - 用户打开应用时会自动检测到新版本
   - 根据配置弹出可选更新或强制更新弹窗

### 4.2 强制更新示例

如果需要强制用户更新：

```bash
POST /api/v1/version/update
Body: {
  "latestVersion": "1.1.0",
  "minSupportedVersion": "1.1.0",  # 最低支持版本设为当前版本
  "forceUpdate": true,             # 开启强制更新
  "updateMessage": "必须更新到新版本才能继续使用",
  "releaseNotes": "- 重大安全修复\n- 新功能上线",
  "downloadUrl": "https://..."
}
```

---

## 五、注意事项

### 5.1 版本号规范

建议使用语义化版本号（Semantic Versioning）：

- `MAJOR.MINOR.PATCH`（主版本.次版本.补丁版本）
- 例如：`1.0.0`、`1.0.1`、`1.1.0`、`2.0.0`

### 5.2 构建时间

- Android构建时间：约10-15分钟
- iOS构建时间：约15-30分钟（需要Apple开发者账号）

### 5.3 二维码时效

- EAS构建生成的二维码**永久有效**
- 只要构建的APK文件在EAS服务器上就不会失效
- 用户可以随时扫码下载

### 5.4 OTA更新限制

- OTA更新仅支持代码和资源更新
- 不支持原生模块更新（如新增权限）
- 重大版本更新建议重新构建APK

### 5.5 最低支持版本

设置 `minSupportedVersion` 后：

- 低于此版本的用户会收到强制更新提示
- 用户必须更新到 `minSupportedVersion` 或更高版本才能继续使用

---

## 六、常见问题

### Q1: 如何查看当前应用版本？

A: 在个人中心（我的）页面右上角可以看到当前版本号。

### Q2: 如何测试强制更新功能？

A: 调用后端API设置 `forceUpdate: true` 或设置 `minSupportedVersion` 高于当前版本。

### Q3: 为什么用户看不到更新提示？

A: 检查以下几点：
1. 后端API是否正确返回版本信息
2. `latestVersion` 是否大于当前版本
3. 前端是否正确调用版本检查API

### Q4: 如何撤销强制更新？

A: 调用后端API将 `forceUpdate` 设为 `false`，并调整 `minSupportedVersion` 为较低版本。

### Q5: 构建失败怎么办？

A: 检查以下几点：
1. 是否已登录EAS账号
2. `eas.json` 配置是否正确
3. 代码是否有编译错误

---

## 七、技术支持

如有问题，请检查：
1. 后端日志：`/app/work/logs/bypass/app.log`
2. 前端日志：`/app/work/logs/bypass/console.log`
3. EAS构建日志：在Expo控制台查看

