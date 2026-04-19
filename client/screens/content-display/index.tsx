import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { styles } from './styles';

interface ContentItem {
  index: number;
  text: string;
  title?: string;
  publishLink: string;
}

export default function ContentDisplayScreen() {
  const router = useSafeRouter();
  const params = router.useSafeSearchParams<{
    type: 'xiaohongshu' | 'video';
    topics: string;
    remark?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contentType] = useState<'xiaohongshu' | 'video'>(params.type || 'xiaohongshu');
  const [topics] = useState(params.topics ? JSON.parse(params.topics) : []);
  const [remark] = useState(params.remark || '');

  const generateContent = async () => {
    if (topics.length === 0) {
      Alert.alert('错误', '缺少话题参数');
      router.back();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics,
          type: contentType,
          remark: remark,
        }),
      });

      const data = await response.json();

      if (response.ok && data.contents) {
        // 根据类型提取对应内容
        if (contentType === 'xiaohongshu') {
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
        router.back();
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    generateContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      { text: '确定', onPress: () => router.back() }
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>正在生成内容...</Text>
        </View>
      </Screen>
    );
  }

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
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{contentType === 'xiaohongshu' ? '小红书文案' : '短视频脚本'}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 话题标签 */}
        <View style={styles.topicsSection}>
          <Text style={styles.topicsLabel}>选中的话题：</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topics.map((topic: string, idx: number) => (
              <View key={idx} style={styles.topicTag}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 备注信息 */}
        {remark && remark.trim() !== '' && (
          <View style={styles.remarkSection}>
            <Text style={styles.remarkLabel}>用户备注：</Text>
            <Text style={styles.remarkText}>{remark}</Text>
          </View>
        )}

        {/* 内容列表 */}
        <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
          {generatedContent && generatedContent.items.map((item: ContentItem, idx: number) => (
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
                  placeholder="请输入发布后的链接（如：小红书/抖音/知乎链接）"
                  placeholderTextColor="#B2BEC3"
                  value={item.publishLink}
                  onChangeText={(text) => handlePublishLinkChange(idx, text)}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 底部提交按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.footerButtonCancel]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonTextCancel}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleSubmitPublish}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6C63FF', '#896BFF']}
              style={styles.footerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.footerButtonTextConfirm}>提交发布链接</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
