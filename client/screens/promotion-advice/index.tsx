import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function PromotionAdviceScreen() {
  const router = useSafeRouter();

  const handleSelectPlatform = (platform: 'xiaohongshu' | 'douyin') => {
    router.push('/content-operation-input', { platform });
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* 返回按钮 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>

        {/* 标题 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>内容运营建议</Text>
          <Text style={styles.subtitle}>观察15日数据，给与内容运营的指导</Text>
        </View>

        {/* 功能开发中提示 */}
        <View style={styles.developmentNotice}>
          <FontAwesome6 name="tools" size={16} color="#FF9500" />
          <Text style={styles.developmentNoticeText}>功能开发中，敬请期待</Text>
        </View>

        {/* 平台选择按钮 */}
        <View style={styles.buttonContainer}>
          {/* 小红书按钮 */}
          <TouchableOpacity
            style={[styles.platformButton, styles.disabledButton]}
            onPress={() => {}}
            disabled={true}
            activeOpacity={1}
          >
            <LinearGradient
              colors={['#CCCCCC', '#DDDDDD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.platformButtonGradient}
            >
              <View style={styles.platformIcon}>
                <FontAwesome6 name="heart" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.platformText}>
                <Text style={styles.platformName}>小红书</Text>
                <Text style={styles.platformDesc}>生活方式分享社区</Text>
              </View>
              <FontAwesome6 name="lock" size={20} color="#FFFFFF" style={styles.arrowIcon} />
            </LinearGradient>
          </TouchableOpacity>

          {/* 抖音按钮 */}
          <TouchableOpacity
            style={[styles.platformButton, styles.disabledButton]}
            onPress={() => {}}
            disabled={true}
            activeOpacity={1}
          >
            <LinearGradient
              colors={['#CCCCCC', '#DDDDDD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.platformButtonGradient}
            >
              <View style={styles.platformIcon}>
                <FontAwesome6 name="music" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.platformText}>
                <Text style={styles.platformName}>抖音</Text>
                <Text style={styles.platformDesc}>短视频内容平台</Text>
              </View>
              <FontAwesome6 name="lock" size={20} color="#FFFFFF" style={styles.arrowIcon} />
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
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  placeholder: {
    width: 30,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  developmentNotice: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  developmentNoticeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  platformButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  platformButtonGradient: {
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
  platformText: {
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
