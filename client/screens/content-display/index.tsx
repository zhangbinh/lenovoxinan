import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { styles } from './styles';

interface ContentItem {
  index: number;
  text: string;
  title?: string;
  publishLink: string;
}

export default function ContentDisplayScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{
    type: 'xiaohongshu' | 'video';
    topics: string;
    remark?: string;
  }>();
  const { storeId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contentType] = useState<'xiaohongshu' | 'video'>(params.type || 'xiaohongshu');
  const [topics] = useState(params.topics ? JSON.parse(params.topics) : []);
  const remark = params.remark || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateContent = async () => {
    if (topics.length === 0) {
      Alert.alert('错误', '缺少话题参数');
      router.back();
      return;
    }

    setLoading(true);
    try {
      console.log('生成内容参数:', { topics, type: contentType, remark });

      /**
       * 服务端文件：server/src/routes/content.ts
       * 接口：POST /api/v1/content/generate
       * Body 参数：topics: string[], type: string, remark: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          topics,
          type: contentType,
          remark: remark,
        }),
      });

      const data = await response.json();

      console.log('API响应:', data);

      if (response.ok && data.contents) {
        // 根据类型提取对应内容
        if (contentType === 'xiaohongshu') {
          const xiaohongshuContent = data.contents.find((c: any) => c.type === 'xiaohongshu');
          if (xiaohongshuContent && xiaohongshuContent.contents) {
            console.log('小红书内容:', xiaohongshuContent.contents);
            setGeneratedContent({
              title: xiaohongshuContent.title,
              items: xiaohongshuContent.contents.map((text: string, idx: number) => ({
                index: idx + 1,
                text: text, // JSON.parse会自动解码Unicode转义序列
                publishLink: '',
              })),
            });
          } else {
            Alert.alert('错误', '未找到小红书内容');
            router.back();
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
              if (content.contents) {
                console.log(`${content.title}:`, content.contents);
                content.contents.forEach((item: string) => {
                  allItems.push({
                    title: content.title,
                    text: item, // JSON.parse会自动解码Unicode转义序列
                    index: allItems.length + 1,
                    publishLink: '',
                  });
                });
              }
            });
            console.log('短视频脚本总数:', allItems.length);
            setGeneratedContent({
              title: '短视频脚本',
              items: allItems,
            });
          } else {
            Alert.alert('错误', '未找到短视频内容');
            router.back();
          }
        }
      } else {
        Alert.alert('错误', data.message || '生成内容失败');
        router.back();
      }
    } catch (error) {
      console.error('生成内容失败:', error);
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
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
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topics.map((topic: string, idx: number) => (
                <View key={idx} style={styles.topicTag}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 备注信息 */}
        {remark && remark.trim() !== '' && (
          <View style={styles.remarkSection}>
            <Text style={styles.remarkLabel}>用户备注：</Text>
            <Text style={styles.remarkText}>{remark}</Text>
          </View>
        )}

        {/* 内容列表 */}
        <ScrollView
          style={styles.contentList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        >
          {generatedContent && generatedContent.items.map((item: ContentItem, idx: number) => {
            return (
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
                    onChangeText={(text) => setGeneratedContent((prev: any) => ({
                      ...prev,
                      items: prev.items.map((i: ContentItem, iIdx: number) =>
                        iIdx === idx ? { ...i, publishLink: text } : i
                      ),
                    }))}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
