import express from 'express';

const router = express.Router();

// 版本管理（内存存储，生产环境建议使用数据库）
let appVersion = {
  latestVersion: '1.0.0',
  minSupportedVersion: '1.0.0', // 最低支持的版本
  forceUpdate: false, // 是否强制更新
  updateMessage: '发现新版本，请更新以获得更好的体验',
  releaseNotes: '- 修复了若干bug\n- 优化了用户体验\n- 新增了内容运营建议功能',
  downloadUrl: '', // APK下载地址（EAS构建后填写）
  releaseDate: new Date().toISOString(),
};

/**
 * 获取最新版本信息
 * GET /api/v1/version/latest
 */
router.get('/latest', (req, res) => {
  res.json({
    success: true,
    data: appVersion,
  });
});

/**
 * 检查是否需要更新
 * GET /api/v1/version/check?currentVersion=1.0.0
 */
router.get('/check', (req, res) => {
  const currentVersion = req.query.currentVersion as string || '1.0.0';

  // 比较版本号
  const needsUpdate = compareVersions(currentVersion, appVersion.latestVersion);
  const needsForceUpdate = compareVersions(currentVersion, appVersion.minSupportedVersion) > 0;

  res.json({
    success: true,
    data: {
      currentVersion,
      latestVersion: appVersion.latestVersion,
      needsUpdate,
      needsForceUpdate: needsForceUpdate || appVersion.forceUpdate,
      forceUpdate: appVersion.forceUpdate,
      updateMessage: appVersion.updateMessage,
      releaseNotes: appVersion.releaseNotes,
      downloadUrl: appVersion.downloadUrl,
    },
  });
});

/**
 * 更新版本信息（仅管理员可用）
 * POST /api/v1/version/update
 * Body: {
 *   latestVersion: string,
 *   minSupportedVersion: string,
 *   forceUpdate: boolean,
 *   updateMessage: string,
 *   releaseNotes: string,
 *   downloadUrl: string
 * }
 */
router.post('/update', (req, res) => {
  const {
    latestVersion,
    minSupportedVersion,
    forceUpdate,
    updateMessage,
    releaseNotes,
    downloadUrl,
  } = req.body;

  // 验证必填字段
  if (!latestVersion) {
    return res.status(400).json({
      success: false,
      message: 'latestVersion is required',
    });
  }

  // 更新版本信息
  appVersion = {
    latestVersion,
    minSupportedVersion: minSupportedVersion || latestVersion,
    forceUpdate: forceUpdate || false,
    updateMessage: updateMessage || appVersion.updateMessage,
    releaseNotes: releaseNotes || '',
    downloadUrl: downloadUrl || appVersion.downloadUrl,
    releaseDate: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Version updated successfully',
    data: appVersion,
  });
});

// 比较版本号
// 返回: 1 (version1 > version2), 0 (version1 == version2), -1 (version1 < version2)
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
}

export default router;
