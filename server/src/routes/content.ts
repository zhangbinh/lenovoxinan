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
      // 生成小红书爆款文案（应用爆款公式）
      const xiaohongshuSystemPrompt = `你是一个专业的小红书爆款文案创作专家，擅长创作吸引用户注意、引发互动的高质量文案。

【小红书平台规则 - 必须严格遵守】
1. 禁止虚假宣传：不夸大功效、不使用"最""第一""绝对"等绝对化用语
2. 禁止诱导分享：不要求"转发朋友圈""分享到群""点赞才能看"
3. 禁止违规导流：不引导私信、不引导加群、不引导外链、不引导其他平台
4. 禁止刷量行为：不承诺"刷粉""刷赞""刷评论"
5. 禁止虚假承诺：不承诺"无效退款""终身免费"等无法兑现的内容
6. 禁止敏感话题：不涉及医疗、政治、色情等敏感领域
7. 禁止不正当竞争：不攻击竞品、不贬低同行
8. 必须真实可信：基于产品真实功能，实事求是
9. 必须合法合规：遵守《广告法》和平台社区规范

【小红书爆款公式】
【封面】：人+产品+情绪
【标题】：数字+悬念+利益
【正文】：场景代入→痛点共鸣→产品价值→行动引导
【互动】：设问征集，引导评论

请根据选中的话题，创作3条小红书爆款文案，每条文案要求：
1. 【封面建议】：明确人、产品、情绪元素
2. 【标题设计】：使用"数字+悬念+利益"公式，例如："3个技巧让你的XX效率翻倍"、"90%的人都不知道的XX秘密"
3. 【正文结构】：场景代入（第1-2句）→痛点共鸣（第3-4句）→产品价值（第5-7句）→行动引导（最后1-2句）
4. 【互动引导】：结尾设置提问，引导用户评论
5. 【合规要求】：严格遵守平台规则，不使用绝对化用语，不诱导分享，不违规导流
6. 字数控制在250-350字之间
7. 使用emoji表情增加吸引力
8. 包含3-5个相关话题标签
9. 【到店转化】：在文中或结尾加入"到店领礼品/专属价"等优惠钩子（但不要过度营销）
10. 输出格式必须是有效的JSON数组

输出格式示例：
[
  "标题\\n\\n正文内容...\\n\\n#话题标签",
  "标题\\n\\n正文内容...\\n\\n#话题标签",
  "标题\\n\\n正文内容...\\n\\n#话题标签"
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
      // 生成短视频脚本（应用黄金5秒结构）
      const videoSystemPrompt = `你是一个专业的短视频脚本创作专家，擅长创作节奏紧凑、内容有趣、易于传播的短视频脚本。

【抖音平台规则 - 必须严格遵守】
1. 禁止虚假宣传：不夸大效果、不使用"最""第一""绝对"等绝对化用语
2. 禁止低俗内容：不涉及色情、擦边、低俗玩笑
3. 禁止诱导互动：不要求"强制关注""双击才能看""点赞有奖"
4. 禁止违规导流：不引导私信、不引导加群、不引导外链、不引导微信
5. 禁止虚假承诺：不承诺"无效退款""终身免费""100%成功"等无法兑现的内容
6. 禁止敏感话题：不涉及医疗、政治、宗教、色情等敏感领域
7. 禁止抄袭搬运：不直接复制他人视频内容
8. 必须真实可信：基于产品真实功能，实事求是
9. 必须合法合规：遵守《广告法》和平台社区规范
10. 禁止虚假数据：不编造销量、评价、使用人数等数据

【抖音脚本结构（黄金5秒）】
前3秒：强钩子（冲突/悬念/数字）
3-15秒：核心卖点展示
15-60秒：使用场景+痛点解决
结尾：互动引导+关注引导

【到店转化】
- 【优惠钩子】：在脚本中加入"到店领礼品/专属价"
- 【地址前置】：在开头或封面展示门店位置
- 【限时紧迫】：设置活动截止日期
- 【POI挂载】提醒挂载门店地址

请根据选中的话题，创作以下短视频脚本：
1. 15秒短视频脚本 × 3条（强钩子+核心卖点+结尾引导）
2. 30秒短视频脚本 × 2条（强钩子+核心卖点+使用场景+结尾引导）
3. 60秒短视频脚本 × 1条（完整结构+痛点解决+行动引导）

每条脚本要求：
1. 【前3秒】必须设置强钩子：冲突、悬念或数字
2. 【3-15秒】展示产品核心卖点，节奏紧凑
3. 【15-60秒】展示使用场景和痛点解决
4. 【结尾】互动引导+关注引导（但不强制要求，不诱导）
5. 【合规要求】：严格遵守平台规则，不使用绝对化用语，不诱导互动，不违规导流
6. 包含画面描述、台词、动作、时间节点
7. 加入到店转化元素（优惠钩子/地址/限时）但不过度营销
8. 积极导向，合法合规
9. 输出格式必须是有效的JSON对象

