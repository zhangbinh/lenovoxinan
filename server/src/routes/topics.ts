import express from 'express';
import type { Request, Response } from 'express';
import { SearchClient, Config, LLMClient } from 'coze-coding-dev-sdk';
import { HeaderUtils } from 'coze-coding-dev-sdk';

const router = express.Router();

// 生成话题方向接口
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topic, remark } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: '缺少话题参数'
      });
    }

    const config = new Config();
    const searchClient = new SearchClient(config);
    const llmClient = new LLMClient(config);

    // 1. 搜索30天内抖音、知乎、小红书、今日头条的相关热榜
    const searchQueries = [
      `${topic} 抖音 热榜`,
      `${topic} 知乎 热榜`,
      `${topic} 小红书 热榜`,
      `${topic} 今日头条 热榜`
    ];

    let allHotItems: any[] = [];

    for (const query of searchQueries) {
      const response = await searchClient.advancedSearch(query, {
        timeRange: '1m',
        count: 5,
        needSummary: true,
      });

      if (response.web_items && response.web_items.length > 0) {
        allHotItems = allHotItems.concat(response.web_items);
      }
    }

    // 2. 使用LLM生成5个话题方向
    const hotContent = allHotItems
      .map((item, index) => `${index + 1}. ${item.title}\n来源：${item.site_name}\n摘要：${item.snippet}`)
      .join('\n\n');

    const systemPrompt = `你是一个专业的社交媒体内容策划专家，擅长根据热榜内容生成爆款话题方向。

请根据以下要求工作：
1. 结合用户输入的话题和搜索到的30天热榜内容
2. 生成5个可能在抖音、知乎、小红书、今日头条爆火的话题方向
3. 话题必须积极导向、合法合规
4. 严禁涉及政治、宗教、擦边等违禁内容
5. 每个话题方向包含：标题、描述、适用平台
6. 输出格式必须是有效的JSON数组，不要有任何额外的文字说明

输出格式示例：
[
  {
    "id": 1,
    "title": "话题标题",
    "description": "话题描述",
    "platforms": ["抖音", "小红书"]
  }
]`;

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `用户话题：${topic}${remark ? `\n\n用户备注：${remark}` : ''}\n\n相关热榜内容：\n${hotContent}\n\n请生成5个话题方向，输出纯JSON格式。`
      }
    ];

    const llmResponse = await llmClient.invoke(messages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.8,
    });

    // 3. 解析LLM返回的JSON
    let topics = [];
    try {
      // 尝试直接解析
      topics = JSON.parse(llmResponse.content);
    } catch (parseError) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = llmResponse.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        topics = JSON.parse(jsonMatch[0]);
      } else {
        // 如果还是失败，生成默认话题
        topics = [
          {
            id: 1,
            title: `${topic}新品体验`,
            description: `深度体验${topic}新品的真实感受，包括性能、外观、使用场景等`,
            platforms: ['抖音', '小红书', '知乎']
          },
          {
            id: 2,
            title: `${topic}选购指南`,
            description: `如何选择适合自己的${topic}，从参数到使用场景的全方位解析`,
            platforms: ['知乎', '今日头条']
          },
          {
            id: 3,
            title: `${topic}对比评测`,
            description: `多款${topic}的详细对比评测，帮助用户做出最佳选择`,
            platforms: ['抖音', '今日头条']
          },
          {
            id: 4,
            title: `${topic}使用技巧`,
            description: `分享${topic}的高效使用技巧和隐藏功能`,
            platforms: ['小红书', '知乎']
          },
          {
            id: 5,
            title: `${topic}真实案例`,
            description: `分享${topic}在真实场景中的应用案例和效果`,
            platforms: ['抖音', '小红书']
          }
        ];
      }
    }

    // 添加selected字段
    topics = topics.map((t: any) => ({ ...t, selected: false }));

    res.json({
      success: true,
      topics,
      hotTopicsCount: allHotItems.length
    });
  } catch (error) {
    console.error('生成话题方向错误:', error);
    res.status(500).json({
      success: false,
      message: '生成话题方向失败'
    });
  }
});

export default router;
