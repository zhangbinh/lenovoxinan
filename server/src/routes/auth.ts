import express from 'express';
import type { Request, Response } from 'express';
import { HeaderUtils } from 'coze-coding-dev-sdk';

const router = express.Router();

// 授权验证接口
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { storeId, authCode } = req.body;

    if (!storeId || !authCode) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 验证授权码（硬编码为 Lenovoxinan）
    const isValid = authCode === 'Lenovoxinan';

    if (isValid) {
      res.json({
        success: true,
        valid: true,
        message: '授权验证成功'
      });
    } else {
      res.json({
        success: true,
        valid: false,
        message: '授权码错误'
      });
    }
  } catch (error) {
    console.error('授权验证错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

export default router;
