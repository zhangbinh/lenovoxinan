import { DAILY_TASK_CONFIGS } from '../types/operations-assistant';

interface DailyTask {
  id: number;
  storeId: string;
  taskType: 'publish_content' | 'interact_comments' | 'analyze_data' | 'optimize_content';
  taskTitle: string;
  taskDescription?: string;
  taskDate: string;
  isCompleted: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
  updatedAt: string;
}

interface TaskCheckin {
  id: number;
  taskId: number;
  storeId: string;
  checkinTime: string;
  notes?: string;
  createdAt: string;
}

interface WeeklyReview {
  id: number;
  storeId: string;
  weekStart: string;
  weekEnd: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageInteractRate: number;
  insights?: string;
  actionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentTemplate {
  id: number;
  templateName: string;
  platform: 'xiaohongshu' | 'douyin';
  contentType: 'copy' | 'script';
  titleTemplate: string;
  contentTemplate: string;
  coverTemplate?: string;
  usageTips?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 内存存储
let tasks: DailyTask[] = [];
let checkins: TaskCheckin[] = [];
let weeklyReviews: WeeklyReview[] = [];
let templates: ContentTemplate[] = [
  {
    id: 1,
    templateName: '小红书爆款文案模板1',
    platform: 'xiaohongshu',
    contentType: 'copy',
    titleTemplate: '【标题公式】数字+悬念+利益',
    contentTemplate: '【场景代入】（第1-2句）：描述使用场景，让用户产生代入感\n【痛点共鸣】（第3-4句）：指出用户痛点，引发情感共鸣\n【产品价值】（第5-7句）：展示产品如何解决问题\n【行动引导】（最后1-2句）：引导用户到店或购买\n\n到店转化：在文中加入"到店领礼品/专属价"等优惠钩子',
    coverTemplate: '【封面】：人+产品+情绪（展示产品使用场景，表情生动）',
    usageTips:
      '1. 标题使用"数字+悬念+利益"公式，例如："3个技巧让你的XX效率翻倍"\n2. 正文结构清晰，使用emoji增加可读性\n3. 结尾设置提问，引导用户评论\n4. 添加3-5个相关话题标签',
    tags: ['#好物分享', '#真实测评', '#使用心得'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    templateName: '小红书爆款文案模板2',
    platform: 'xiaohongshu',
    contentType: 'copy',
    titleTemplate: '【标题公式】冲突+解决方案+效果',
    contentTemplate: '【开篇冲突】：提出用户遇到的问题或困惑\n【痛点放大】：描述问题带来的困扰\n【方案引入】：介绍产品的解决方案\n【效果展示】：展示使用后的改变\n【行动引导】：引导用户到店体验\n\n到店转化：设置"限时优惠"制造紧迫感',
    coverTemplate: '【封面】：问题场景+产品解决方案（前后对比）',
    usageTips:
      '1. 使用"以前vs现在"的对比手法\n2. 用具体数据证明效果\n3. 添加真实用户反馈截图\n4. 强调限时优惠，刺激到店',
    tags: ['#避坑指南', '#好物推荐', '#真实体验'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    templateName: '抖音15秒脚本模板',
    platform: 'douyin',
    contentType: 'script',
    titleTemplate: '【黄金5秒结构】',
    contentTemplate: '0-3秒（钩子）：冲突/悬念/数字\n3-12秒（卖点）：核心卖点展示\n12-15秒（引导）：到店引导\n\n到店转化：结尾设置"到店领好礼"行动号召',
    coverTemplate: '【封面】：强视觉冲击+门店地址',
    usageTips:
      '1. 前3秒必须抓住注意力\n2. 中间快速展示核心卖点\n3. 结尾明确引导到店\n4. 挂载门店POI地址',
    tags: ['#抖音开店', '#到店引流', '#门店推广'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    templateName: '抖音30秒脚本模板',
    platform: 'douyin',
    contentType: 'script',
    titleTemplate: '【抖音完整结构】',
    contentTemplate: '0-3秒（钩子）：强钩子设置\n3-15秒（卖点）：核心卖点+使用场景\n15-27秒（痛点）：痛点解决方案\n27-30秒（引导）：到店引导\n\n到店转化：提供"线上预约享专属折扣"',
    coverTemplate: '【封面】：产品展示+优惠信息',
    usageTips:
      '1. 开头设置悬念或冲突\n2. 中间展示多个使用场景\n3. 结尾设置限时优惠\n4. 挂载门店POI，引导到店',
    tags: ['#抖音带货', '#本地生活', '#门店引流'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let taskIdCounter = 1;
let checkinIdCounter = 1;
let reviewIdCounter = 1;

export class OperationsAssistantService {
  // ========== 每日任务 ==========

  async generateDailyTasks(storeId: string, date: string): Promise<DailyTask[]> {
    // 检查当日是否已有任务
    const existingTasks = tasks.filter(
      (t) => t.storeId === storeId && t.taskDate === date
    );

    if (existingTasks.length > 0) {
      return existingTasks;
    }

    // 生成默认任务
    const taskConfigs = DAILY_TASK_CONFIGS.default;
    const newTasks: DailyTask[] = [];

    for (const config of taskConfigs) {
      const task: DailyTask = {
        id: taskIdCounter++,
        storeId,
        taskType: config.taskType,
        taskTitle: config.taskTitle,
        taskDescription: config.taskDescription,
        taskDate: date,
        isCompleted: false,
        priority: config.priority || 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newTasks.push(task);
      tasks.push(task);
    }

    return newTasks;
  }

  async getDailyTasks(storeId: string, date: string): Promise<DailyTask[]> {
    return tasks.filter((t) => t.storeId === storeId && t.taskDate === date).sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  async completeTask(taskId: number, notes?: string): Promise<{ task: DailyTask; checkin: TaskCheckin }> {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    // 更新任务状态
    tasks[taskIndex].isCompleted = true;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    // 创建打卡记录
    const checkin: TaskCheckin = {
      id: checkinIdCounter++,
      taskId,
      storeId: tasks[taskIndex].storeId,
      checkinTime: new Date().toISOString(),
      notes,
      createdAt: new Date().toISOString(),
    };
    checkins.push(checkin);

    return {
      task: tasks[taskIndex],
      checkin,
    };
  }

  async getTaskCheckins(taskId: number): Promise<TaskCheckin[]> {
    return checkins.filter((c) => c.taskId === taskId).sort((a, b) => {
      return new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime();
    });
  }

  // ========== 周度复盘 ==========

  async getWeeklyReview(storeId: string, weekStart: string): Promise<WeeklyReview | undefined> {
    return weeklyReviews.find(
      (r) => r.storeId === storeId && r.weekStart === weekStart
    );
  }

  async saveWeeklyReview(
    storeId: string,
    weekStart: string,
    weekEnd: string,
    data: {
      totalViews?: number;
      totalLikes?: number;
      totalComments?: number;
      totalShares?: number;
      averageInteractRate?: number;
      insights?: string;
      actionPlan?: string;
    }
  ): Promise<WeeklyReview> {
    const existingIndex = weeklyReviews.findIndex(
      (r) => r.storeId === storeId && r.weekStart === weekStart
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // 更新现有复盘
      weeklyReviews[existingIndex] = {
        ...weeklyReviews[existingIndex],
        weekEnd,
        totalViews: data.totalViews ?? weeklyReviews[existingIndex].totalViews,
        totalLikes: data.totalLikes ?? weeklyReviews[existingIndex].totalLikes,
        totalComments: data.totalComments ?? weeklyReviews[existingIndex].totalComments,
        totalShares: data.totalShares ?? weeklyReviews[existingIndex].totalShares,
        averageInteractRate: data.averageInteractRate ?? weeklyReviews[existingIndex].averageInteractRate,
        insights: data.insights ?? weeklyReviews[existingIndex].insights,
        actionPlan: data.actionPlan ?? weeklyReviews[existingIndex].actionPlan,
        updatedAt: now,
      };
      return weeklyReviews[existingIndex];
    } else {
      // 创建新复盘
      const review: WeeklyReview = {
        id: reviewIdCounter++,
        storeId,
        weekStart,
        weekEnd,
        totalViews: data.totalViews ?? 0,
        totalLikes: data.totalLikes ?? 0,
        totalComments: data.totalComments ?? 0,
        totalShares: data.totalShares ?? 0,
        averageInteractRate: data.averageInteractRate ?? 0,
        insights: data.insights,
        actionPlan: data.actionPlan,
        createdAt: now,
        updatedAt: now,
      };
      weeklyReviews.push(review);
      return review;
    }
  }

  async getWeeklyReviews(storeId: string, limit: number = 10): Promise<WeeklyReview[]> {
    return weeklyReviews
      .filter((r) => r.storeId === storeId)
      .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
      .slice(0, limit);
  }

  // ========== 爆款文案模板 ==========

  async getActiveTemplates(platform?: string, contentType?: string): Promise<ContentTemplate[]> {
    let result = templates.filter((t) => t.isActive);

    if (platform) {
      result = result.filter((t) => t.platform === platform);
    }

    if (contentType) {
      result = result.filter((t) => t.contentType === contentType);
    }

    return result.sort((a, b) => {
      // 按平台和内容类型排序
      if (a.platform !== b.platform) return a.platform.localeCompare(b.platform);
      if (a.contentType !== b.contentType) return a.contentType.localeCompare(b.contentType);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTemplateById(id: number): Promise<ContentTemplate | undefined> {
    return templates.find((t) => t.id === id);
  }
}

export const operationsAssistantService = new OperationsAssistantService();
