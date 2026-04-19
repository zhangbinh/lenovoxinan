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
  const [submittedLinks, setSubmittedLinks] = useState<Set<number>>(new Set());
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

  const handlePublishLinkChange = (itemIndex: number, link: string) => {
    setGeneratedContent((prev: any) => ({
      ...prev,
      items: prev.items.map((item: ContentItem, idx: number) =>
        idx === itemIndex ? { ...item, publishLink: link } : item
      ),
    }));
  };

  const handleSubmitPublish = async () => {
    const itemsWithLinks = generatedContent.items.filter((item: ContentItem) => item.publishLink.trim());

    if (itemsWithLinks.length === 0) {
      Alert.alert('提示', '请至少填写一个发布链接');
      return;
    }

    if (!storeId) {
      Alert.alert('错误', '请先登录');
      router.replace('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // 调用后端API，保存每条已发布的内容
      const savePromises = itemsWithLinks.map((item: ContentItem) => {
        // 判断平台
        let platform = 'unknown';
        const url = item.publishLink.toLowerCase();
        if (url.includes('douyin')) {
          platform = 'douyin';
        } else if (url.includes('xiaohongshu') || url.includes('xhslink')) {
          platform = 'xiaohongshu';
        } else if (url.includes('zhihu')) {
          platform = 'zhihu';
        } else if (url.includes('toutiao') || url.includes('toutiaocdn')) {
          platform = 'toutiao';
        }

        console.log(`提交内容: storeId=${storeId}, platform=${platform}, url=${item.publishLink}`);

        /**
         * 服务端文件：server/src/routes/promotion.ts
         * 接口：POST /api/v1/promotion/content
         * Body 参数：storeId: string, publishUrl: string, platform: string, publishDate: string
         */
        return fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId: storeId,
            publishUrl: item.publishLink,
            platform,
            publishDate: new Date().toISOString().split('T')[0],
          }),
        });
      });

      const results = await Promise.all(savePromises);

      // 检查是否有失败的请求
      const failedCount = results.filter(r => !r.ok).length;

      if (failedCount > 0) {
        console.error(`提交失败: ${failedCount}/${itemsWithLinks.length}`);
        Alert.alert('部分失败', `${itemsWithLinks.length - failedCount}条内容提交成功，${failedCount}条内容提交失败，请重试`);
        setIsSubmitting(false);
        return;
      }

      // 更新已提交链接的状态
      const newSubmittedLinks = new Set(submittedLinks);
      itemsWithLinks.forEach((item: ContentItem) => {
        newSubmittedLinks.add(item.index);
      });
      setSubmittedLinks(newSubmittedLinks);

      Alert.alert('提交成功', `已成功提交${itemsWithLinks.length}条内容的发布链接！\n\n系统将在每天20点提供投流指导建议，你可以在"投流指导"页面查看。`, [
        { text: '确定', onPress: () => setIsSubmitting(false) }
      ]);
    } catch (error) {
      console.error('提交发布链接失败:', error);
      Alert.alert('提交失败', '网络错误，请重试');
      setIsSubmitting(false);
    }
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
            const isSubmitted = submittedLinks.has(item.index);
            return (
              <View key={idx} style={[styles.contentItem, isSubmitted && styles.contentItemSubmitted]}>
                <View style={styles.contentItemHeader}>
                  <View style={styles.contentIndex}>
                    <Text style={styles.contentIndexText}>{item.index}</Text>
                  </View>
                  {item.title && (
                    <Text style={styles.contentItemTitle}>{item.title}</Text>
                  )}
                  {isSubmitted && (
                    <View style={styles.submittedBadge}>
                      <Text style={styles.submittedBadgeText}>✓ 已提交</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contentItemText}>{item.text}</Text>
                <View style={styles.publishSection}>
                  <Text style={styles.publishLabel}>已发布链接（选填）</Text>
                  <TextInput
                    style={[styles.publishInput, isSubmitted && styles.publishInputSubmitted]}
                    placeholder="请输入发布后的链接（如：小红书/抖音/知乎链接）"
                    placeholderTextColor="#B2BEC3"
                    value={item.publishLink}
                    onChangeText={(text) => handlePublishLinkChange(idx, text)}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    editable={!isSubmitted}
                  />
                  {isSubmitted && (
                    <Text style={styles.submittedHint}>该链接已提交，无法修改</Text>
                  )}
                </View>
              </View>
            );
          })}
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
      </KeyboardAvoidingView>
    </Screen>
  );
}
