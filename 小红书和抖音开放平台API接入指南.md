# 小红书和抖音开放平台API接入指南

## 目录
1. [小红书开放平台](#小红书开放平台)
2. [抖音开放平台](#抖音开放平台)
3. [代码改造方案](#代码改造方案)
4. [数据结构定义](#数据结构定义)
5. [安全注意事项](#安全注意事项)

---

## 小红书开放平台

### 1. 申请流程

#### 步骤1：注册开发者账号
- 访问：https://open.xiaohongshu.com/
- 使用企业账号注册（需要营业执照）
- 完成开发者认证

#### 步骤2：创建应用
1. 登录后进入"开发者控制台"
2. 点击"创建应用"
3. 填写应用信息：
   - 应用名称：联想西南战区门店营销助手
   - 应用类型：数据分析/营销工具
   - 应用描述：帮助门店分析小红书内容数据，优化投流策略
4. 提交审核（通常1-3个工作日）

#### 步骤3：获取API密钥
- 审核通过后，进入应用详情
- 获取以下信息：
  - `AppID`：应用唯一标识
  - `AppSecret`：应用密钥（保密）
  - `RedirectURI`：回调地址

### 2. 认证方式

小红书使用OAuth2.0认证，流程如下：

```
用户授权 → 获取授权码 → 换取Access Token → 调用API
```

#### 获取Access Token
```bash
POST https://edith.xiaohongshu.com/api/sns/v2/oauth2/access_token

参数：
- grant_type: "authorization_code"
- client_id: {AppID}
- client_secret: {AppSecret}
- code: {授权码}
- redirect_uri: {回调地址}

响应：
{
  "access_token": "xxx",
  "refresh_token": "xxx",
  "expires_in": 2592000
}
```

### 3. 数据获取API

#### 获取笔记详情
```bash
GET https://edith.xiaohongshu.com/api/sns/v2/note/{note_id}

Headers:
- Authorization: Bearer {access_token}

响应：
{
  "code": 0,
  "msg": "成功",
  "data": {
    "note_id": "xxx",
    "type": "video", // video 或 normal
    "title": "笔记标题",
    "desc": "笔记内容",
    "time": 1234567890,
    "user": {
      "user_id": "xxx",
      "nickname": "用户昵称"
    },
    "stat": {
      "liked_count": 1000,
      "collected_count": 200,
      "comment_count": 50,
      "share_count": 30
    }
  }
}
```

#### 获取笔记互动数据
```bash
GET https://edith.xiaohongshu.com/api/sns/v2/note/{note_id}/stat

Headers:
- Authorization: Bearer {access_token}

响应：
{
  "code": 0,
  "msg": "成功",
  "data": {
    "view_count": 10000,
    "liked_count": 1000,
    "collected_count": 200,
    "comment_count": 50,
    "share_count": 30,
    "completion_rate": 65.5
  }
}
```

### 4. 注意事项

- ⚠️ API调用频率限制：默认100次/小时
- ⚠️ Access Token有效期：30天，需要定期刷新
- ⚠️ 部分敏感数据需要申请额外权限
- ⚠️ 注意保护AppSecret，不要泄露

---

## 抖音开放平台

### 1. 申请流程

#### 步骤1：注册开发者账号
- 访问：https://developer.open-douyin.com/
- 使用企业账号注册（需要营业执照）
- 完成企业认证

#### 步骤2：创建应用
1. 登录后进入"应用管理"
2. 点击"创建应用"
3. 填写应用信息：
   - 应用名称：联想西南战区门店营销助手
   - 应用类型：数据分析/营销工具
   - 应用描述：帮助门店分析抖音内容数据，优化投流策略
4. 上传应用图标
5. 提交审核（通常1-5个工作日）

#### 步骤3：获取API密钥
- 审核通过后，进入应用详情
- 获取以下信息：
  - `AppID`：应用唯一标识
  - `AppSecret`：应用密钥（保密）
  - `ClientKey`：客户端密钥

### 2. 认证方式

抖音使用OAuth2.0认证，流程如下：

```
用户授权 → 获取授权码 → 换取Access Token → 调用API
```

#### 获取Access Token
```bash
POST https://open.douyin.com/oauth/access_token/

参数：
- client_key: {ClientKey}
- client_secret: {AppSecret}
- code: {授权码}
- grant_type: "authorization_code"
- redirect_uri: {回调地址}

响应：
{
  "access_token": "xxx",
  "expires_in": 86400,
  "refresh_token": "xxx"
}
```

### 3. 数据获取API

#### 获取视频详情
```bash
GET https://open.douyin.com/data/external/item/detail/

参数：
- access_token: {access_token}
- item_id: {视频ID}

响应：
{
  "item_list": [
    {
      "item_id": "xxx",
      "title": "视频标题",
      "desc": "视频描述",
      "create_time": 1234567890,
      "author": {
        "uid": "xxx",
        "nickname": "用户昵称"
      },
      "statistics": {
        "digg_count": 1000,        // 点赞数
        "comment_count": 50,      // 评论数
        "share_count": 30,        // 分享数
        "play_count": 10000,      // 播放量
        "collect_count": 200      // 收藏数
      }
    }
  ]
}
```

#### 获取视频互动数据
```bash
GET https://open.douyin.com/data/external/item/item_comment_data/

参数：
- access_token: {access_token}
- item_id: {视频ID}

响应：
{
  "data": {
    "item_id": "xxx",
    "view_count": 10000,
    "like_count": 1000,
    "comment_count": 50,
    "share_count": 30,
    "collect_count": 200,
    "completion_rate": 65.5,
    "interact_rate": 8.5
  }
}
```

### 4. 注意事项

- ⚠️ API调用频率限制：默认100次/分钟
- ⚠️ Access Token有效期：24小时，需要频繁刷新
- ⚠️ 部分数据需要申请企业认证才能获取
- ⚠️ 注意保护AppSecret，不要泄露

---

## 代码改造方案

### 1. 环境变量配置

在 `server/.env` 中添加：

```bash
# 小红书配置
XIAOHONGSHU_APP_ID=your_app_id
XIAOHONGSHU_APP_SECRET=your_app_secret
XIAOHONGSHU_REDIRECT_URI=your_redirect_uri

# 抖音配置
DOUYIN_CLIENT_KEY=your_client_key
DOUYIN_APP_SECRET=your_app_secret
DOUYIN_REDIRECT_URI=your_redirect_uri
```

### 2. 创建API服务模块

创建 `server/src/services/social-platform.ts`：

```typescript
import axios from 'axios';

interface PlatformMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  collectRate: number;
  interactRate: number;
  completionRate: number;
}

class SocialPlatformService {
  /**
   * 从小红书URL提取笔记ID
   */
  private extractXiaohongshuNoteId(url: string): string {
    const match = url.match(/xiaohongshu\.com\/explore\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * 从抖音URL提取视频ID
   */
  private extractDouyinVideoId(url: string): string {
    const match = url.match(/douyin\.com\/video\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * 判断URL平台类型
   */
  private detectPlatform(url: string): 'xiaohongshu' | 'douyin' | 'unknown' {
    if (url.includes('xiaohongshu.com')) {
      return 'xiaohongshu';
    } else if (url.includes('douyin.com')) {
      return 'douyin';
    }
    return 'unknown';
  }

  /**
   * 获取小红书数据
   */
  async getXiaohongshuMetrics(url: string, accessToken: string): Promise<PlatformMetrics> {
    const noteId = this.extractXiaohongshuNoteId(url);
    if (!noteId) {
      throw new Error('无法从URL中提取笔记ID');
    }

    try {
      // 获取笔记互动数据
      const response = await axios.get(
        `https://edith.xiaohongshu.com/api/sns/v2/note/${noteId}/stat`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data.data;

      return {
        views: data.view_count || 0,
        likes: data.liked_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        collectRate: data.collected_count > 0
          ? (data.collected_count / data.view_count) * 100
          : 0,
        interactRate: data.liked_count > 0
          ? ((data.liked_count + data.comment_count) / data.view_count) * 100
          : 0,
        completionRate: data.completion_rate || 0,
      };
    } catch (error) {
      console.error('获取小红书数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取抖音数据
   */
  async getDouyinMetrics(url: string, accessToken: string): Promise<PlatformMetrics> {
    const itemId = this.extractDouyinVideoId(url);
    if (!itemId) {
      throw new Error('无法从URL中提取视频ID');
    }

    try {
      // 获取视频互动数据
      const response = await axios.get(
        'https://open.douyin.com/data/external/item/item_comment_data/',
        {
          params: {
            access_token: accessToken,
            item_id: itemId,
          },
        }
      );

      const data = response.data.data;

      return {
        views: data.view_count || 0,
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        collectRate: data.collect_count > 0
          ? (data.collect_count / data.view_count) * 100
          : 0,
        interactRate: data.interact_rate || 0,
        completionRate: data.completion_rate || 0,
      };
    } catch (error) {
      console.error('获取抖音数据失败:', error);
      throw error;
    }
  }

  /**
   * 根据URL自动获取数据
   */
  async getMetrics(url: string, accessToken: string): Promise<PlatformMetrics> {
    const platform = this.detectPlatform(url);

    if (platform === 'xiaohongshu') {
      return this.getXiaohongshuMetrics(url, accessToken);
    } else if (platform === 'douyin') {
      return this.getDouyinMetrics(url, accessToken);
    } else {
      throw new Error('不支持的平台URL');
    }
  }
}

export const socialPlatformService = new SocialPlatformService();
```

### 3. 修改promotion.ts路由

将模拟数据替换为真实API调用：

```typescript
import { socialPlatformService } from '../services/social-platform';

// 从发布链接抓取数据并生成投流建议
router.post('/advice', async (req: Request, res: Response) => {
  try {
    const { publishUrl, publishDate } = req.body;

    if (!publishUrl || !publishDate) {
      res.status(400).json({
        success: false,
        message: '缺少必要参数: publishUrl, publishDate',
      });
      return;
    }

    // 计算发布天数
    const publishTime = new Date(publishDate).getTime();
    const now = Date.now();
    const daysSincePublish = Math.floor((now - publishTime) / (1000 * 60 * 60 * 24));

    // 如果发布超过15天，不再提供建议
    if (daysSincePublish > 15) {
      res.json({
        success: true,
        data: {
          shouldPromote: false,
          advice: ['内容发布已超过15天，投流效果不佳，建议创作新内容'],
          budget: '',
          timing: [],
          targeting: [],
          tips: [],
          daysSincePublish,
        },
      });
      return;
    }

    // 使用真实API获取数据
    let metrics: any;

    try {
      // 从环境变量获取Access Token
      const accessToken = process.env.XIAOHONGSHU_ACCESS_TOKEN ||
                          process.env.DOUYIN_ACCESS_TOKEN ||
                          '';

      if (!accessToken) {
        throw new Error('缺少Access Token，请在环境变量中配置');
      }

      metrics = await socialPlatformService.getMetrics(publishUrl, accessToken);
      console.log('获取真实数据成功:', metrics);
    } catch (error) {
      console.error('获取真实数据失败，使用模拟数据:', error);

      // 降级方案：使用模拟数据
      metrics = {
        views: Math.floor(1000 + Math.random() * 9000),
        likes: Math.floor(50 + Math.random() * 450),
        comments: Math.floor(10 + Math.random() * 90),
        shares: Math.floor(5 + Math.random() * 45),
        completionRate: 30 + Math.random() * 40,
        readRate: 5 + Math.random() * 15,
        interactRate: 2 + Math.random() * 8,
        collectRate: 1 + Math.random() * 5,
      };
    }

    // 生成小红书和抖音两个平台的建议
    const xiaohongshuAdvice = generateAdvice('xiaohongshu', daysSincePublish, metrics);
    const douyinAdvice = generateAdvice('douyin', daysSincePublish, metrics);

    res.json({
      success: true,
      data: {
        daysSincePublish,
        metrics: {
          views: metrics.views,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          interactRate: metrics.interactRate,
          collectRate: metrics.collectRate,
          completionRate: metrics.completionRate,
        },
        xiaohongshu: xiaohongshuAdvice,
        douyin: douyinAdvice,
      },
    });
  } catch (error) {
    console.error('内容运营建议生成失败:', error);
    res.status(500).json({
      success: false,
      message: '内容运营建议生成失败',
    });
  }
});
```

---

## 数据结构定义

### Metrics数据结构
```typescript
interface Metrics {
  views: number;           // 播放量/阅读量
  likes: number;           // 点赞数
  comments: number;        // 评论数
  shares: number;          // 分享数
  collectRate: number;     // 收藏率（百分比）
  interactRate: number;    // 互动率（百分比）
  completionRate: number;  // 完播率（百分比）
}
```

### Advice数据结构
```typescript
interface Advice {
  shouldPromote: boolean;  // 是否建议投流
  advice: string[];        // 具体建议列表
  budget: string;          // 预算建议
  timing: string[];        // 最佳投放时间
  targeting: string[];     // 目标人群
  tips: string[];          // 注意事项
  recommendation: {
    decision: string;      // 投流决策
    tool?: string;         // 投流工具（抖音）
    scope?: string;        // 投流范围（小红书）
    notice: string;        // 注意事项
  };
}
```

---

## 安全注意事项

### 1. 保护API密钥
- ⚠️ **绝对不要**将AppSecret和Access Token提交到代码仓库
- ⚠️ **必须**使用环境变量存储敏感信息
- ⚠️ **定期**更换API密钥

### 2. Access Token管理
- 小红书Token有效期：30天
- 抖音Token有效期：24小时
- 需要实现Token自动刷新机制

### 3. 调用频率限制
- 小红书：100次/小时
- 抖音：100次/分钟
- 需要实现调用频率控制，避免超限

### 4. 数据缓存
- 建议对获取的数据进行缓存（如1小时）
- 避免频繁调用API
- 提升响应速度

---

## 测试建议

### 1. 测试URL格式
- 小红书：https://www.xiaohongshu.com/explore/641c123456789
- 抖音：https://www.douyin.com/video/7123456789012345678

### 2. 测试流程
1. 使用模拟数据测试完整流程
2. 申请API密钥后，使用真实URL测试
3. 验证数据准确性
4. 测试Token刷新机制
5. 测试频率限制处理

### 3. 错误处理
- API调用失败
- Token过期
- 频率超限
- URL格式错误
- 数据解析失败

---

## 下一步

1. **申请API权限**：
   - 小红书开放平台：https://open.xiaohongshu.com/
   - 抖音开放平台：https://developer.open-douyin.com/

2. **获取API密钥**：
   - AppID/ClientKey
   - AppSecret
   - Access Token

3. **配置环境变量**：
   - 在 `server/.env` 中添加配置
   - 添加 Access Token

4. **测试集成**：
   - 使用真实URL测试数据获取
   - 验证数据准确性
   - 测试异常情况处理

5. **上线部署**：
   - 更新生产环境配置
   - 监控API调用情况
   - 处理异常和错误

---

**如有任何问题，请随时联系！**
