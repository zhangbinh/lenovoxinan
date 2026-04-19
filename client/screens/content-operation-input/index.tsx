import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { Platform } from 'react-native';

type PlatformType = 'xiaohongshu' | 'douyin';

export default function ContentOperationInputScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ platform?: string }>();
  const platform = (params.platform as PlatformType) || 'xiaohongshu';

  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!link.trim()) {
      Alert.alert('提示', '请输入发布链接');
      return;
    }

    // 验证链接格式
    if (platform === 'xiaohongshu') {
      if (!link.toLowerCase().includes('xiaohongshu') && !link.toLowerCase().includes('xhslink')) {
        Alert.alert('提示', '请输入有效的小红书链接');
        return;
      }
    } else if (platform === 'douyin') {
      if (!link.toLowerCase().includes('douyin')) {
        Alert.alert('提示', '请输入有效的抖音链接');
        return;
      }
    }

    setLoading(true);

    try {
      router.push('/content-operation-result', {
        platform,
        publishUrl: link.trim(),
      });
    } catch (error) {
      console.error('提交失败:', error);
      Alert.alert('错误', '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformName = () => {
    return platform === 'xiaohongshu' ? '小红书' : '抖音';
  };

  const getPlatformColor = (): readonly [string, string] => {
    return platform === 'xiaohongshu' ? ['#FF2442', '#FF6B6B'] : ['#000000', '#1A1A1A'];
  };

  const getPlatformIcon = () => {
    return platform === 'xiaohongshu' ? 'heart' : 'music';
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* 顶部标题 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getPlatformName()}运营建议</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 平台卡片 */}
        <View style={styles.platformCard}>
          <LinearGradient
            colors={getPlatformColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.platformCardGradient}
          >
            <FontAwesome6 name={getPlatformIcon() as any} size={40} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* 输入表单 */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>发布链接</Text>
            <TextInput
              style={styles.input}
              placeholder={`请输入${getPlatformName()}发布后的链接`}
              placeholderTextColor="#B2BEC3"
              value={link}
              onChangeText={setLink}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <Text style={styles.hintText}>
            我们将根据您的发布内容，提供针对性的运营建议，包括内容优化、投放策略、用户互动等方面。
          </Text>
        </View>

        {/* 底部提交按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6C63FF', '#896BFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome6 name="wand-magic-sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>生成运营建议</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  placeholder: {
    width: 40,
  },
  platformCard: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  platformCardGradient: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  hintText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
