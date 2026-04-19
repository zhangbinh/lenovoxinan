// 各平台投流规则模板（含到店转化建议）

export interface PlatformRule {
  platform: string;
  displayName: string;
  rules: Rule[];
  timing: string[];
  targeting: string[];
  budget: string;
  tips: string[];
  recommendation: Recommendation;
  offlineConversion?: OfflineConversion; // 到店转化建议
}

export interface Recommendation {
  decision: string;
  tool?: string;
  scope?: string;
  notice: string;
}

export interface OfflineConversion {
  // 线上到线下转化策略
  strategies: string[];
  // 优惠活动设计
  offerDesign: string[];
  // POI挂载提醒
  poiReminders: string[];
  // 到店核销机制
  verification: string[];
}

export interface Rule {
  condition: string;
  advice: string;
  action: 'continue' | 'adjust' | 'stop';
}

export const platformRules: Record<string, PlatformRule> = {
  douyin: {
    platform: 'douyin',
    displayName: '抖音',
    rules: [
      {
        condition: '发布1天内，播放量 > 10000',
        advice: '流量表现优秀，建议立即开启DOU+投流',
        action: 'continue',
      },
      {
        condition: '发布1天内，完播率 > 40%',
        advice: '内容质量高，适合持续投流',
        action: 'continue',
      },
      {
        condition: '发布1天内，互动率 > 5%',
        advice: '用户参与度高，建议加大投流预算',
        action: 'continue',
      },
      {
        condition: '发布1天内，播放量 < 1000',
        advice: '初始流量偏低，建议优化封面或标题后再投流',
        action: 'adjust',
      },
      {
        condition: '发布3-7天，播放量增长率 > 50%',
        advice: '内容有持续热度，建议延长投流周期',
        action: 'continue',
      },
      {
        condition: '发布7天后，播放量增长停滞',
        advice: '内容热度已过，建议停止投流，创作新内容',
        action: 'stop',
      },
    ],
    timing: ['黄金时段：12:00-14:00', '晚间高峰：19:00-22:00', '工作日早晨：07:00-09:00'],
    targeting: ['25-35岁', '一二线城市', '关注数码/科技的用户', '有消费能力的用户'],
    budget: '建议初始预算100-300元，根据效果逐步增加',
    tips: [
      '前24小时是流量黄金期，投流效果最好',
      '选择"达人相似"定向，找到精准受众',
      '投流时长建议12-24小时，避免浪费',
      '测试不同封面，选择点击率高的版本',
    ],
    recommendation: {
      decision: '如果视频在发布后6小时内播放量突破5000且完播率超过30%，建议立即开启投流。如果24小时后播放量仍低于1000，建议放弃投流，优化内容后重新发布。',
      tool: '播放量 < 5000 时使用 DOU+；播放量 > 5000 时使用巨量引擎。DOU+适合快速测试，巨量引擎适合规模化投放。',
      notice: '注意观察投流前3小时的数据，如果ROI低于0.5，及时停止。避免在凌晨2-6点投流，该时段效果最差。',
    },
    // 抖音到店转化建议
    offlineConversion: {
      strategies: [
        '在视频开头展示门店地址或POI信息',
        '结尾设置"到店领好礼"行动号召',
        '评论区置顶门店位置和营业时间',
        '使用"同城流量"定向投放，覆盖周边5km人群',
        '视频中展示门店环境和服务，增强信任感',
      ],
      offerDesign: [
        '设计"到店领取精美礼品"引流活动',
        '提供"线上预约享专属折扣"激励到店',
        '设置"限时优惠"制造紧迫感，如"本周末到店享8折"',
        '推出"扫码关注立减XX元"核销机制',
        '准备"新用户首单半价"等吸引力强的优惠',
      ],
      poiReminders: [
        '⚠️ 必须挂载门店POI地址，提升本地曝光',
        '在视频结尾显示"点击定位查看门店位置"提示',
        '确保POI地址信息准确，包含营业时间',
        '定期检查POI的评分和评论，维护门店口碑',
        '在POI页面上传门店环境图和产品图',
      ],
      verification: [
        '准备核销工具（扫码器/小程序），记录到店转化数据',
        '设置核销员，引导用户完成核销流程',
        '收集到店用户信息，建立客户档案',
        '分析核销数据，优化到店转化策略',
        '对已到店用户进行二次营销，提升复购率',
      ],
    },
  },
  xiaohongshu: {
    platform: 'xiaohongshu',
    displayName: '小红书',
    rules: [
      {
        condition: '发布1天内，曝光量 > 5000',
        advice: '初始曝光良好，建议开启薯条推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，点赞率 > 10%',
        advice: '内容受欢迎，适合继续推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，收藏率 > 2%',
        advice: '种草价值高，建议加大推广力度',
        action: 'continue',
      },
      {
        condition: '发布1天内，用户停留时长 > 3秒',
        advice: '内容吸引力强，投流转化会很好',
        action: 'continue',
      },
      {
        condition: '发布3天内，互动量持续增长',
        advice: '内容有长尾效应，建议延长推广周期',
        action: 'continue',
      },
      {
        condition: '发布5天后，无新增互动',
        advice: '内容已过时效，建议停止推广，准备新内容',
        action: 'stop',
      },
    ],
    timing: ['晚间高峰：20:00-23:00', '周末全天', '工作日午休：12:00-13:00'],
    targeting: ['18-35岁女性', '一二线城市', '关注美妆/数码/生活的用户', '有购物需求用户'],
    budget: '建议初始预算50-200元，薯条性价比高',
    tips: [
      '种草内容适合投流，转化效果好',
      '选择"兴趣人群"定向，精准触达目标用户',
      '投流时长建议24-48小时，小红书长尾效应强',
      '优质笔记可以获得平台推荐，减少投流依赖',
    ],
    recommendation: {
      decision: '如果笔记发布后24小时内曝光量超过3000且点赞率超过10%，建议开启薯条推广。如果48小时后曝光量仍低于500，不建议投流，需要优化内容或重新发布。',
      scope: '优先投本地同城流量，成本更低且转化率更高。如果产品适合全国推广，再考虑投全国流量。本地推广适合线下门店转化，全国推广适合线上带货。',
      notice: '小红书投流重点是"种草"而非"销售"，不要直接硬广。关注笔记的收藏和评论数据，这些是转化的关键指标。',
    },
    // 小红书到店转化建议
    offlineConversion: {
      strategies: [
        '在笔记标题中添加门店位置信息，如"XX店实拍"',
        '在正文中描述门店地址和交通便利性',
        '添加"到店打卡"话题标签，引导用户线下互动',
        '在评论区回复中提供门店具体位置和到店指引',
        '投放"同城流量"精准触达周边潜在客户',
      ],
      offerDesign: [
        '设计"到店领取限定礼品"引流活动，提升到店意愿',
        '提供"笔记截图享专属折扣"的核销机制',
        '设置"限时到店福利"，如"本周到店送XX"',
        '推出"小红书粉丝专享价"，增强用户身份认同',
        '准备"打卡集赞返现"等互动性强的活动',
      ],
      poiReminders: [
        '⚠️ 必须在笔记中标注门店位置，利用位置流量的红利',
        '在笔记结尾添加"📍地址：XX路XX号"信息',
        '确保门店营业时间信息清晰可见',
        '定期更新门店环境图片，吸引用户到店探店',
        '在门店环境中设置小红书拍照打卡点',
      ],
      verification: [
        '准备核销工具，记录用户通过小红书到店的数据',
        '培训店员识别小红书用户，提供专属服务',
        '设置"小红书用户到店礼"，提升用户体验',
        '收集用户反馈，优化到店服务流程',
        '对到店用户引导发布种草笔记，形成口碑裂变',
      ],
    },
  },
  zhihu: {
    platform: 'zhihu',
    displayName: '知乎',
    rules: [
      {
        condition: '发布1天内，阅读量 > 2000',
        advice: '内容获得关注，建议开启知乎推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，赞同率 > 5%',
        advice: '内容质量高，值得继续推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，评论数 > 10',
        advice: '话题性强，推广效果会很好',
        action: 'continue',
      },
      {
        condition: '发布3天内，阅读量持续增长',
        advice: '内容有长尾价值，建议延长推广周期',
        action: 'continue',
      },
      {
        condition: '发布7天后，阅读量增长缓慢',
        advice: '话题热度已退，建议停止推广，准备新内容',
        action: 'stop',
      },
    ],
    timing: ['工作日：09:00-18:00', '晚间：20:00-23:00', '周末：10:00-22:00'],
    targeting: ['20-40岁', '一二线城市', '关注科技/数码的用户', '高知人群'],
    budget: '建议初始预算200-500元，知乎流量成本较高',
    tips: [
      '专业内容更适合知乎，推广效果更好',
      '选择"关注话题"定向，找到感兴趣的用户',
      '知乎长尾效应强，内容可持续获得流量',
      '结合热点话题，提升推广效果',
    ],
    recommendation: {
      decision: '如果回答发布后24小时内阅读量超过2000且赞同率超过5%，建议开启知乎推荐。如果7天后阅读量仍低于1000，不建议继续推广，需要优化内容质量或调整话题方向。',
      scope: '优先投相关话题和兴趣标签，精准定位目标用户。知乎用户更注重内容质量，不要过度追求曝光量而忽视内容深度。',
      notice: '知乎投流重点是"建立专业形象"和"获取精准流量"，不要直接硬广。关注回答的赞同和评论数据，这些是质量的重要指标。',
    },
    // 知乎到店转化建议（针对专业场景）
    offlineConversion: {
      strategies: [
        '在回答结尾添加门店地址和联系方式',
        '设计"到店咨询享专业服务"的价值主张',
        '在私信中提供到店预约服务',
        '针对高价值用户提供线下体验邀请',
        '利用知乎用户的信任感，建立长期合作关系',
      ],
      offerDesign: [
        '提供"知乎粉丝到店咨询享折扣"活动',
        '设置"专业诊断到店服务"，吸引用户到店',
        '推出"线上答疑+线下体验"的组合服务',
        '准备"行业报告白皮书"等高价值到店礼品',
        '建立"知乎用户VIP服务"体系',
      ],
      poiReminders: [
        '在个人简介中展示门店位置',
        '在回答中自然融入门店信息，避免硬广',
        '确保联系方式准确，方便用户预约',
        '定期更新门店专业设备和环境展示',
        '邀请用户到店体验，增加专业背书',
      ],
      verification: [
        '记录知乎用户的到店咨询数据',
        '提供专业的到店咨询服务',
        '收集用户反馈，持续优化服务质量',
        '建立用户档案，进行精准二次营销',
        '鼓励用户在知乎分享到店体验，形成口碑',
      ],
    },
  },
  toutiao: {
    platform: 'toutiao',
    displayName: '今日头条',
    rules: [
      {
        condition: '发布1小时内，展现量 > 5000',
        advice: '初始展现良好，建议开启推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，阅读率 > 10%',
        advice: '标题吸引力强，适合继续推广',
        action: 'continue',
      },
      {
        condition: '发布1天内，互动率 > 3%',
        advice: '用户参与度高，推广效果好',
        action: 'continue',
      },
      {
        condition: '发布3天内，阅读量持续增长',
        advice: '内容有持续热度，建议延长推广周期',
        action: 'continue',
      },
      {
        condition: '发布5天后，阅读量增长停滞',
        advice: '内容热度已过，建议停止推广',
        action: 'stop',
      },
    ],
    timing: ['早晨：07:00-09:00', '中午：12:00-14:00', '晚间：18:00-22:00'],
    targeting: ['25-50岁', '一二三线城市', '关注科技/新闻的用户', '广泛人群'],
    budget: '建议初始预算100-300元，头条流量成本适中',
    tips: [
      '标题是关键，优化标题提升点击率',
      '选择"兴趣人群"定向，精准触达用户',
      '头条算法推荐强，优质内容可获得自然流量',
      '结合热点事件，提升推广效果',
    ],
    recommendation: {
      decision: '如果文章发布后24小时内阅读量超过5000且互动率超过3%，建议开启头条推广。如果5天后阅读量仍低于2000，不建议继续推广，需要优化标题和内容结构。',
      scope: '优先投兴趣人群和地域定向，提升精准度。今日头条用户广泛，适合品牌曝光和流量获取，但需要注意内容质量和吸引力。',
      notice: '今日头条投流重点是"获取广泛曝光"和"提升品牌知名度"，可以适当使用夸张标题但不要虚假宣传。关注阅读完成率和互动率，这些是内容质量的重要指标。',
    },
    // 今日头条到店转化建议
    offlineConversion: {
      strategies: [
        '在文章结尾添加门店地址和到店指引',
        '设计"到店享受更多服务"的转化钩子',
        '在评论区回复中引导用户到店咨询',
        '结合本地新闻话题，提升门店本地曝光',
        '使用"地域定向"覆盖周边潜在客户',
      ],
      offerDesign: [
        '设计"文章截图享到店优惠"活动',
        '提供"今日头条粉丝专属福利"',
        '设置"限时到店活动"，制造紧迫感',
        '推出"到店免费咨询"引流服务',
        '准备"签到有礼"等互动活动',
      ],
      poiReminders: [
        '在文章中自然融入门店位置信息',
        '确保门店营业时间清晰可见',
        '提供详细的到店路线指引',
        '定期更新门店活动和优惠信息',
        '在门店环境设置今日头条打卡元素',
      ],
      verification: [
        '记录头条用户的到店来源数据',
        '提供优质到店服务，提升用户体验',
        '收集用户反馈，优化到店流程',
        '建立用户档案，进行精准营销',
        '鼓励用户在今日头条分享到店体验',
      ],
    },
  },
};

