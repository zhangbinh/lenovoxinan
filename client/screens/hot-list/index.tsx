import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { styles } from './styles';

interface HotTopic {
  id: string;
  title: string;
  platform: string;
  hot: number;
  url?: string;
}

export default function HotListScreen() {
  const [loading, setLoading] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'all' | 'douyin' | 'zhihu' | 'xiaohongshu' | 'toutiao'>('all');
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  const platforms = [
    { key: 'all', name: '全部' },
    { key: 'douyin', name: '抖音' },
    { key: 'zhihu', name: '知乎' },
    { key: 'xiaohongshu', name: '小红书' },
    { key: 'toutiao', name: '今日头条' },
  ];

  const fetchHotTopics = async (platform: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/hottopics?platform=${platform}`);
      const data = await response.json();

      if (response.ok && data.topics) {
        setHotTopics(data.topics);
      }
    } catch (error) {
      console.error('获取热榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (platform: any) => {
    setActivePlatform(platform);
    fetchHotTopics(platform);
  };

  React.useEffect(() => {
    fetchHotTopics('all');
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>专业热榜</Text>
            <Text style={styles.subtitle}>30天内活跃且具有专业度的热门话题</Text>
          </View>

          {/* 平台筛选 */}
          <View style={styles.platformFilter}>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.key}
                style={[
                  styles.platformTag,
                  activePlatform === platform.key && styles.platformTagActive
                ]}
                onPress={() => handlePlatformChange(platform.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.platformText,
                  activePlatform === platform.key && styles.platformTextActive
                ]}>
                  {platform.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 热榜列表 */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : (
            <View style={styles.topicList}>
              {hotTopics.map((topic, index) => (
                <View key={topic.id} style={styles.topicItem}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topicContent}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <View style={styles.topicMeta}>
                      <View style={styles.platformBadge}>
                        <Text style={styles.platformBadgeText}>{topic.platform}</Text>
                      </View>
                      <Text style={styles.hotValue}>热度 {topic.hot}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
