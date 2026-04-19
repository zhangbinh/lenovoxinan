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
  strategyTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  } as const,
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  } as const,
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  } as const,
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  } as const,
  tableCell: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    flex: 1,
  } as const,
  tableHighlight: {
    color: '#059669',
    fontWeight: '600',
  } as const,
  strategyHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  } as const,
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  } as const,
  metricCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center' as const,
  } as const,
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 4,
  } as const,
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  } as const,
};

export default function PromotionAdviceV3() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ publishUrl?: string; publishDate?: string }>();
  const { storeId } = useAuth();
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
    fetchPublishedContents();
  }, [fetchPublishedContents]);

  const handleDateChange = (date: Date) => {
    setTempDate(date.toISOString().split('T')[0]);
  };

  const handleConfirmDate = () => {
    setPublishDate(tempDate);
    setShowDatePicker(false);
  };

  const handleContentSelect = (content: PublishedContent) => {
    setSelectedContent(content);
    setPublishUrl(content.link);
    setPublishDate(content.publishDate);
  };

  const handleSubmit = async () => {
    if (!publishUrl || !publishDate) {
      alert('请填写所有必填项');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      /**
       * 服务端文件：server/src/routes/promotion.ts
       * 接口：POST /api/v1/promotion/advice
       * Body 参数：publishUrl: string, publishDate: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishUrl,
          publishDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAdvice(result.data);
      } else {
        alert(result.message || '获取内容运营建议失败');
      }
    } catch (error) {
      console.error('获取内容运营建议失败:', error);
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
          <Text style={styles.title}>内容运营建议</Text>
          <Text style={styles.subtitle}>基于数据的小红书和抖音双平台加热策略分析</Text>

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
              {/* 数据概览 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>数据概览</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{advice.metrics.views.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>播放/阅读量</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{advice.metrics.likes.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>点赞数</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{advice.metrics.comments.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>评论数</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{advice.metrics.shares.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>分享数</Text>
                  </View>
                </View>
              </View>

              {/* 小红书加热建议 */}
              <View style={styles.resultCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <FontAwesome6 name="heart" size={24} color="#FF2442" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>小红书加热建议</Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="money-bill-wave" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>投流决策</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.xiaohongshu.recommendation.decision}
                  </Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="location-dot" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>投流范围</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.xiaohongshu.recommendation.scope}
                  </Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="triangle-exclamation" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>注意事项</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.xiaohongshu.recommendation.notice}
                  </Text>
                </View>

                {/* 小红书加热策略表格 */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>加热策略参考</Text>
                <View style={styles.strategyTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>互动率</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>建议</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>方式</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>预算</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>{"\u003e"} 2.5%</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>✅ 加热</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>薯条加热</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>50-150元</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>1%~2.5%</Text>
                    <Text style={styles.tableCell}>⚠️ 测试</Text>
                    <Text style={styles.tableCell}>薯条低预算</Text>
                    <Text style={styles.tableCell}>30-80元</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{"\u003c"} 1%</Text>
                    <Text style={styles.tableCell}>❌ 不加热</Text>
                    <Text style={styles.tableCell}>—</Text>
                    <Text style={styles.tableCell}>—</Text>
                  </View>
                </View>
              </View>

              {/* 抖音加热建议 */}
              <View style={styles.resultCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <FontAwesome6 name="music" size={24} color="#000000" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>抖音加热建议</Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="money-bill-wave" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>投流决策</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.douyin.recommendation.decision}
                  </Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="bullhorn" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>投流工具选择</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.douyin.recommendation.tool}
                  </Text>
                </View>

                <View style={styles.recommendationCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FontAwesome6 name="triangle-exclamation" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={styles.recommendationTitle}>注意事项</Text>
                  </View>
                  <Text style={styles.recommendationText}>
                    {advice.douyin.recommendation.notice}
                  </Text>
                </View>

                {/* 抖音加热策略表格 */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>加热策略参考</Text>
                <View style={styles.strategyTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>互动率</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>建议</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>方式</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>预算</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>目的</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>{"\u003e"} 3% 且点赞{"\u003e"}100</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>✅ 规模化</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>巨量本地推</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>100-300元/天</Text>
                    <Text style={[styles.tableCell, styles.tableHighlight]}>引流到店</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>1.5%~3%</Text>
                    <Text style={styles.tableCell}>⚠️ DOU+测试</Text>
                    <Text style={styles.tableCell}>DOU+</Text>
                    <Text style={styles.tableCell}>50-100元</Text>
                    <Text style={styles.tableCell}>提升互动</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>0.8%~1.5%</Text>
                    <Text style={styles.tableCell}>⚠️ 低预算</Text>
                    <Text style={styles.tableCell}>DOU+低预算</Text>
                    <Text style={styles.tableCell}>30-50元</Text>
                    <Text style={styles.tableCell}>测试潜力</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{"\u003c"} 0.8%</Text>
                    <Text style={styles.tableCell}>❌ 不加热</Text>
                    <Text style={styles.tableCell}>—</Text>
                    <Text style={styles.tableCell}>—</Text>
                    <Text style={styles.tableCell}>—</Text>
                  </View>
                </View>
              </View>
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
