import { Platform } from 'react-native';

/**
 * 获取后端API地址
 * H5 Web环境使用 window.__EXPO_PUBLIC_BACKEND_BASE_URL__
 * 原生环境使用 process.env.EXPO_PUBLIC_BACKEND_BASE_URL
 */
export function getBackendBaseUrl(): string {
  let backendUrl = (process.env as any).EXPO_PUBLIC_BACKEND_BASE_URL;

  // Web环境下的特殊处理
  if (!backendUrl && Platform.OS === 'web' && typeof window !== 'undefined') {
    backendUrl = (window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__;
  }

  // 如果都没有设置，使用默认值
  if (!backendUrl) {
    backendUrl = 'http://localhost:9091';
    console.warn('EXPO_PUBLIC_BACKEND_BASE_URL 未设置，使用默认值:', backendUrl);
  }

  console.log('Backend URL:', backendUrl);
  return backendUrl;
}
