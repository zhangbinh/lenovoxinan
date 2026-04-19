import express from 'express';
import type { Request, Response } from 'express';
import { LLMClient, Config } from 'coze-coding-dev-sdk';

const router = express.Router();

// 生成内容接口
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topics, type, remark } = req.body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: '缺少话题参数'
      });
    }

    const config = new Config();
    const llmClient = new LLMClient(config);

    const topicsText = topics.join('、');
    const remarkText = remark ? `\n\n用户备注：${remark}` : '';
    const contents: any[] = [];

    // 根据type生成不同内容
    if (type === 'xiaohongshu' || !type) {
      // 生成小红书爆款文案
      const xiaohongshuSystemPrompt = `你是一个专业的小红书爆款文案创作专家，擅长创作吸引用户注意、引发互动的高质量文案。

请根据选中的话题，创作3条小红书爆款文案，每条文案要求：
1. 标题吸睛，使用emoji表情
2. 内容真实有价值，突出产品卖点
3. 字数控制在200-300字之间
4. 包含相关话题标签
5. 积极导向，合法合规
6. 输出格式必须是有效的JSON数组

输出格式示例：
[
  "标题1\\n\\n正文内容...\\n\\n#话题标签",
  "标题2\\n\\n正文内容...\\n\\n#话题标签",
  "标题3\\n\\n正文内容...\\n\\n#话题标签"
]`;

      const xiaohongshuMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: "system", content: xiaohongshuSystemPrompt },
        {
          role: "user",
          content: `话题：${topicsText}${remarkText}\n\n请创作3条小红书爆款文案，输出纯JSON数组格式。`
        }
      ];

      const xiaohongshuResponse = await llmClient.invoke(xiaohongshuMessages, {
        model: 'doubao-seed-2-0-lite-260215',
        temperature: 0.9,
      });

      let xiaohongshuContents: string[] = [];
      try {
        xiaohongshuContents = JSON.parse(xiaohongshuResponse.content);
        // 确保每个元素都是字符串
        xiaohongshuContents = xiaohongshuContents.map((item: any) => String(item));
      } catch (error) {
        console.error('解析小红书内容失败，使用默认文案，原始内容:', xiaohongshuResponse.content);
        // 如果解析失败，返回默认文案
        xiaohongshuContents = [
          `✨${topicsText}实测体验！真香预警！\n\n最近入手了这款${topicsText}，真心推荐给大家！\n\n🌟 外观设计：颜值超高，一眼心动\n🌟 性能表现：流畅不卡顿，体验超棒\n🌟 性价比：这个价位绝对值得\n\n使用了一段时间，真心觉得不错，想要的小伙伴可以冲啦！\n\n#${topicsText} #好物分享 #新品体验`,
          `💥${topicsText}深度测评！看完再买不踩雷！\n\n今天给大家深度测评一下这款${topicsText}！\n\n✅ 颜值在线，设计感十足\n✅ 性能强劲，日常使用完全够用\n✅ 价格合理，性价比超高\n\n总体来说非常满意，推荐给正在选购的你们！\n\n#${topicsText} #产品测评 #避坑指南`,
          `🔥${topicsText}真实使用感受！亲测有效！\n\n作为一个过来人，分享一下使用${topicsText}的真实体验！\n\n📝 使用场景：日常办公+娱乐\n📝 使用感受：流畅、稳定、省心\n📝 推荐理由：性价比高，值得入手\n\n如果你也在考虑，可以参考一下我的体验哦！\n\n#${topicsText} #真实测评 #使用心得`
        ];
      }

      contents.push({
        type: 'xiaohongshu',
        title: '小红书爆款文案',
        contents: xiaohongshuContents
      });
    }

    if (type === 'video' || !type) {
      // 生成短视频脚本
      const videoSystemPrompt = `你是一个专业的短视频脚本创作专家，擅长创作节奏紧凑、内容有趣、易于传播的短视频脚本。

请根据选中的话题，创作以下短视频脚本：
1. 15秒短视频脚本 × 3条
2. 30秒短视频脚本 × 2条
3. 30秒以上短视频脚本 × 1条

每条脚本要求：
1. 明确时长限制
2. 内容紧凑有趣，节奏感强
3. 突出产品核心卖点
4. 包含画面描述、台词、动作
5. 积极导向，合法合规
6. 输出格式必须是有效的JSON对象

输出格式示例：
{
  "video15s": [
    "【15秒脚本1】\n画面：...\\n台词：...\\n动作：...",
    "【15秒脚本2】\\n画面：...\\n台词：...\\n动作：...",
    "【15秒脚本3】\\n画面：...\\n台词：...\\n动作：..."
  ],
  "video30s": [
    "【30秒脚本1】\\n画面：...\\n台词：...\\n动作：...",
    "【30秒脚本2】\\n画面：...\\n台词：...\\n动作：..."
  ],
  "video30sPlus": [
    "【30秒+脚本】\\n画面：...\\n台词：...\\n动作：..."
  ]
}`;

      const videoMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: "system", content: videoSystemPrompt },
        {
          role: "user",
          content: `话题：${topicsText}${remarkText}\n\n请创作短视频脚本，输出纯JSON格式。`
        }
      ];

      const videoResponse = await llmClient.invoke(videoMessages, {
        model: 'doubao-seed-2-0-lite-260215',
        temperature: 0.9,
      });

      let videoContents: any = {
        video15s: [],
        video30s: [],
        video30sPlus: []
      };

      try {
        videoContents = JSON.parse(videoResponse.content);
        // 确保所有数组元素都是字符串
        if (videoContents.video15s) {
          videoContents.video15s = videoContents.video15s.map((item: any) => String(item));
        }
        if (videoContents.video30s) {
          videoContents.video30s = videoContents.video30s.map((item: any) => String(item));
        }
        if (videoContents.video30sPlus) {
          videoContents.video30sPlus = videoContents.video30sPlus.map((item: any) => String(item));
        }
      } catch (error) {
        console.error('解析短视频内容失败，使用默认脚本，原始内容:', videoResponse.content);
        // 如果解析失败，返回默认脚本
        videoContents = {
          video15s: [
            `【15秒脚本1】\n画面：产品特写镜头\n台词：这款${topicsText}真的太赞了！\n动作：展示产品`,
            `【15秒脚本2】\n画面：使用场景切换\n台词：日常使用完全够用\n动作：演示操作`,
            `【15秒脚本3】\n画面：价格标签展示\n台词：性价比超高！\n动作：点赞手势`
          ],
          video30s: [
            `【30秒脚本1】\n画面：产品全景\n台词：给大家推荐一款${topicsText}\n动作：展示外观\n画面：功能演示\n台词：功能强大，操作简单\n动作：操作演示`,
            `【30秒脚本2】\n画面：细节展示\n台词：细节做工非常精致\n动作：特写镜头\n画面：对比展示\n台词：同价位性价比最高\n动作：手势对比`
          ],
          video30sPlus: [
            `【30秒+脚本】\n画面：开箱镜头\n台词：今天给大家开箱${topicsText}\n动作：打开包装\n画面：产品展示\n台词：外观设计非常漂亮\n动作：360度展示\n画面：功能演示\n台词：功能强大，体验流畅\n动作：演示功能\n画面：总结\n台词：这款产品值得入手\n动作：点赞收尾`
          ]
        };
      }

      contents.push({
        type: 'video15s',
        title: '15秒短视频脚本',
        contents: videoContents.video15s
      });
      contents.push({
        type: 'video30s',
        title: '30秒短视频脚本',
        contents: videoContents.video30s
      });
      contents.push({
        type: 'video30sPlus',
        title: '30秒+短视频脚本',
        contents: videoContents.video30sPlus
      });
    }

    res.json({
      success: true,
      contents
    });
  } catch (error) {
    console.error('生成内容错误:', error);
    res.status(500).json({
      success: false,
      message: '生成内容失败'
    });
  }
});

export default router;
