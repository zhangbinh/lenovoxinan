import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

// 热榜接口
router.get('/', async (req: Request, res: Response) => {
  try {
    const { platform = 'all', timeRange = '7d', category = 'all' } = req.query;

    // 模拟热榜数据
    const mockTopics = [
      {
        id: '1',
        title: '2024年最值得入手的高性能游戏本推荐',
        platform: '抖音',
        category: '3c',
        hot: 98500,
        date: '2024-01-15'
      },
      {
        id: '2',
        title: '联想拯救者系列深度测评，性能怪兽实至名归',
        platform: '知乎',
        category: '3c',
        hot: 87200,
        date: '2024-01-14'
      },
      {
        id: '3',
        title: '轻薄本也能打游戏？这几款性能强劲',
        platform: '小红书',
        category: '3c',
        hot: 75600,
        date: '2024-01-13'
      },
      {
        id: '4',
        title: '学生党必看：3000-5000元高性价比笔记本',
        platform: '今日头条',
        category: '3c',
        hot: 68900,
        date: '2024-01-12'
      },
      {
        id: '5',
        title: '办公本怎么选？联想ThinkPad系列全面解析',
        platform: '知乎',
        category: '3c',
        hot: 54300,
        date: '2024-01-11'
      },
      {
        id: '6',
        title: '设计师专用笔记本，色彩准性能强',
        platform: '小红书',
        category: '3c',
        hot: 48200,
        date: '2024-01-10'
      },
      {
        id: '7',
        title: '联想小新Pro14开箱体验，轻薄与性能兼得',
        platform: '抖音',
        category: '3c',
        hot: 42100,
        date: '2024-01-09'
      },
      {
        id: '8',
        title: '2024年显卡升级指南，老笔记本也能焕发新生',
        platform: '知乎',
        category: '3c',
        hot: 38500,
        date: '2024-01-08'
      },
      {
        id: '9',
        title: '二手机选购避坑指南，这些细节要注意',
        platform: '今日头条',
        category: '3c',
        hot: 32800,
        date: '2024-01-07'
      },
      {
        id: '10',
        title: '游戏本散热技巧，让性能持续满血输出',
        platform: '小红书',
        category: '3c',
        hot: 29600,
        date: '2024-01-06'
      },
      {
        id: '11',
        title: '程序员必备：这些开发本配置绝了',
        platform: '抖音',
        category: '3c',
        hot: 25400,
        date: '2024-01-05'
      },
      {
        id: '12',
        title: '笔记本配件推荐，提升使用体验的神器',
        platform: '知乎',
        category: '3c',
        hot: 21900,
        date: '2024-01-04'
      },
      {
        id: '13',
        title: '网课笔记本选购，经济实用是关键',
        platform: '今日头条',
        category: '3c',
        hot: 18700,
        date: '2024-01-03'
      },
      {
        id: '14',
        title: '联想YOGA系列开箱，二合一设计很惊艳',
        platform: '小红书',
        category: '3c',
        hot: 15800,
        date: '2024-01-02'
      },
      {
        id: '15',
        title: '笔记本屏幕参数解读，这些数值很重要',
        platform: '抖音',
        category: '3c',
        hot: 12900,
        date: '2024-01-01'
      }
    ];

    // 筛选数据
    let filteredTopics = mockTopics;

    // 平台筛选
    if (platform !== 'all') {
      filteredTopics = filteredTopics.filter(t => t.platform === platform);
    }

    // 分类筛选
    if (category === '3c') {
      filteredTopics = filteredTopics.filter(t => t.category === '3c');
    }

    // 时间筛选
    if (timeRange === '7d') {
      // 只返回最近7天的数据
      filteredTopics = filteredTopics.slice(0, 10);
    }

    res.json({
      success: true,
      topics: filteredTopics,
      total: filteredTopics.length
    });
  } catch (error) {
    console.error('获取热榜错误:', error);
    res.status(500).json({
      success: false,
      message: '获取热榜失败'
    });
  }
});

export default router;
