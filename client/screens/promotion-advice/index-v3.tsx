import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

type PlatformType = 'douyin' | 'xiaohongshu';

interface PlatformOption {
  platform: PlatformType;
  displayName: string;
  icon: string;
}

interface PublishedContent {
  id: number;
  platform: PlatformType;
  title: string;
  link: string;
  publishDate: string;
  adviceCount: number;
}

const platforms: PlatformOption[] = [
  { platform: 'douyin', displayName: '抖音', icon: 'music' },
  { platform: 'xiaohongshu', displayName: '小红书', icon: 'heart' },
];

const styles = {
  container: {
    flex: 1,
  } as const,
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 8,
  } as const,
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  } as const,
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 12,
  } as const,
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  } as const,
  input: {
    fontSize: 16,
    color: '#1F2937',
  } as const,
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 24,
  } as const,
  submitButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    marginBottom: 24,
  } as const,
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  } as const,
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  } as const,
  recommendationCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  } as const,
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 8,
  } as const,
  recommendationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  } as const,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  } as const,
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1F2937',
  } as const,
  modalButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center' as const,
    marginTop: 16,
  } as const,
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  } as const,
};

export default function PromotionAdviceV3() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ publishUrl?: string; publishDate?: string }>();
  const { storeId } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [publishUrl, setPublishUrl] = useState(params.publishUrl || '');
  const [publishDate, setPublishDate] = useState(params.publishDate || new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(publishDate);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [publishedContents, setPublishedContents] = useState<PublishedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<PublishedContent | null>(null);
  const [loadingContents, setLoadingContents] = useState(false);

  // 加载已发布内容
  const fetchPublishedContents = React.useCallback(async () => {
    if (!storeId) return;

    setLoadingContents(true);
    try {
      /**
       * 服务端文件：server/src/routes/promotion.ts
       * 接口：GET /api/v1/promotion/contents?storeId=xxx
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/contents?storeId=${storeId}`
      );
      const result = await response.json();

      if (result.success) {
        setPublishedContents(result.data || []);
      }
    } catch (error) {
      console.error('获取已发布内容失败:', error);
    } finally {
      setLoadingContents(false);
    }
  }, [storeId]);

  React.useEffect(() => {
    if (params.publishUrl && params.publishDate) {
      setSelectedPlatform(null);
    }
    fetchPublishedContents();
  }, [params.publishUrl, params.publishDate, fetchPublishedContents]);

  const handleDateChange = (date: Date) => {
    setTempDate(date.toISOString().split('T')[0]);
  };

  const handleConfirmDate = () => {
    setPublishDate(tempDate);
    setShowDatePicker(false);
  };

  const handleContentSelect = (content: PublishedContent) => {
    setSelectedContent(content);
    setSelectedPlatform(content.platform);
    setPublishUrl(content.link);
    setPublishDate(content.publishDate);
  };

  const handleSubmit = async () => {
    if (!selectedPlatform || !publishUrl || !publishDate) {
      alert('请填写所有必填项');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      /**
       * 服务端文件：server/src/routes/promotion.ts
       * 接口：POST /api/v1/promotion/advice
       * Body 参数：publishUrl: string, platform: string, publishDate: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishUrl,
          platform: selectedPlatform,
          publishDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAdvice(result.data);
      } else {
        alert(result.message || '获取投流建议失败');
      }
    } catch (error) {
      console.error('获取投流建议失败:', error);
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <View style={{ padding: 24 }}>
          {/* 标题 */}
          <Text style={styles.title}>智能投流分析</Text>
          <Text style={styles.subtitle}>基于AI算法的专业投流建议与数据分析</Text>

          {/* 已发布内容列表 */}
          {publishedContents.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>选择已发布内容</Text>
              <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
                {publishedContents.map((content) => (
                  <TouchableOpacity
                    key={content.id}
                    onPress={() => handleContentSelect(content)}
                    style={{
                      backgroundColor: selectedContent?.id === content.id ? '#6C63FF' : '#F3F4F6',
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: selectedContent?.id === content.id ? '#6C63FF' : '#E5E7EB',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: selectedContent?.id === content.id ? 'rgba(255,255,255,0.2)' : 'rgba(108,99,255,0.1)',
                        justifyContent: 'center' as const,
                        alignItems: 'center' as const,
                        marginRight: 12,
                      }}>
                        <FontAwesome6
                          name={content.platform === 'douyin' ? 'music' : 'heart'}
                          size={16}
                          color={selectedContent?.id === content.id ? '#FFFFFF' : '#6C63FF'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: selectedContent?.id === content.id ? '#FFFFFF' : '#1F2937',
                        }}>
                          {content.platform === 'douyin' ? '抖音' : '小红书'} - {content.title}
                        </Text>
                        <Text style={{
                          fontSize: 11,
                          color: selectedContent?.id === content.id ? 'rgba(255,255,255,0.8)' : '#6B7280',
                        }}>
                          发布于: {content.publishDate}
                        </Text>
                      </View>
                      {selectedContent?.id === content.id && (
                        <FontAwesome6 name="circle-check" size={20} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* 手动输入 */}
          <TouchableOpacity
            onPress={() => {
              setSelectedContent(null);
              setPublishUrl('');
              setPublishDate(new Date().toISOString().split('T')[0]);
            }}
            style={{ marginBottom: 24 }}
          >
            <Text style={{ fontSize: 14, color: '#6C63FF', fontWeight: '600' }}>
              + 手动输入新的发布链接
            </Text>
          </TouchableOpacity>

          {/* 平台选择 */}
          {!selectedContent && (
            <>
              <Text style={styles.sectionLabel}>选择发布平台 *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
                {platforms.map((item) => (
                  <TouchableOpacity
                    key={item.platform}
                    onPress={() => setSelectedPlatform(item.platform)}
                    style={{
                      flex: 1,
                      minWidth: 140,
                      padding: 16,
                      borderRadius: 16,
                      borderWidth: 2,
                      alignItems: 'center' as const,
                      marginRight: 12,
                      marginBottom: 12,
                      backgroundColor: selectedPlatform === item.platform ? 'rgba(108, 99, 255, 0.05)' : '#FFFFFF',
                      borderColor: selectedPlatform === item.platform ? '#6C63FF' : '#E5E7EB',
                    }}
                  >
                    <FontAwesome6
                      name={item.icon as any}
                      size={24}
                      color={selectedPlatform === item.platform ? '#6C63FF' : '#6B7280'}
                      style={{ marginBottom: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: selectedPlatform === item.platform ? '#6C63FF' : '#6B7280',
                      }}
                    >
                      {item.displayName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* 发布链接 */}
          <Text style={styles.sectionLabel}>发布链接 *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="输入发布链接"
              placeholderTextColor="#9CA3AF"
              value={publishUrl}
              onChangeText={setPublishUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!selectedContent}
            />
          </View>
          <Text style={styles.hint}>示例：https://www.douyin.com/video/123456789</Text>

          {/* 发布日期 */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>发布日期 *</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
            disabled={!!selectedContent}
          >
            <Text style={[styles.input, selectedContent && { color: '#9CA3AF' }]}>{publishDate}</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>请选择内容发布的日期</Text>

          {/* 提交按钮 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>开始分析</Text>
            )}
          </TouchableOpacity>

          {/* 分析结果 */}
          {advice && (
            <>
              {/* 投流建议 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>投流建议</Text>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="money-bill-wave" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>投流决策</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.recommendation.decision}
                  </Text>
                </View>

                {advice.platform === 'douyin' && (
                  <View style={styles.recommendationCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <FontAwesome6 name="bullhorn" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text style={styles.recommendationTitle}>投流工具选择</Text>
                    </View>
                    <Text style={styles.recommendationText}>
                      {advice.recommendation.tool}
                    </Text>
                  </View>
                )}

                {advice.platform === 'xiaohongshu' && (
                  <View style={styles.recommendationCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <FontAwesome6 name="location-dot" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text style={styles.recommendationTitle}>投流范围</Text>
                    </View>
                    <Text style={styles.recommendationText}>
                      {advice.recommendation.scope}
                    </Text>
                  </View>
                )}

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="triangle-exclamation" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>注意事项</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.recommendation.notice}
                  </Text>
                </View>
              </View>

              {/* 优化建议 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>优化建议</Text>
                {advice.advice && advice.advice.map((item: string, index: number) => (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' }}>
                    <FontAwesome6 name="lightbulb" size={16} color="#F59E0B" style={{ marginRight: 10, marginTop: 2 }} />
                    <Text style={{ fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 }}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* 预算建议 */}
              {advice.budget && (
                <View style={styles.resultCard}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>投流预算建议</Text>
                  <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>{advice.budget}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* 日期选择器 Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>选择发布日期</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={{ color: '#6C63FF', fontWeight: '600' }}>取消</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={new Date(tempDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      handleDateChange(selectedDate);
                    }
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                  nativeID="publishDatePicker"
                />

                {Platform.OS === 'web' && (
                  <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                      Web平台日期选择器：
                    </Text>
                    <input
                      type="date"
                      value={tempDate}
                      max={new Date().toISOString().split('T')[0]}
                      min={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e: any) => handleDateChange(new Date(e.target.value))}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #E5E7EB',
                        fontSize: 16,
                      }}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmDate}
                >
                  <Text style={styles.modalButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </Screen>
  );
}
