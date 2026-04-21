import * as Updates from 'expo-updates';

export type VersionCheckResult = {
  currentVersion: string;
  latestVersion: string;
  needsUpdate: boolean;
  needsForceUpdate: boolean;
  forceUpdate: boolean;
  updateMessage: string;
  releaseNotes: string;
  downloadUrl: string;
};

export const VersionService = {
  /**
   * 获取当前应用版本号
   */
  getCurrentVersion: (): string => {
    // 从Constants或app.json中读取版本号
    try {
      const config = Updates.manifest as any;
      return config?.version || config?.extra?.expoClient?.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  },

  /**
   * 检查是否有更新
   */
  checkForUpdate: async (): Promise<VersionCheckResult | null> => {
    try {
      const currentVersion: string = VersionService.getCurrentVersion();

      // 获取后端API地址
      const env: any = process.env || {};
      const backendBaseUrl = env.EXPO_PUBLIC_BACKEND_BASE_URL || '';

      /**
       * 服务端文件：server/src/routes/version.ts
       * 接口：GET /api/v1/version/check?currentVersion=1.0.0
       * Query 参数：currentVersion: string
       */
      const response = await fetch(
        `${backendBaseUrl}/api/v1/version/check?currentVersion=${currentVersion}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();

      if (result?.success && result?.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('检查版本更新失败:', error);
      return null;
    }
  },

  /**
   * 下载并安装更新
   */
  fetchAndInstallUpdate: async (): Promise<boolean> => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update?.isAvailable) {
        await Updates.fetchUpdateAsync();
        // 更新已下载，等待下次重启时安装
        return true;
      }

      return false;
    } catch (error) {
      console.error('下载更新失败:', error);
      return false;
    }
  },

  /**
   * 立即重启应用以应用更新
   */
  reloadApp: () => {
    Updates.reloadAsync();
  },
};
