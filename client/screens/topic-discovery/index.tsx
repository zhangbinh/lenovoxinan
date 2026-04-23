import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { getBackendBaseUrl } from '@/utils/api';
import { styles } from './styles';

interface Topic {
  id: number;
  title: string;
  description: string;
  platforms: string[];
  selected: boolean;
}

export default function TopicDiscoveryScreen() {
  const [topicInput, setTopicInput] = useState('');
  const [remarkInput, setRemarkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useSafeRouter();

  const handleSearchTopics = async () => {
    if (!topicInput.trim()) {
      Alert.alert('提示', '请输入话题');
      return;
    }

    setLoading(true);
    try {
      const backendUrl = getBackendBaseUrl();
      const response = await fetch(`${backendUrl}/api/v1/topics/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          remark: remarkInput.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.topics) {
        setTopics(data.topics);
      } else {
        Alert.alert('错误', data.message || '生成话题失败');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
      console.error('生成话题失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (id: number) => {
    setTopics(prev => prev.map(topic => ({
      ...topic,
      selected: topic.id === id ? !topic.selected : topic.selected
    })));
  };

  const handleGenerateContent = (type: 'xiaohongshu' | 'video') => {
    const selectedTopics = topics.filter(t => t.selected);
    if (selectedTopics.length === 0) {
      Alert.alert('提示', '请至少选择1个话题');
      return;
    }
    if (selectedTopics.length > 3) {
      Alert.alert('提示', '最多选择3个话题');
      return;
    }

    // 跳转到内容展示页面
    router.push('/content-display', {
      type,
      topics: JSON.stringify(selectedTopics.map(t => t.title)),
      remark: remarkInput.trim(),
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部输入区域 */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>话题发现</Text>
            <Text style={styles.sectionDescription}>
              输入您想探索的话题，AI将为您搜索各大平台热榜并生成爆款话题方向
            </Text>

            <TextInput
              style={styles.topicInput}
              placeholder="例如：联想笔记本新品、游戏本推荐..."
              placeholderTextColor="#B2BEC3"
              value={topicInput}
              onChangeText={setTopicInput}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.remarkInput}
              placeholder="备注：描述产品卖点、活动细节或其他补充信息（选填）"
              placeholderTextColor="#B2BEC3"
              value={remarkInput}
              onChangeText={setRemarkInput}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              onPress={handleSearchTopics}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6C63FF', '#896BFF']}
                style={styles.searchButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.searchButtonText}>生成话题方向</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 话题列表 */}
          {topics.length > 0 && (
            <View style={styles.topicsSection}>
              <Text style={styles.sectionTitle}>推荐话题方向</Text>
              <Text style={styles.sectionDescription}>
                请选择1-3个话题进行内容创作（基于抖音、知乎、小红书、今日头条30天热榜）
              </Text>

              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicCard,
                    topic.selected && styles.topicCardSelected
                  ]}
                  onPress={() => handleTopicToggle(topic.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.topicHeader}>
                    <Text style={[
                      styles.topicTitle,
                      topic.selected && styles.topicTitleSelected
                    ]}>
                      {topic.title}
                    </Text>
                    <View style={[
                      styles.checkbox,
                      topic.selected && styles.checkboxSelected
                    ]}>
                      {topic.selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                  <View style={styles.platforms}>
                    {topic.platforms.map((platform, index) => (
                      <View key={index} style={styles.platformTag}>
                        <Text style={styles.platformText}>{platform}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}

              {/* 生成内容按钮 */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleGenerateContent('xiaohongshu')}
                  disabled={!topics.some(t => t.selected)}
                  activeOpacity={0.8}
                  style={styles.actionButton}
                >
                  <LinearGradient
                    colors={['#6C63FF', '#896BFF']}
                    style={styles.actionButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.actionButtonText}>小红书文案生成</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleGenerateContent('video')}
                  disabled={!topics.some(t => t.selected)}
                  activeOpacity={0.8}
                  style={styles.actionButton}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E8E']}
                    style={styles.actionButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.actionButtonText}>短视频脚本生成</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
