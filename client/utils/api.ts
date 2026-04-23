import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

/**
 * Web环境安全的AsyncStorage封装
 * Web环境下使用localStorage作为fallback
 */
export async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('AsyncStorage失败，使用localStorage:', error);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn('AsyncStorage失败，使用localStorage:', error);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }
}

export async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('AsyncStorage失败，使用localStorage:', error);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
