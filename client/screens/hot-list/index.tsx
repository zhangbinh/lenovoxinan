import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Screen } from '@/components/Screen';
import { styles } from './styles';

const coverImage = require('@/assets/lenovo_app_ui.webp');

interface HotTopic {
  id: string;
  title: string;
  platform: string;
  category: string;
  hot: number;
  url?: string;
  date: string;
}

export default function HotListScreen() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [category, setCategory] = useState<'all' | '3c'>('all');
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  const timeRanges = [
    { key: '7d' as const, name: '最近7天' },
    { key: '30d' as const, name: '最近30天' },
  ];

  const categories = [
    { key: 'all' as const, name: '全部' },
    { key: '3c' as const, name: '3C数码' },
  ];

  const platforms = [
    { key: 'all', name: '全部' },
    { key: 'douyin', name: '抖音' },
    { key: 'zhihu', name: '知乎' },
    { key: 'xiaohongshu', name: '小红书' },
    { key: 'toutiao', name: '今日头条' },
  ];

  const [activePlatform, setActivePlatform] = useState('all');

  const fetchHotTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/hottopics?platform=${activePlatform}&timeRange=${timeRange}&category=${category}`
      );
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

  const handleTimeRangeChange = (range: '7d' | '30d') => {
    setTimeRange(range);
  };

  const handleCategoryChange = (cat: 'all' | '3c') => {
    setCategory(cat);
  };

  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform);
  };

  React.useEffect(() => {
    fetchHotTopics();
  }, [timeRange, category, activePlatform]);

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部标题 */}
          <View style={styles.header}>
            {/* 封面图片 */}
            <View style={styles.coverContainer}>
              <ImageBackground
                source={coverImage}
                style={styles.coverImage}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.title}>专业热榜</Text>
            <Text style={styles.subtitle}>3C数码各平台热点话题参考</Text>
          </View>

          {/* 时间筛选 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>时间范围</Text>
            <View style={styles.filterButtons}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.filterButton,
                    timeRange === range.key && styles.filterButtonActive
                  ]}
                  onPress={() => handleTimeRangeChange(range.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterButtonText,
                    timeRange === range.key && styles.filterButtonTextActive
                  ]}>
                    {range.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 分类筛选 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>分类</Text>
            <View style={styles.filterButtons}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.filterButton,
                    category === cat.key && styles.filterButtonActive
                  ]}
                  onPress={() => handleCategoryChange(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterButtonText,
                    category === cat.key && styles.filterButtonTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 平台筛选 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>平台</Text>
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
          </View>

          {/* 热榜列表 */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : hotTopics.length > 0 ? (
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
                      {topic.category === '3c' && (
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>3C数码</Text>
                        </View>
                      )}
                      <Text style={styles.hotValue}>热度 {topic.hot}</Text>
                    </View>
                    <Text style={styles.topicDate}>{topic.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>暂无相关热点</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
