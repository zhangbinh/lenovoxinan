import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { styles } from './styles';

interface Topic {
  id: number;
  title: string;
  description: string;
  platforms: string[];
  selected: boolean;
}

interface ContentItem {
  index: number;
  text: string;
  publishLink: string;
}

export default function TopicDiscoveryScreen() {
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'xiaohongshu' | 'video' | null>(null);

  const handleSearchTopics = async () => {
    if (!topicInput.trim()) {
      Alert.alert('提示', '请输入话题');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/topics/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.topics) {
        setTopics(data.topics);
      } else {
        Alert.alert('错误', data.message || '生成话题失败');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
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

  const handleGenerateContent = async (type: 'xiaohongshu' | 'video') => {
    const selectedTopics = topics.filter(t => t.selected);
    if (selectedTopics.length === 0) {
      Alert.alert('提示', '请至少选择1个话题');
      return;
    }
    if (selectedTopics.length > 3) {
      Alert.alert('提示', '最多选择3个话题');
      return;
    }

    setModalType(type);
    setShowModal(true);
    setContentLoading(true);
    setGeneratedContent(null);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: selectedTopics.map(t => t.title),
          type,
        }),
      });

      const data = await response.json();

      if (response.ok && data.contents) {
        // 根据类型提取对应内容
        if (type === 'xiaohongshu') {
          const xiaohongshuContent = data.contents.find((c: any) => c.type === 'xiaohongshu');
          if (xiaohongshuContent) {
            setGeneratedContent({
              title: xiaohongshuContent.title,
              items: xiaohongshuContent.contents.map((text: string, idx: number) => ({
                index: idx + 1,
                text,
                publishLink: '',
              })),
            });
          }
        } else {
          // video
          const videoContents = data.contents.filter((c: any) =>
            c.type === 'video15s' ||
            c.type === 'video30s' ||
            c.type === 'video30sPlus'
          );
          if (videoContents && videoContents.length > 0) {
            const allItems: any[] = [];
            videoContents.forEach((content: any) => {
              content.contents.forEach((item: string, idx: number) => {
                allItems.push({
                  title: content.title,
                  text: item,
                  index: allItems.length + 1,
                  publishLink: '',
                });
              });
            });
            setGeneratedContent({
              title: '短视频脚本',
              items: allItems,
            });
          }
        }
      } else {
        Alert.alert('错误', data.message || '生成内容失败');
        setShowModal(false);
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
      setShowModal(false);
    } finally {
      setContentLoading(false);
    }
  };

  const handlePublishLinkChange = (itemIndex: number, link: string) => {
    setGeneratedContent(prev => ({
      ...prev,
      items: prev.items.map((item: ContentItem, idx: number) =>
        idx === itemIndex ? { ...item, publishLink: link } : item
      ),
    }));
  };

  const handleSubmitPublish = () => {
    const itemsWithLinks = generatedContent.items.filter((item: ContentItem) => item.publishLink.trim());

    if (itemsWithLinks.length === 0) {
      Alert.alert('提示', '请至少填写一个发布链接');
      return;
    }

    Alert.alert('提交成功', `已成功提交${itemsWithLinks.length}条内容的发布链接，系统将提供15日投流指导建议！`, [
      { text: '确定', onPress: () => setShowModal(false) }
    ]);
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

        {/* 内容Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalType === 'xiaohongshu' ? '小红书文案' : '短视频脚本'}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              {contentLoading ? (
                <View style={styles.modalLoading}>
                  <ActivityIndicator size="large" color="#6C63FF" />
                  <Text style={styles.modalLoadingText}>正在生成内容...</Text>
                </View>
              ) : generatedContent && (
                <ScrollView style={styles.modalBody}>
                  {generatedContent.items.map((item: ContentItem, idx: number) => (
                    <View key={idx} style={styles.contentItem}>
                      <View style={styles.contentItemHeader}>
                        <View style={styles.contentIndex}>
                          <Text style={styles.contentIndexText}>{item.index}</Text>
                        </View>
                        {item.title && (
                          <Text style={styles.contentItemTitle}>{item.title}</Text>
                        )}
                      </View>
                      <Text style={styles.contentItemText}>{item.text}</Text>
                      <View style={styles.publishSection}>
                        <Text style={styles.publishLabel}>已发布链接（选填）</Text>
                        <TextInput
                          style={styles.publishInput}
                          placeholder="请输入发布后的链接"
                          placeholderTextColor="#B2BEC3"
                          value={item.publishLink}
                          onChangeText={(text) => handlePublishLinkChange(idx, text)}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              {generatedContent && (
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalButtonTextCancel}>关闭</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleSubmitPublish}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#6C63FF', '#896BFF']}
                      style={styles.modalButtonConfirmGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.modalButtonTextConfirm}>提交发布链接</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}
