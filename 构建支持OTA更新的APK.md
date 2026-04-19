# 构建支持OTA更新的APK

## 前提条件

1. 已安装Node.js和pnpm
2. 已配置好EAS账号（运行 `npx eas login`）
3. 已准备好Android打包环境或使用EAS云构建

## 步骤1：配置项目

项目已配置好OTA更新功能，配置文件：
- `client/app.config.ts` - 包含updates配置
- `client/eas.json` - 构建配置
- `client/package.json` - 包含构建脚本

## 步骤2：登录EAS

```bash
cd /workspace/projects/client
npx eas login
```

按照提示输入Expo账号和密码。

## 步骤3：构建APK

### 方式1：本地构建（需要配置Android环境）

```bash
cd /workspace/projects/client
npm run eas:build:preview --platform android --local
```

### 方式2：云构建（推荐，无需本地环境）

```bash
cd /workspace/projects/client
npm run eas:build:preview --platform android
```

构建完成后，APK文件会自动下载。

## 步骤4：发布APK

将构建好的APK文件分发给用户：
- 上传到应用商店
- 通过企业分发渠道
- 直接发给用户安装

## 步骤5：推送OTA更新

当您修改了代码后，只需运行：

```bash
cd /workspace/projects/client
npm run eas:update
```

更新会自动推送到所有已安装APP的用户设备。

## 验证OTA更新

1. 用户安装APK
2. 打开APP，检查版本
3. 修改代码（如更改标题文字）
4. 运行 `npm run eas:update` 推送更新
5. 用户重启APP，查看更新是否生效

## 注意事项

### 支持OTA更新的修改
- ✅ JavaScript代码修改
- ✅ UI组件修改
- ✅ 样式修改
- ✅ 业务逻辑调整
- ✅ Bug修复

### 不支持OTA更新的修改
- ❌ 添加新的原生依赖
- ❌ 修改应用权限
- ❌ 修改应用图标
- ❌ 修改原生配置

如果需要修改原生配置，必须重新构建并发布新的APK。

## 常见问题

### Q: 构建失败怎么办？
A:
1. 检查网络连接
2. 确认EAS账号状态
3. 查看构建日志
4. 尝试清理缓存：`npx expo start --clear`

### Q: OTA更新没有生效？
A:
1. 确认更新已成功推送
2. 让用户完全关闭并重新打开APP
3. 检查网络连接
4. 查看APP日志是否有错误

### Q: 如何强制用户立即更新？
A: 可以在APP代码中添加强制更新逻辑，检测到新版本后立即重启。

## 示例：推送今天的更新

今天的修改包括：
1. 登录页面优化
2. 内容运营建议功能升级
3. 删除封面图片

这些修改都支持OTA更新，可以直接推送：

```bash
cd /workspace/projects/client
npm run eas:update
```

用户重启APP后就会看到最新版本！

## 总结

通过配置OTA更新功能，您可以：
- ✅ 快速推送代码更新
- ✅ 无需用户重新下载APK
- ✅ 降低发布成本
- ✅ 提高用户体验

大部分的代码修改都可以通过OTA更新自动推送，大幅提升迭代效率！
