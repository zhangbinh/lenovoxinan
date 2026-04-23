import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Web环境下配置后端URL
 * 在应用加载时设置 window.__EXPO_PUBLIC_BACKEND_BASE_URL__
 */
export function WebOnlyBackendUrlConfig() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // 如果还没有配置，则设置默认值
      if (!(window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__) {
        const backendUrl = 'https://marketing-backend-cu2q.onrender.com';
        (window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__ = backendUrl;
        console.log('=== Web Backend URL 配置 ===');
        console.log('后端地址已自动配置:', backendUrl);
      } else {
        console.log('=== Web Backend URL 配置 ===');
        console.log('后端地址已存在:', (window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__);
      }
    }
  }, []);

  return null;
}
