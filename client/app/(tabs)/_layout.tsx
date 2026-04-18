import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  let tabBarStyle: any = {
    backgroundColor: '#F0F0F3',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  };

  // 用于修复 Web 上高度异常的问题
  if (Platform.OS === 'web') {
    tabBarStyle = {
      ...tabBarStyle,
      height: 'auto',
    };
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#B2BEC3',
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '话题',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="lightbulb" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="content-creation"
        options={{
          title: '创作',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="pen-fancy" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hot-list"
        options={{
          title: '热榜',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="fire" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
