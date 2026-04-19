import { operationsAssistantService } from '../services/operations-assistant';
import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

// ========== 每日任务 ==========

// 获取指定日期的任务列表
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const { storeId, date } = req.query;

    if (!storeId || !date) {
      return res.status(400).json({
        success: false,
        message: '缺少参数: storeId, date',
      });
    }

    const tasks = await operationsAssistantService.getDailyTasks(
      storeId as string,
      date as string
    );

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('获取每日任务失败:', error);
    res.status(500).json({
      success: false,
      message: '获取每日任务失败',
    });
  }
});

// 生成当日任务
router.post('/tasks/generate', async (req: Request, res: Response) => {
  try {
    const { storeId, date } = req.body;

    if (!storeId || !date) {
      return res.status(400).json({
        success: false,
        message: '缺少参数: storeId, date',
      });
    }

    const tasks = await operationsAssistantService.generateDailyTasks(
      storeId,
      date
    );

    res.json({
      success: true,
      data: tasks,
      message: '任务生成成功',
    });
  } catch (error) {
    console.error('生成每日任务失败:', error);
    res.status(500).json({
      success: false,
      message: '生成每日任务失败',
    });
  }
});

// 标记任务完成
router.post('/tasks/:taskId/complete', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body;

    const taskIdStr = Array.isArray(taskId) ? taskId[0] : taskId;
    const result = await operationsAssistantService.completeTask(
      parseInt(taskIdStr),
      notes
    );

    res.json({
      success: true,
      data: result,
      message: '任务已完成',
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({
      success: false,
      message: '完成任务失败',
    });
  }
});

// 获取任务打卡记录
router.get('/tasks/:taskId/checkins', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const taskIdStr = Array.isArray(taskId) ? taskId[0] : taskId;

    const checkins = await operationsAssistantService.getTaskCheckins(
      parseInt(taskIdStr)
    );

    res.json({
      success: true,
      data: checkins,
    });
  } catch (error) {
    console.error('获取打卡记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取打卡记录失败',
    });
  }
});

// ========== 周度复盘 ==========

// 获取周度复盘
router.get('/reviews/:weekStart', async (req: Request, res: Response) => {
  try {
    const { weekStart } = req.params;
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: '缺少参数: storeId',
      });
    }

    const weekStartStr = Array.isArray(weekStart) ? weekStart[0] : weekStart;
    const review = await operationsAssistantService.getWeeklyReview(
      storeId as string,
      weekStartStr
    );

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('获取周度复盘失败:', error);
    res.status(500).json({
      success: false,
      message: '获取周度复盘失败',
    });
  }
});

// 创建或更新周度复盘
router.post('/reviews', async (req: Request, res: Response) => {
  try {
    const {
      storeId,
      weekStart,
      weekEnd,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      averageInteractRate,
      insights,
      actionPlan,
    } = req.body;

    if (!storeId || !weekStart || !weekEnd) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: storeId, weekStart, weekEnd',
      });
    }

    const review = await operationsAssistantService.saveWeeklyReview(
      storeId,
      weekStart,
      weekEnd,
      {
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        averageInteractRate,
        insights,
        actionPlan,
      }
    );

    res.json({
      success: true,
      data: review,
      message: '周度复盘保存成功',
    });
  } catch (error) {
    console.error('保存周度复盘失败:', error);
    res.status(500).json({
      success: false,
      message: '保存周度复盘失败',
    });
  }
});

// 获取周度复盘列表
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    const { storeId, limit } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: '缺少参数: storeId',
      });
    }

    const reviews = await operationsAssistantService.getWeeklyReviews(
      storeId as string,
      limit ? parseInt(limit as string) : 10
    );

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('获取周度复盘列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取周度复盘列表失败',
    });
  }
});

// ========== 爆款文案模板 ==========

// 获取所有活跃模板
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { platform, contentType } = req.query;

    const templates = await operationsAssistantService.getActiveTemplates(
      platform as string,
      contentType as string
    );

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('获取模板列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取模板列表失败',
    });
  }
});

// 获取指定模板
router.get('/templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const template = await operationsAssistantService.getTemplateById(
      parseInt(idStr)
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: '模板不存在',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('获取模板失败:', error);
    res.status(500).json({
      success: false,
      message: '获取模板失败',
    });
  }
});

export default router;
