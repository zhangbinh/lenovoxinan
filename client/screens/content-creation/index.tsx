import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { styles } from './styles';

interface Content {
  type: 'xiaohongshu' | 'video15s' | 'video30s' | 'video30sPlus';
  title: string;
  contents: string[];
}

export default function ContentCreationScreen() {
  const [selectedTopics] = useState(['联想笔记本新品体验']); // TODO: 从路由参数获取
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState<'xiaohongshu' | 'video'>('xiaohongshu');

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: selectedTopics,
        }),
      });

      const data = await response.json();

      if (response.ok && data.contents) {
        setContents(data.contents);
      } else {
        Alert.alert('错误', data.message || '生成内容失败');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentContents = () => {
    if (activeTab === 'xiaohongshu') {
      return contents.find(c => c.type === 'xiaohongshu');
    } else {
      return contents.filter(c =>
        c.type === 'video15s' ||
        c.type === 'video30s' ||
        c.type === 'video30sPlus'
      );
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部信息 */}
          <View style={styles.header}>
            <Text style={styles.title}>内容创作</Text>
            <Text style={styles.subtitle}>
              已选择话题：{selectedTopics.join('、')}
            </Text>
          </View>

          {/* 生成按钮 */}
          <TouchableOpacity
            onPress={handleGenerateContent}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6C63FF', '#896BFF']}
              style={styles.generateButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.generateButtonText}>生成内容</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Tab 切换 */}
          {contents.length > 0 && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'xiaohongshu' && styles.tabActive]}
                onPress={() => setActiveTab('xiaohongshu')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'xiaohongshu' && styles.tabTextActive]}>
                  小红书文案
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'video' && styles.tabActive]}
                onPress={() => setActiveTab('video')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
                  短视频脚本
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 内容展示区域 */}
          {contents.length > 0 && (
            <View style={styles.contentSection}>
              {activeTab === 'xiaohongshu' ? (
                <XiaohongshuContent content={getCurrentContents()} />
              ) : (
                <VideoContents contents={getCurrentContents() as Content[]} />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

function XiaohongshuContent({ content }: { content: any }) {
  if (!content) return null;

  return (
    <View style={styles.contentGroup}>
      <Text style={styles.contentGroupTitle}>{content.title}</Text>
      {content.contents.map((item: string, index: number) => (
        <View key={index} style={styles.contentItem}>
          <Text style={styles.contentIndex}>{index + 1}</Text>
          <Text style={styles.contentText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function VideoContents({ contents }: { contents: Content[] }) {
  if (!contents || contents.length === 0) return null;

  return (
    <>
      {contents.map((content, index) => (
        <View key={index} style={styles.contentGroup}>
          <Text style={styles.contentGroupTitle}>{content.title}</Text>
          {content.contents.map((item: string, idx: number) => (
            <View key={idx} style={styles.contentItem}>
              <Text style={styles.contentIndex}>{idx + 1}</Text>
              <Text style={styles.contentText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </>
  );
}
