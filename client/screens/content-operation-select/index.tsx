import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';

type PlatformType = 'xiaohongshu' | 'douyin';

export default function ContentOperationSelectScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ platform?: string; publishUrl?: string }>();

  const handleSelectPlatform = (platform: PlatformType) => {
    if (params.publishUrl) {
      // 如果有传递的链接，直接跳转到结果页面
      router.push('/content-operation-result', {
        platform,
        publishUrl: params.publishUrl,
      });
    } else {
      // 否则跳转到输入页面
      router.push('/content-operation-input', { platform });
    }
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
          <Text style={styles.headerTitle}>选择平台</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 提示文字 */}
        <View style={styles.hintSection}>
          <Text style={styles.hintTitle}>请选择发布内容的平台</Text>
          <Text style={styles.hintText}>我们将根据平台特点提供针对性的运营建议</Text>
        </View>

        {/* 平台选项 */}
        <View style={styles.platformList}>
          {/* 小红书 */}
          <TouchableOpacity
            style={styles.platformCard}
            onPress={() => handleSelectPlatform('xiaohongshu')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF2442', '#FF6B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.platformCardGradient}
            >
              <View style={styles.platformIcon}>
                <FontAwesome6 name="heart" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>小红书</Text>
                <Text style={styles.platformDesc}>生活方式分享社区</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
            </LinearGradient>
          </TouchableOpacity>

          {/* 抖音 */}
          <TouchableOpacity
            style={styles.platformCard}
            onPress={() => handleSelectPlatform('douyin')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#000000', '#1A1A1A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.platformCardGradient}
            >
              <View style={styles.platformIcon}>
                <FontAwesome6 name="music" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>抖音</Text>
                <Text style={styles.platformDesc}>短视频内容平台</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 底部说明 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            基于AI大模型分析，为您提供专业的运营建议
          </Text>
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
  hintSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  hintTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  platformList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  platformCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  platformCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  platformIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  platformDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  footerText: {
    fontSize: 13,
    color: '#95A5A6',
    textAlign: 'center',
  },
});
