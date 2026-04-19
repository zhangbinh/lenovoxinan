import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 平台数据指标接口
 */
export interface PlatformMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  collectRate: number;
  interactRate: number;
  completionRate: number;
}

/**
 * 小红书API响应数据
 */
interface XiaohongshuResponse {
  code: number;
  msg: string;
  data: {
    view_count: number;
    liked_count: number;
    comment_count: number;
    share_count: number;
    collected_count?: number;
    completion_rate?: number;
  };
}

/**
 * 抖音API响应数据
 */
interface DouyinResponse {
  data: {
    item_id: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    share_count: number;
    collect_count: number;
    completion_rate?: number;
    interact_rate?: number;
  };
}

/**
 * 社交平台数据服务
 */
class SocialPlatformService {
  /**
   * 从小红书URL提取笔记ID
   */
  private extractXiaohongshuNoteId(url: string): string {
    // 支持多种URL格式
    const patterns = [
      /xiaohongshu\.com\/explore\/([^\/\?]+)/,
      /xhslink\.com\/([a-zA-Z0-9]+)/,
      /xiaohongshu\.com\/discovery\/item\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return '';
  }

  /**
   * 从抖音URL提取视频ID
   */
  private extractDouyinVideoId(url: string): string {
    // 支持多种URL格式
    const patterns = [
      /douyin\.com\/video\/([^\/\?]+)/,
      /v\.douyin\.com\/([a-zA-Z0-9]+)/,
      /iesdouyin\.com\/share\/video\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return '';
  }

  /**
   * 判断URL平台类型
   */
  private detectPlatform(url: string): 'xiaohongshu' | 'douyin' | 'unknown' {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('xiaohongshu.com') || lowerUrl.includes('xhslink.com')) {
      return 'xiaohongshu';
    } else if (lowerUrl.includes('douyin.com') || lowerUrl.includes('v.douyin.com')) {
      return 'douyin';
    }

    return 'unknown';
  }

  /**
   * 获取小红书Access Token
   */
  private async getXiaohongshuAccessToken(): Promise<string> {
    // 如果环境变量中有配置，直接使用
    if (process.env.XIAOHONGSHU_ACCESS_TOKEN) {
      return process.env.XIAOHONGSHU_ACCESS_TOKEN;
    }

    // 否则需要通过OAuth流程获取
    throw new Error('请配置XIAOHONGSHU_ACCESS_TOKEN环境变量，或实现OAuth认证流程');
  }

  /**
   * 获取抖音Access Token
   */
  private async getDouyinAccessToken(): Promise<string> {
    // 如果环境变量中有配置，直接使用
    if (process.env.DOUYIN_ACCESS_TOKEN) {
      return process.env.DOUYIN_ACCESS_TOKEN;
    }

    // 否则需要通过OAuth流程获取
    throw new Error('请配置DOUYIN_ACCESS_TOKEN环境变量，或实现OAuth认证流程');
  }

  /**
   * 获取小红书数据
   */
  async getXiaohongshuMetrics(url: string): Promise<PlatformMetrics> {
    const noteId = this.extractXiaohongshuNoteId(url);
    if (!noteId) {
      throw new Error('无法从URL中提取笔记ID');
    }

    try {
      const accessToken = await this.getXiaohongshuAccessToken();

      // 获取笔记互动数据
      const response = await axios.get<XiaohongshuResponse>(
        `https://edith.xiaohongshu.com/api/sns/v2/note/${noteId}/stat`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10秒超时
        }
      );

      if (response.data.code !== 0) {
        throw new Error(`小红书API返回错误: ${response.data.msg}`);
      }

      const data = response.data.data;

      return {
        views: data.view_count || 0,
        likes: data.liked_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        collectRate: data.collected_count && data.view_count > 0
          ? (data.collected_count / data.view_count) * 100
          : 0,
        interactRate: data.liked_count && data.view_count > 0
          ? ((data.liked_count + data.comment_count) / data.view_count) * 100
          : 0,
        completionRate: data.completion_rate || 0,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('小红书API调用失败:', error.response?.data || error.message);
        throw new Error(`获取小红书数据失败: ${error.message}`);
      }
      console.error('获取小红书数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取抖音数据
   */
  async getDouyinMetrics(url: string): Promise<PlatformMetrics> {
    const itemId = this.extractDouyinVideoId(url);
    if (!itemId) {
      throw new Error('无法从URL中提取视频ID');
    }

    try {
      const accessToken = await this.getDouyinAccessToken();

      // 获取视频互动数据
      const response = await axios.get<DouyinResponse>(
        'https://open.douyin.com/data/external/item/item_comment_data/',
        {
          params: {
            access_token: accessToken,
            item_id: itemId,
          },
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10秒超时
        }
      );

      const data = response.data.data;

      return {
        views: data.view_count || 0,
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        collectRate: data.collect_count && data.view_count > 0
          ? (data.collect_count / data.view_count) * 100
          : 0,
        interactRate: data.interact_rate || 0,
        completionRate: data.completion_rate || 0,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('抖音API调用失败:', error.response?.data || error.message);
        throw new Error(`获取抖音数据失败: ${error.message}`);
      }
      console.error('获取抖音数据失败:', error);
      throw error;
    }
  }

  /**
   * 根据URL自动获取数据
   */
  async getMetrics(url: string): Promise<PlatformMetrics> {
    const platform = this.detectPlatform(url);

    if (platform === 'xiaohongshu') {
      console.log('检测到小红书URL，获取数据...');
      return this.getXiaohongshuMetrics(url);
    } else if (platform === 'douyin') {
      console.log('检测到抖音URL，获取数据...');
      return this.getDouyinMetrics(url);
    } else {
      throw new Error('不支持的平台URL，仅支持小红书和抖音');
    }
  }

  /**
   * 批量获取多个URL的数据
   */
  async getBatchMetrics(urls: string[]): Promise<Map<string, PlatformMetrics>> {
    const results = new Map<string, PlatformMetrics>();
    const errors: Array<{ url: string; error: string }> = [];

    // 逐个获取，避免频率限制
    for (const url of urls) {
      try {
        const metrics = await this.getMetrics(url);
        results.set(url, metrics);

        // 避免频率限制，添加延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        errors.push({ url, error: errorMsg });
        console.error(`获取${url}数据失败:`, errorMsg);
      }
    }

    // 打印错误汇总
    if (errors.length > 0) {
      console.warn('批量获取数据完成，部分失败:', errors);
    }

    return results;
  }
}

// 导出单例
export const socialPlatformService = new SocialPlatformService();
