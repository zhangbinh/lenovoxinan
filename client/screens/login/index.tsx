import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { styles } from './styles';

export default function LoginScreen() {
  const [storeId, setStoreId] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useSafeRouter();

  const handleLogin = async () => {
    if (!storeId.trim()) {
      Alert.alert('错误', '请输入店面编号');
      return;
    }

    if (!authCode.trim()) {
      Alert.alert('错误', '请输入授权码');
      return;
    }

    setLoading(true);
    try {
      const success = await login(storeId.trim(), authCode.trim());

      if (success) {
        Alert.alert('成功', '授权验证成功', [
          { text: '确定', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('错误', '店面编号或授权码错误');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Logo 区域 */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>联想</Text>
            </View>
            <Text style={styles.title}>西南战区门店营销内容辅助平台</Text>
            <Text style={styles.subtitle}>Lenovo Southwest Region Marketing Assistant</Text>
          </View>

          {/* 输入区域 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>店面编号</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入店面编号"
                placeholderTextColor="#B2BEC3"
                value={storeId}
                onChangeText={setStoreId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>授权码</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入授权码"
                placeholderTextColor="#B2BEC3"
                value={authCode}
                onChangeText={setAuthCode}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>
          </View>

          {/* 登录按钮 */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6C63FF', '#896BFF']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginButtonText}>
                {loading ? '验证中...' : '进入系统'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
