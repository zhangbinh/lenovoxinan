# 📱 查询Expo APP下载二维码指南

## 📋 方法一：通过EAS Dashboard查看（推荐）

### 第1步：登录Expo Dashboard

1. 访问：https://expo.dev/
2. 使用GitHub或邮箱登录

### 第2步：找到你的项目

1. 点击左侧 "Projects"
2. 找到你的项目（根据你的账户和项目名称）

### 第3步：查看构建历史

1. 点击项目后，点击 "Builds" 标签
2. 你会看到所有构建历史：
   - 构建ID
   - 构建平台（Android/iOS）
   - 构建环境（development/preview/production）
   - 构建状态（success/failed/in-progress）
   - 构建时间

### 第4步：获取下载二维码

1. 点击任何一个构建记录
2. 向下滚动找到 "Install" 部分
3. 你会看到：
   - **二维码**：可以直接扫描安装
   - **下载链接**：可以复制链接分享

---

## 📋 方法二：使用EAS CLI命令行工具

### 第1步：安装EAS CLI

```bash
npm install -g eas-cli
```

### 第2步：登录Expo账户

```bash
eas login
```

会打开浏览器，授权登录。

### 第3步：查看构建历史

```bash
cd client
eas build:list --limit 10
```

### 第4步：获取构建详情

找到你想查询的构建ID，运行：

```bash
eas build:view [构建ID]
```

### 第5步：获取下载链接

构建详情页面会显示：
- 下载链接
- 安装说明
- 二维码（需要访问EAS Dashboard查看）

---

## 📋 方法三：查看Expo Go（开发版本）

如果你的APP配置了 `developmentClient: true`，可以通过Expo Go扫描：

### 第1步：安装Expo Go

- **iOS**: App Store搜索 "Expo Go"
- **Android**: Google Play搜索 "Expo Go"

### 第2步：扫描项目二维码

1. 打开Expo Go应用
2. 点击 "Scan QR Code"
3. 扫描项目二维码（需要在EAS Dashboard中找到）

### 第3步：实时开发

扫描后，可以实时查看和测试APP的最新版本

---

## 📊 构建类型说明

你的APP配置了三种构建类型：

| 构建类型 | 用途 | 分发方式 | 平台 |
|---------|------|---------|------|
| **development** | 开发测试 | Expo Go扫描 | Android/iOS |
| **preview** | 预览版本 | 内部分发链接 | Android APK, iOS |
| **production** | 生产版本 | 应用商店/分发 | Android APK, iOS |

---

## 🔑 获取EAS账户信息

如果你不知道你的EAS账户和项目信息，可以：

### 检查client/app.json或app.config.ts

```bash
cd client
cat app.json | grep -A 5 "expo"
# 或
cat app.config.ts | grep -A 10 "expo"
```

### 查看项目名称和所有者

文件中会显示：
- `owner`: 账户名
- `name`: 项目名

例如：
```json
"expo": {
  "name": "lenovoxinan",
  "owner": "zhangbinh"
}
```

这样你的EAS Dashboard地址就是：
```
https://expo.dev/accounts/zhangbinh/projects/lenovoxinan/builds
```

---

## 🚀 快速生成下载二维码（如果有构建）

如果你已经有了EAS构建ID，可以：

### 在命令行获取链接

```bash
eas build:view [构建ID]
```

### 生成二维码图片

```bash
# 安装qrencode
apt-get install -y qrencode

# 生成二维码
eas build:view [构建ID] | grep "https" | head -1 | xargs qrencode -t ANSIUTF8

# 保存为图片
eas build:view [构建ID] | grep "https" | head -1 | xargs qrencode -o qrcode.png
```

---

## 📱 通过Expo Go安装（开发版本）

如果你的APP正在开发中，可以直接通过Expo Go安装：

### 第1步：启动开发服务器

```bash
cd client
npx expo start
```

### 第2步：扫描二维码

1. 打开手机上的Expo Go
2. 点击 "Scan QR Code"
3. 扫描终端显示的二维码

### 第3步：查看APP

扫描后，APP会立即在手机上运行

---

## 🔍 常见问题

### Q1: 找不到构建历史？

**A**: 检查是否登录了正确的EAS账户：
```bash
eas whoami
```

### Q2: 构建失败了怎么办？

**A**: 查看构建日志：
```bash
eas build:view [构建ID]
```
向下滚动查看错误信息。

### Q3: 如何重新构建？

**A**:
```bash
# Android Preview
eas build --platform android --profile preview

# iOS Preview
eas build --platform ios --profile preview

# Android Production
eas build --platform android --profile production

# iOS Production
eas build --platform ios --profile production
```

### Q4: 如何分享给其他人？

**A**:
1. 在EAS Dashboard中找到构建
2. 复制下载链接
3. 或者显示二维码让对方扫描

---

## 🎯 推荐流程

1. **开发阶段**: 使用Expo Go实时开发
2. **测试阶段**: 使用EAS Preview构建，生成APK或IPA
3. **发布阶段**: 使用EAS Production构建，提交应用商店

---

## 📋 检查清单

查询下载二维码：
- [ ] 已登录Expo Dashboard
- [ ] 找到你的项目
- [ ] 查看Builds标签
- [ ] 找到成功的构建
- [ ] 获取下载链接或二维码

生成新构建：
- [ ] 安装了EAS CLI
- [ ] 已登录EAS账户
- [ ] 运行 `eas build` 命令
- [ ] 等待构建完成
- [ ] 获取下载链接或二维码

---

**现在去Expo Dashboard查看你的构建历史和下载二维码吧！** 🚀

**EAS Dashboard**: https://expo.dev/
