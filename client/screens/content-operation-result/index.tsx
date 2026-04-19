import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';

type PlatformType = 'xiaohongshu' | 'douyin';

type AdviceSection = {
  title: string;
  content: string;
  icon: string;
};

export default function ContentOperationResultScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ platform?: string; publishUrl?: string }>();
  const platform = (params.platform as PlatformType) || 'xiaohongshu';
  const publishUrl = params.publishUrl || '';

  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<AdviceSection[] | null>(null);

  const fetchAdvice = useCallback(async () => {
    if (!publishUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      /**
       * 服务端文件：server/src/routes/promotion.ts
       * 接口：POST /api/v1/promotion/advice
       * Body 参数：publishUrl: string, platform: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishUrl,
          platform,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // 解析建议内容
        const adviceText = result.data.advice || '';
        const sections: AdviceSection[] = parseAdviceText(adviceText, platform);
        setAdvice(sections);
      } else {
        Alert.alert('错误', result.message || '获取建议失败');
        router.back();
      }
    } catch (error) {
      console.error('获取建议失败:', error);
      Alert.alert('错误', '网络错误，请重试');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [publishUrl, platform, router]);

  useFocusEffect(
    useCallback(() => {
      fetchAdvice();
    }, [fetchAdvice])
  );

  const parseAdviceText = (text: string, platform: PlatformType): AdviceSection[] => {
    const sections: AdviceSection[] = [];

    // 根据平台设置不同的图标和标题
    if (platform === 'xiaohongshu') {
      sections.push({
        title: '内容优化建议',
        content: extractSection(text, ['内容优化', '标题优化', '封面优化', '正文优化']),
        icon: 'pen-to-square',
      });
      sections.push({
        title: '互动提升策略',
        content: extractSection(text, ['互动', '评论', '点赞', '收藏', '转发']),
        icon: 'comments',
      });
      sections.push({
        title: '发布时间建议',
        content: extractSection(text, ['发布时间', '最佳时间', '时间段']),
        icon: 'clock',
      });
    } else {
      sections.push({
        title: '视频内容优化',
        content: extractSection(text, ['视频内容', '画面', '脚本', '节奏']),
        icon: 'video',
      });
      sections.push({
        title: '投放策略建议',
        content: extractSection(text, ['投放', 'DOU+', '投放策略', '预算']),
        icon: 'money-bill-trend-up',
      });
      sections.push({
        title: '用户留存优化',
        content: extractSection(text, ['留存', '完播率', '用户', '受众']),
        icon: 'chart-line',
      });
    }

    sections.push({
      title: '综合运营建议',
      content: extractSection(text, ['综合', '总结', '建议']),
      icon: 'lightbulb',
    });

    return sections;
  };

  const extractSection = (text: string, keywords: string[]): string => {
    // 简单提取包含关键词的内容段落
    const lines = text.split('\n');
    let section = '';
    let inSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // 检查是否是关键词所在的行
      const isKeywordLine = keywords.some(keyword => trimmedLine.includes(keyword));

      if (isKeywordLine) {
        inSection = true;
        section += trimmedLine + '\n';
      } else if (inSection) {
        // 检查是否是新的章节标题（以数字、字母、特殊符号开头）
        if (/^[0-9一二三四五六七八九十.\-—]/.test(trimmedLine)) {
          // 可能是新的章节，继续添加
          section += trimmedLine + '\n';
        } else {
          // 普通段落
          section += trimmedLine + '\n';
        }
      }
    }

    return section.trim() || '暂无具体建议';
  };

  const getPlatformName = () => {
    return platform === 'xiaohongshu' ? '小红书' : '抖音';
  };

  const getPlatformColor = () => {
    return platform === 'xiaohongshu' ? '#FF2442' : '#000000';
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

        {/* 内容区域 */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text style={styles.loadingText}>正在分析内容...</Text>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {/* 平台信息 */}
              <View style={styles.platformInfo}>
                <View style={[styles.platformBadge, { backgroundColor: getPlatformColor() }]}>
                  <Text style={styles.platformBadgeText}>{getPlatformName()}</Text>
                </View>
                <Text style={styles.linkText} numberOfLines={1}>{publishUrl}</Text>
              </View>

              {/* 建议列表 */}
              <View style={styles.adviceList}>
                {advice?.map((section, index) => (
                  <View key={index} style={styles.adviceCard}>
                    <View style={styles.adviceHeader}>
                      <View style={[styles.adviceIcon, { backgroundColor: platform === 'xiaohongshu' ? '#FFF0F5' : '#F5F5F5' }]}>
                        <FontAwesome6 name={section.icon as any} size={20} color={getPlatformColor()} />
                      </View>
                      <Text style={styles.adviceTitle}>{section.title}</Text>
                    </View>
                    <Text style={styles.adviceContent}>{section.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 12,
  },
  contentContainer: {
    padding: 24,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  platformBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 12,
  },
  platformBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#636E72',
  },
  adviceList: {
    gap: 16,
  },
  adviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  adviceContent: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
  },
});
