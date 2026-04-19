// 各平台投流规则模板

export interface PlatformRule {
  platform: string;
  displayName: string;
  rules: Rule[];
  timing: string[];
  targeting: string[];
  budget: string;
  tips: string[];
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
  };
}
