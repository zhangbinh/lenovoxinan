// 投流建议定时任务
import cron from 'node-cron';
import { FetchClient, Config } from 'coze-coding-dev-sdk';
import { generateAdvice } from '../lib/promotion-rules';

// 内存存储（实际应用中应使用数据库）
export interface PublishedContent {
  id: string;
  storeId: string;
  publishUrl: string;
  platform: string;
  publishDate: Date;
  adviceCount: number;
}

export interface PromotionAdvice {
  id: string;
  contentId: string;
  storeId: string;
  advice: any;
  createdAt: Date;
}

const publishedContents = new Map<string, PublishedContent>();
const promotionAdvices = new Map<string, PromotionAdvice[]>();

// 添加已发布内容
export function addPublishedContent(content: PublishedContent) {
  publishedContents.set(content.id, content);
}

// 获取所有已发布内容（用于API）
export function getAllPublishedContents() {
  return publishedContents;
}

// 获取已发布内容
export function getPublishedContent(contentId: string) {
  return publishedContents.get(contentId);
}

// 获取投流建议
export function getPromotionAdvices(contentId: string) {
  return promotionAdvices.get(contentId) || [];
}

// 生成投流建议
async function generateAdviceForContent(content: PublishedContent): Promise<any> {
  try {
    const config = new Config();
    const client = new FetchClient(config);

    // 计算发布天数
    const now = Date.now();
    const daysSincePublish = Math.floor((now - content.publishDate.getTime()) / (1000 * 60 * 60 * 24));

    // 如果发布超过15天，不再提供建议
    if (daysSincePublish > 15) {
      return null;
    }

    // 抓取数据
    let metrics = {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      completionRate: 0,
      readRate: 0,
      interactRate: 0,
      collectRate: 0,
    };

    try {
      const response = await client.fetch(content.publishUrl);

      // 简化处理，使用模拟数据
      const textLength = response.content
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('')
        .length;

      metrics = {
        views: Math.floor(textLength * 10 + Math.random() * 5000),
        likes: Math.floor(metrics.views * (0.02 + Math.random() * 0.08)),
        comments: Math.floor(metrics.views * (0.005 + Math.random() * 0.02)),
        shares: Math.floor(metrics.views * (0.001 + Math.random() * 0.01)),
        completionRate: 30 + Math.random() * 40,
        readRate: 5 + Math.random() * 15,
        interactRate: 2 + Math.random() * 8,
        collectRate: 1 + Math.random() * 5,
      };
    } catch (error) {
      console.error('抓取失败，使用模拟数据:', error);
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

    // 生成投流建议
    const advice = generateAdvice(content.platform, daysSincePublish, metrics);

    return {
      ...advice,
      daysSincePublish,
      metrics: {
        views: metrics.views,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
      },
    };
  } catch (error) {
    console.error('生成投流建议失败:', error);
    return null;
  }
}

// 定时任务：每天20点执行
export function startPromotionCronJob() {
  // 每天晚上20点执行
  cron.schedule('0 20 * * *', async () => {
    console.log('开始执行投流建议定时任务...');

    const now = Date.now();

    // 遍历所有已发布内容
    for (const [contentId, content] of publishedContents.entries()) {
      const daysSincePublish = Math.floor((now - content.publishDate.getTime()) / (1000 * 60 * 60 * 24));

      // 如果发布未满15天，生成投流建议
      if (daysSincePublish <= 15) {
        console.log(`为内容 ${contentId} 生成投流建议...`);

        const advice = await generateAdviceForContent(content);

        if (advice) {
          // 保存投流建议
          if (!promotionAdvices.has(contentId)) {
            promotionAdvices.set(contentId, []);
          }

          const advices = promotionAdvices.get(contentId)!;
          advices.push({
            id: `${contentId}-${Date.now()}`,
            contentId,
            storeId: content.storeId,
            advice,
            createdAt: new Date(),
          });

          // 更新内容建议计数
          content.adviceCount = advices.length;

          console.log(`内容 ${contentId} 投流建议生成成功`);
        }
      }
    }

    console.log('投流建议定时任务执行完成');
  });

  console.log('投流建议定时任务已启动，将在每天20:00执行');
}

// 手动触发投流建议生成（用于测试）
export async function triggerPromotionAdvice() {
  console.log('手动触发投流建议生成...');

  const now = Date.now();
  const results = [];

  for (const [contentId, content] of publishedContents.entries()) {
    const daysSincePublish = Math.floor((now - content.publishDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePublish <= 15) {
      console.log(`为内容 ${contentId} 生成投流建议...`);

      const advice = await generateAdviceForContent(content);

      if (advice) {
        if (!promotionAdvices.has(contentId)) {
          promotionAdvices.set(contentId, []);
        }

        const advices = promotionAdvices.get(contentId)!;
        advices.push({
          id: `${contentId}-${Date.now()}`,
          contentId,
          storeId: content.storeId,
          advice,
          createdAt: new Date(),
        });

        content.adviceCount = advices.length;

        results.push({
          contentId,
          advice,
        });

        console.log(`内容 ${contentId} 投流建议生成成功`);
      }
    }
  }

  return results;
}
