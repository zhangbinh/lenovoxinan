import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBackendBaseUrl, safeSetItem, safeGetItem, safeRemoveItem } from '@/utils/api';

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
    console.log('=== AuthContext.checkAuth 开始 ===');
    try {
      const auth = await safeGetItem(AUTH_KEY);
      const sid = await safeGetItem(STORE_ID_KEY);
      const sname = await safeGetItem(STORE_NAME_KEY);
      console.log('本地存储 - auth:', auth);
      console.log('本地存储 - storeId:', sid);
      console.log('本地存储 - storeName:', sname);

      if (auth === 'true' && sid && sname) {
        console.log('已登录，恢复会话');
        setIsAuthenticated(true);
        setStoreId(sid);
        setStoreName(sname);
      } else {
        console.log('未登录或会话已过期');
      }
    } catch (error) {
      console.error('检查授权失败:', error);
    } finally {
      setIsLoading(false);
      console.log('=== AuthContext.checkAuth 结束 ===');
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
      // 使用统一的工具函数获取后端URL
      const backendUrl = getBackendBaseUrl();
      console.log('后端URL:', backendUrl);

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
        await safeSetItem(AUTH_KEY, 'true');
        await safeSetItem(STORE_ID_KEY, inputStoreId);
        await safeSetItem(STORE_NAME_KEY, inputStoreName);
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
      await safeRemoveItem(AUTH_KEY);
      await safeRemoveItem(STORE_ID_KEY);
      await safeRemoveItem(STORE_NAME_KEY);
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