// 根据发布天数和匹配规则生成投流建议
export function generateAdvice(
  platform: string,
  daysSincePublish: number,
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    completionRate?: number;
    readRate?: number;
    interactRate?: number;
    collectRate?: number;
  }
): {
  shouldPromote: boolean;
  advice: string[];
  budget: string;
  timing: string[];
  targeting: string[];
  tips: string[];
  platform: string;
  recommendation: Recommendation;
  offlineConversion?: OfflineConversion;
} {
  const rule = platformRules[platform];
  if (!rule) {
    return {
      shouldPromote: false,
      advice: ['暂不支持该平台的投流建议'],
      budget: '',
      timing: [],
      targeting: [],
      tips: [],
      platform,
      recommendation: {
        decision: '暂不支持该平台的投流建议',
        notice: '请联系技术团队添加该平台支持',
      },
    };
  }

  const matchedRules = rule.rules.filter((r) => {
    // 简化匹配逻辑，实际应用中需要更复杂的条件判断
    if (daysSincePublish <= 1) {
      // 发布1天内
      return (
        (metrics.views && metrics.views > 1000) ||
        (metrics.completionRate && metrics.completionRate > 30) ||
        (metrics.interactRate && metrics.interactRate > 3) ||
        (metrics.readRate && metrics.readRate > 5)
      );
    } else if (daysSincePublish <= 3) {
      // 发布3天内
      return metrics.views && metrics.views > 1000;
    } else if (daysSincePublish <= 7) {
      // 发布7天内
      return metrics.views && metrics.views > 5000;
    } else {
      // 发布7天后
      return false;
    }
  });

  const shouldPromote = matchedRules.some((r) => r.action === 'continue');

  return {
    shouldPromote,
    advice: matchedRules.map((r) => r.advice),
    budget: rule.budget,
    timing: rule.timing,
    targeting: rule.targeting,
    tips: rule.tips,
    platform,
    recommendation: rule.recommendation,
    offlineConversion: rule.offlineConversion, // 包含到店转化建议
  };
}