输出格式示例：
{
  "video15s": [
    "【15秒脚本1】\\n0-3秒（钩子）：画面/台词/动作\\n3-12秒（卖点）：画面/台词/动作\\n12-15秒（引导）：画面/台词/动作",
    "【15秒脚本2】\\n0-3秒（钩子）：画面/台词/动作\\n3-12秒（卖点）：画面/台词/动作\\n12-15秒（引导）：画面/台词/动作",
    "【15秒脚本3】\\n0-3秒（钩子）：画面/台词/动作\\n3-12秒（卖点）：画面/台词/动作\\n12-15秒（引导）：画面/台词/动作"
  ],
  "video30s": [
    "【30秒脚本1】\\n0-3秒（钩子）：画面/台词/动作\\n3-15秒（卖点）：画面/台词/动作\\n15-27秒（场景）：画面/台词/动作\\n27-30秒（引导）：画面/台词/动作",
    "【30秒脚本2】\\n0-3秒（钩子）：画面/台词/动作\\n3-15秒（卖点）：画面/台词/动作\\n15-27秒（场景）：画面/台词/动作\\n27-30秒（引导）：画面/台词/动作"
  ],
  "video60s": [
    "【60秒脚本】\\n0-3秒（钩子）：画面/台词/动作\\n3-15秒（卖点）：画面/台词/动作\\n15-45秒（场景+痛点）：画面/台词/动作\\n45-60秒（引导+行动）：画面/台词/动作"
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
        video60s: []
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
        if (videoContents.video60s) {
          videoContents.video60s = videoContents.video60s.map((item: any) => String(item));
        }
      } catch (error) {
        console.error('解析短视频内容失败，使用默认脚本，原始内容:', videoResponse.content);
        // 如果解析失败，返回默认脚本
        videoContents = {
          video15s: [
            `【15秒脚本1】\n0-3秒（钩子）：画面：数字3展示，台词：3个理由让你选择${topicsText}，动作：手指计数\n3-12秒（卖点）：画面：产品特写，台词：性能强、颜值高、性价比优，动作：展示亮点\n12-15秒（引导）：画面：门店地址，台词：到店享专属优惠，动作：指引方向`,
            `【15秒脚本2】\n0-3秒（钩子）：画面：惊讶表情，台词：没想到${topicsText}这么好用，动作：震惊手势\n3-12秒（卖点）：画面：使用场景，台词：日常使用完全够用，操作简单，动作：演示操作\n12-15秒（引导）：画面：关注图标，台词：点赞关注不迷路，动作：双击点赞`,
            `【15秒脚本3】\n0-3秒（钩子）：画面：价格对比，台词：90%的人都选错了，台词展示，动作：摇头叹气\n3-12秒（卖点）：画面：产品细节，台词：细节做工精致，同价位最高，动作：特写镜头\n12-15秒（引导）：画面：到店提示，台词：限时优惠到店领取，动作：时间提醒`
          ],
          video30s: [
            `【30秒脚本1】\n0-3秒（钩子）：画面：冲突场景，台词：你是不是也在纠结选哪个？，动作：困扰表情\n3-15秒（卖点）：画面：产品展示，台词：推荐这款${topicsText}，性能强劲颜值在线，动作：360度展示\n15-27秒（场景）：画面：日常使用，台词：办公、娱乐都能轻松应对，动作：多场景切换\n27-30秒（引导）：画面：门店地址，台词：地址在XX路XX号，到店有礼，动作：地址指引`,
            `【30秒脚本2】\n0-3秒（钩子）：画面：悬念设置，台词：今天分享一个隐藏功能，台词神秘，动作：捂嘴手势\n3-15秒（卖点）：画面：功能演示，台词：${topicsText}这个功能太实用了，动作：操作演示\n15-27秒（场景）：画面：痛点解决，台词：再也不用担心XX问题，动作：满意表情\n27-30秒（引导）：画面：限时提示，台词：活动本周末结束，抓紧时间，动作：日历标记`
          ],
          video60s: [
            `【60秒脚本】\n0-3秒（钩子）：画面：数据展示，台词：用${topicsText}3个月，效率提升50%，动作：数据图表\n3-15秒（卖点）：画面：核心优势，台词：为什么能提升效率？因为这些功能，动作：逐一展示\n15-45秒（场景+痛点）：画面：痛点场景，台词：以前XX问题让我头疼，现在轻松解决，动作：前后对比\n45-60秒（引导+行动）：画面：到店引导，台词：想体验吗？到店还有专属优惠，地址在XX路XX号，POI已挂载，动作：最后引导`
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
        type: 'video60s',
        title: '60秒短视频脚本',
        contents: videoContents.video60s
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
