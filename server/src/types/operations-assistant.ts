// 运营助手模块类型定义

export interface DailyTask {
  id: number;
  storeId: string;
  taskType: 'publish_content' | 'interact_comments' | 'analyze_data' | 'optimize_content';
  taskTitle: string;
  taskDescription?: string;
  taskDate: string; // YYYY-MM-DD
  isCompleted: boolean;
  priority: 1 | 2 | 3; // 1-高, 2-中, 3-低
  createdAt: string;
  updatedAt: string;
}

export interface TaskCheckin {
  id: number;
  taskId: number;
  storeId: string;
  checkinTime: string;
  notes?: string;
  createdAt: string;
}

export interface WeeklyReview {
  id: number;
  storeId: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
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

export interface ContentTemplate {
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

export interface DailyTaskInput {
  storeId: string;
  taskType: 'publish_content' | 'interact_comments' | 'analyze_data' | 'optimize_content';
  taskTitle: string;
  taskDescription?: string;
  taskDate: string;
  priority?: 1 | 2 | 3;
}

export interface TaskCheckinInput {
  taskId: number;
  storeId: string;
  notes?: string;
}

export interface WeeklyReviewInput {
  storeId: string;
  weekStart: string;
  weekEnd: string;
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
  totalShares?: number;
  averageInteractRate?: number;
  insights?: string;
  actionPlan?: string;
}

export interface ContentTemplateInput {
  templateName: string;
  platform: 'xiaohongshu' | 'douyin';
  contentType: 'copy' | 'script';
  titleTemplate: string;
  contentTemplate: string;
  coverTemplate?: string;
  usageTips?: string;
  tags?: string[];
}

// 每日任务配置
export const DAILY_TASK_CONFIGS: Record<
  string,
  Array<{
    taskType: 'publish_content' | 'interact_comments' | 'analyze_data' | 'optimize_content';
    taskTitle: string;
    taskDescription?: string;
    priority?: 1 | 2 | 3;
  }>
> = {
  default: [
    {
      taskType: 'publish_content',
      taskTitle: '发布1条内容',
      taskDescription: '发布1条小红书笔记或抖音视频',
      priority: 1,
    },
    {
      taskType: 'publish_content',
      taskTitle: '发布1条内容',
      taskDescription: '发布1条小红书笔记或抖音视频',
      priority: 1,
    },
    {
      taskType: 'interact_comments',
      taskTitle: '互动评论10条',
      taskDescription: '在同类内容下评论互动，提升账号活跃度',
      priority: 2,
    },
    {
      taskType: 'analyze_data',
      taskTitle: '分析昨日数据',
      taskDescription: '查看昨日发布内容的数据表现',
      priority: 2,
    },
  ],
};
