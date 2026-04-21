import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  storeId: string | null;
  storeName: string | null;
  login: (storeId: string, storeName: string, authCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = '@lenovo_auth';
const STORE_ID_KEY = '@lenovo_store_id';
const STORE_NAME_KEY = '@lenovo_store_name';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const auth = await AsyncStorage.getItem(AUTH_KEY);
      const sid = await AsyncStorage.getItem(STORE_ID_KEY);
      const sname = await AsyncStorage.getItem(STORE_NAME_KEY);
      if (auth === 'true' && sid && sname) {
        setIsAuthenticated(true);
        setStoreId(sid);
        setStoreName(sname);
      }
    } catch (error) {
      console.error('检查授权失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (inputStoreId: string, inputStoreName: string, authCode: string) => {
    console.log('=== AuthContext.login 开始 ===');
    console.log('参数 - storeId:', inputStoreId);
    console.log('参数 - storeName:', inputStoreName);
    console.log('参数 - authCode:', authCode ? '***' : '');

    try {
      // 获取后端URL，Web环境下需要从环境变量或配置中获取
      let backendUrl = (process.env as any).EXPO_PUBLIC_BACKEND_BASE_URL;

      console.log('环境变量 EXPO_PUBLIC_BACKEND_BASE_URL:', backendUrl);
      console.log('Platform.OS:', Platform.OS);

      // Web环境下的特殊处理
      if (!backendUrl && Platform.OS === 'web') {
        // 如果环境变量未设置，尝试从全局配置获取
        if (typeof window !== 'undefined' && (window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__) {
          backendUrl = (window as any).__EXPO_PUBLIC_BACKEND_BASE_URL__;
          console.log('从 window.__EXPO_PUBLIC_BACKEND_BASE_URL__ 获取:', backendUrl);
        } else {
          // 默认使用相对路径，适用于同域部署
          backendUrl = 'http://localhost:9091';
          console.warn('EXPO_PUBLIC_BACKEND_BASE_URL 未设置，使用默认值:', backendUrl);
        }
      }

      console.log('最终使用后端URL:', backendUrl);

      // 调用后端验证接口
      const apiUrl = `${backendUrl}/api/v1/auth/verify`;
      console.log('请求URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: inputStoreId,
          storeName: inputStoreName,
          authCode
        }),
      });

      console.log('响应状态:', response.status, response.statusText);

      const data = await response.json();
      console.log('登录响应数据:', data);

      if (response.ok && data.valid) {
        console.log('登录成功，保存到本地存储');
        await AsyncStorage.setItem(AUTH_KEY, 'true');
        await AsyncStorage.setItem(STORE_ID_KEY, inputStoreId);
        await AsyncStorage.setItem(STORE_NAME_KEY, inputStoreName);
        setIsAuthenticated(true);
        setStoreId(inputStoreId);
        setStoreName(inputStoreName);
        console.log('=== AuthContext.login 成功 ===');
        return true;
      }

      console.log('=== AuthContext.login 失败 ===');
      return false;
    } catch (error) {
      console.error('=== AuthContext.login 异常 ===', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      await AsyncStorage.removeItem(STORE_ID_KEY);
      await AsyncStorage.removeItem(STORE_NAME_KEY);
      setIsAuthenticated(false);
      setStoreId(null);
      setStoreName(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, storeId, storeName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}
