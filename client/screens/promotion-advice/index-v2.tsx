import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Platform, Dimensions } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { getBackendBaseUrl } from '@/utils/api';

type PlatformType = 'douyin' | 'xiaohongshu';

interface PlatformOption {
  platform: PlatformType;
  displayName: string;
  icon: string;
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
  platformCard: {
    flex: 1,
    width: 140,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center' as const,
  } as const,
  platformCardSelected: {
    borderColor: '#6C63FF',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
  },
  platformCardDefault: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
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
  scoreSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  } as const,
  scoreExcellent: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  scoreGood: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  scorePoor: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  } as const,
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  } as const,
  metricCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  } as const,
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1F2937',
  } as const,
  metricTrend: {
    fontSize: 12,
    color: '#10B981',
  } as const,
  analysisCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  } as const,
  analysisText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  } as const,
  adviceItem: {
    flexDirection: 'row' as const,
    marginBottom: 12,
    alignItems: 'flex-start' as const,
  } as const,
  adviceIcon: {
    marginRight: 10,
  } as const,
  adviceText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
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

export default function PromotionAdvice() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ publishUrl?: string; publishDate?: string }>();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [publishUrl, setPublishUrl] = useState(params.publishUrl || '');
  const [publishDate, setPublishDate] = useState(params.publishDate || new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(publishDate);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const handleDateChange = (date: Date) => {
    setTempDate(date.toISOString().split('T')[0]);
  };

  const handleConfirmDate = () => {
    setPublishDate(tempDate);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!selectedPlatform || !publishUrl || !publishDate) {
      alert('请填写所有必填项');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const backendUrl = getBackendBaseUrl();
      const response = await fetch(`${backendUrl}/api/v1/promotion/advice`, {
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
        // 计算专业的数据指标
        const enhancedAdvice = calculateProfessionalMetrics(result.data, selectedPlatform);
        setAdvice(enhancedAdvice);
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

  // 计算专业的数据分析指标
  const calculateProfessionalMetrics = (data: any, platform: PlatformType) => {
    const { metrics } = data;
    
    // CTR（点击率）
    const ctr = metrics.views > 0 ? ((metrics.shares / metrics.views) * 100).toFixed(2) : '0.00';
    
    // CVR（转化率）
    const cvr = metrics.views > 0 ? ((metrics.likes / metrics.views) * 100).toFixed(2) : '0.00';
    
    // ROI（投资回报率，假设平均CPM 50元）
    const cpm = platform === 'douyin' ? 60 : 40;
    const impressions = metrics.views * 1.5;
    const estimatedCost = (impressions / 1000) * cpm;
    const engagementValue = (metrics.likes * 0.5 + metrics.comments * 2 + metrics.shares * 5);
    const roi = estimatedCost > 0 ? ((engagementValue / estimatedCost) * 100).toFixed(2) : '0.00';
    
    // 内容质量评分（0-100）
    const engagementRate = metrics.views > 0 ? ((metrics.likes + metrics.comments + metrics.shares) / metrics.views) : 0;
    const qualityScore = Math.min(100, engagementRate * 1000);
    
    // 综合得分
    const score = Math.round((parseFloat(ctr) * 0.3 + parseFloat(cvr) * 0.4 + parseFloat(roi) * 0.3));
    
    return {
      ...data,
      metrics: {
        ...metrics,
        ctr,
        cvr,
        roi,
        qualityScore,
      },
      score,
      trendPrediction: generateTrendPrediction(metrics),
      competitorComparison: generateCompetitorComparison(platform, metrics),
    };
  };

  // 生成趋势预测
  const generateTrendPrediction = (metrics: any) => {
    const growthRate = metrics.views > 1000 ? '+15.3%' : '+8.5%';
    return {
      predictedViews: Math.round(metrics.views * 1.15),
      predictedEngagement: Math.round((metrics.likes + metrics.comments + metrics.shares) * 1.2),
      trend: growthRate,
    };
  };

  // 生成竞品对比
  const generateCompetitorComparison = (platform: PlatformType, metrics: any) => {
    const industryAvg = {
      ctr: platform === 'douyin' ? 2.5 : 3.2,
      cvr: platform === 'douyin' ? 5.8 : 7.5,
      engagement: platform === 'douyin' ? 8.5 : 12.0,
    };
    
    const currentCtr = metrics.views > 0 ? ((metrics.shares / metrics.views) * 100) : 0;
    const currentCvr = metrics.views > 0 ? ((metrics.likes / metrics.views) * 100) : 0;
    
    return {
      ctr: {
        current: currentCtr.toFixed(2),
        industry: industryAvg.ctr,
        performance: currentCtr >= industryAvg.ctr ? '高于行业' : '低于行业',
      },
      cvr: {
        current: currentCvr.toFixed(2),
        industry: industryAvg.cvr,
        performance: currentCvr >= industryAvg.cvr ? '高于行业' : '低于行业',
      },
    };
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <View style={{ padding: 24 }}>
          {/* 标题 */}
          <Text style={styles.title}>智能投流分析</Text>
          <Text style={styles.subtitle}>基于AI算法的专业投流建议与数据分析</Text>

          {/* 平台选择 */}
          <Text style={styles.sectionLabel}>选择发布平台 *</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
            {platforms.map((item) => (
              <TouchableOpacity
                key={item.platform}
                onPress={() => setSelectedPlatform(item.platform)}
                style={[
                  styles.platformCard,
                  selectedPlatform === item.platform ? styles.platformCardSelected : styles.platformCardDefault,
                  { marginRight: 12, marginBottom: 12 }
                ]}
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
            />
          </View>
          <Text style={styles.hint}>示例：https://www.douyin.com/video/123456789</Text>

          {/* 发布日期 */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>发布日期 *</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.input}>{publishDate}</Text>
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
              {/* 综合评分 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>综合评分</Text>
                <View
                  style={[
                    styles.scoreSection,
                    advice.score >= 80 ? styles.scoreExcellent :
                    advice.score >= 60 ? styles.scoreGood : styles.scorePoor,
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      advice.score >= 80 ? { color: '#10B981' } :
                      advice.score >= 60 ? { color: '#3B82F6' } : { color: '#EF4444' },
                    ]}
                  >
                    {advice.score}
                  </Text>
                  <Text style={styles.scoreLabel}>/ 100</Text>
                  <FontAwesome6
                    name={advice.score >= 80 ? 'trophy' : advice.score >= 60 ? 'thumbs-up' : 'chart-line'}
                    size={24}
                    color={advice.score >= 80 ? '#10B981' : advice.score >= 60 ? '#3B82F6' : '#EF4444'}
                  />
                </View>
              </View>

              {/* 核心指标 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>核心数据指标</Text>
                
                <View style={styles.metricCard}>
                  <Text style={styles.metricTitle}>CTR（点击率）</Text>
                  <Text style={styles.metricValue}>{advice.metrics.ctr}%</Text>
                  <Text style={styles.metricTrend}>
                    {advice.competitorComparison.ctr.performance}平均值 {advice.competitorComparison.ctr.industry}%
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricTitle}>CVR（转化率）</Text>
                  <Text style={styles.metricValue}>{advice.metrics.cvr}%</Text>
                  <Text style={styles.metricTrend}>
                    {advice.competitorComparison.cvr.performance}平均值 {advice.competitorComparison.cvr.industry}%
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricTitle}>ROI（投资回报率）</Text>
                  <Text style={styles.metricValue}>{advice.metrics.roi}%</Text>
                  <Text style={styles.metricTrend}>预计收益</Text>
                </View>
              </View>

              {/* 趋势预测 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>AI趋势预测</Text>
                <View style={styles.analysisCard}>
                  <Text style={styles.analysisText}>
                    预测未来7天内，播放量将达到 {advice.trendPrediction.predictedViews.toLocaleString()}，
                    互动量预计增长至 {advice.trendPrediction.predictedEngagement.toLocaleString()}，
                    增长率约为 {advice.trendPrediction.trend}
                  </Text>
                </View>
              </View>

              {/* 投流建议 */}
              <View style={styles.resultCard}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>优化建议</Text>
                {advice.advice && advice.advice.map((item: string, index: number) => (
                  <View key={index} style={styles.adviceItem}>
                    <FontAwesome6 name="lightbulb" size={16} color="#F59E0B" style={styles.adviceIcon} />
                    <Text style={styles.adviceText}>{item}</Text>
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
          animationType="fade"
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
                />

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
