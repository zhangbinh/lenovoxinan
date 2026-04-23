# Render后端部署说明

部署时间：2025-01-21

## 后端地址
https://marketing-backend.onrender.com

## 数据库连接
postgresql://marketing_user:bMxAX09365IwlJXqgQdAISffrxCuh28R@dpg-d7jpb8t8nd3s73adbia0-a/marketing_knrq

## 环境变量
- NODE_ENV=production
- PORT=10000
- DATABASE_URL=postgresql://marketing_user:bMxAX09365IwlJXqgQdAISffrxCuh28R@dpg-d7jpb8t8nd3s73adbia0-a/marketing_knrq
- EXPO_PUBLIC_BACKEND_BASE_URL=https://marketing-backend.onrender.com

## 部署历史

### 1. 初始部署
- 时间：2025-01-21
- 状态：❌ 构建失败
- 原因：`esbuild` 在 devDependencies 中，生产环境构建时缺失

### 2. 修复部署
- 时间：2025-01-21
- 修复内容：将 `esbuild` 移至 `dependencies`
- 提交：cd1126c
- 状态：✅ 代码已推送，等待 Render 自动重新部署

## 当前状态
⏳ 等待 Render 自动重新部署...
- 构建命令：`cd server && pnpm install && pnpm run build`
- 启动命令：`cd server && node dist/index.js`
- 预计部署时间：5-10分钟

## 问题排查

### 已修复
- ✅ esbuild 依赖问题

### 待测试
- ⏳ 健康检查接口：`GET /api/v1/health`
- ⏳ 登录验证接口：`POST /api/v1/auth/verify`
- ⏳ 其他业务接口
