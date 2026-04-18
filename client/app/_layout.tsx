import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from '@/components/Provider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useSegments, useRootNavigationState } from 'expo-router';

import '../global.css';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

// 导航守卫组件
function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useSafeRouter();
  const segments = useSegments();
  const rootState = useRootNavigationState();

  React.useEffect(() => {
    // 1. 待机检测：导航未挂载 或 鉴权正在加载中，直接返回
    if (!rootState?.key || isLoading) return;

    // 2. 路径检测：确认当前不在登录页
    const inLoginRoute = segments.includes('login');

    // 3. 未登录保护：未登录且不在登录页 → 跳转登录页
    if (!isAuthenticated && !inLoginRoute) {
      router.replace('/login');
    }

    // 4. 已登录保护：已登录但在登录页 → 跳转首页
    if (isAuthenticated && inLoginRoute) {
      router.replace('/');
    }
  }, [rootState?.key, isAuthenticated, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerShown: false
      }}
    >
      <Stack.Screen name="login" options={{ title: "" }} />
      <Stack.Screen name="(tabs)" options={{ title: "" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
      <Toast />
    </AuthProvider>
  );
}
