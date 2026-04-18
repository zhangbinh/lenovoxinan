import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    try {
      // 调用后端验证接口
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: inputStoreId,
          storeName: inputStoreName,
          authCode
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        await AsyncStorage.setItem(AUTH_KEY, 'true');
        await AsyncStorage.setItem(STORE_ID_KEY, inputStoreId);
        await AsyncStorage.setItem(STORE_NAME_KEY, inputStoreName);
        setIsAuthenticated(true);
        setStoreId(inputStoreId);
        setStoreName(inputStoreName);
        return true;
      }

      return false;
    } catch (error) {
      console.error('登录失败:', error);
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
