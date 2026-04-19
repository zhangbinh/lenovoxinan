import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

type PlatformType = 'douyin' | 'xiaohongshu' | 'zhihu' | 'toutiao';

interface PlatformOption {
  platform: PlatformType;
  displayName: string;
  icon: string;
}

const platforms: PlatformOption[] = [
  { platform: 'douyin', displayName: '抖音', icon: 'music' },
  { platform: 'xiaohongshu', displayName: '小红书', icon: 'heart' },
];

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
      <ScrollView className="flex-1 p-6">
        {/* 标题 */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            智能投流建议
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            输入发布链接，获取15日投流指导建议
          </Text>
        </View>

        {/* 平台选择 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            选择发布平台 *
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {platforms.map((item) => (
              <TouchableOpacity
                key={item.platform}
                onPress={() => setSelectedPlatform(item.platform)}
                className={`flex-1 min-w-[100px] p-4 rounded-2xl border-2 ${
                  selectedPlatform === item.platform
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
                style={{ minWidth: '45%' }}
              >
                <FontAwesome6
                  name={item.icon as any}
                  size={24}
                  color={selectedPlatform === item.platform ? '#6C63FF' : '#6B7280'}
                  style={{ marginBottom: 8 }}
                />
                <Text
                  className={`text-center text-sm font-medium ${
                    selectedPlatform === item.platform
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.displayName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 发布链接 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            发布链接 *
          </Text>
          <TextInput
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-base text-gray-900 dark:text-white"
            placeholder="输入发布链接"
            placeholderTextColor="#9CA3AF"
            value={publishUrl}
            onChangeText={setPublishUrl}
          />
          <Text className="text-xs text-gray-400 mt-2">
            示例：https://www.douyin.com/video/123456789
          </Text>
        </View>

        {/* 发布日期 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            发布日期 *
          </Text>
          <TouchableOpacity
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-base text-gray-900 dark:text-white">
              {publishDate}
            </Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-400 mt-2">
            请选择内容发布的日期
          </Text>
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="bg-purple-500 rounded-2xl p-4 items-center mb-6"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold text-base">获取投流建议</Text>
          )}
        </TouchableOpacity>

        {/* 投流建议结果 */}
        {advice && (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            {/* 是否建议投流 */}
            <View
              className={`flex-row items-center mb-4 p-4 rounded-xl ${
                advice.shouldPromote
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-900/20'
              }`}
            >
              <FontAwesome6
                name={advice.shouldPromote ? 'check-circle' : 'times-circle'}
                size={24}
                color={advice.shouldPromote ? '#10B981' : '#6B7280'}
              />
              <Text className="ml-3 font-semibold text-base">
                {advice.shouldPromote ? '建议继续投流' : '建议暂停投流'}
              </Text>
            </View>

            {/* 发布天数 */}
            <View className="mb-4">
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">发布天数</Text>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {advice.daysSincePublish} 天
              </Text>
            </View>

            {/* 数据指标 */}
            {advice.metrics && (
              <View className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  数据指标
                </Text>
                <View className="grid grid-cols-2 gap-3">
                  <View>
                    <Text className="text-xs text-gray-500">播放量/阅读量</Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {advice.metrics.views.toLocaleString()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500">点赞数</Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {advice.metrics.likes.toLocaleString()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500">评论数</Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {advice.metrics.comments.toLocaleString()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500">分享数</Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {advice.metrics.shares.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* 投流建议 */}
            {advice.advice && advice.advice.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  投流建议
                </Text>
                {advice.advice.map((item: string, index: number) => (
                  <View key={index} className="flex-row mb-2">
                    <FontAwesome6 name="lightbulb" size={16} color="#6C63FF" />
                    <Text className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* 建议预算 */}
            {advice.budget && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  建议预算
                </Text>
                <Text className="text-base text-gray-900 dark:text-white">{advice.budget}</Text>
              </View>
            )}

            {/* 建议投放时段 */}
            {advice.timing && advice.timing.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  建议投放时段
                </Text>
                {advice.timing.map((item: string, index: number) => (
                  <View key={index} className="flex-row mb-2">
                    <FontAwesome6 name="clock" size={16} color="#6C63FF" />
                    <Text className="ml-2 text-sm text-gray-700 dark:text-gray-300">{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 建议定向人群 */}
            {advice.targeting && advice.targeting.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  建议定向人群
                </Text>
                <View className="flex flex-wrap gap-2">
                  {advice.targeting.map((item: string, index: number) => (
                    <View
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full"
                    >
                      <Text className="text-xs text-purple-700 dark:text-purple-300">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 投流技巧 */}
            {advice.tips && advice.tips.length > 0 && (
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  投流技巧
                </Text>
                {advice.tips.map((item: string, index: number) => (
                  <View key={index} className="flex-row mb-2">
                    <FontAwesome6 name="star" size={16} color="#F59E0B" />
                    <Text className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

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
            <View className="flex-1 justify-end">
              <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    选择发布日期
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-purple-500 font-medium">取消</Text>
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
                  minimumDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)} // 最多30天前
                />

                <TouchableOpacity
                  className="bg-purple-500 rounded-2xl p-4 items-center mt-4"
                  onPress={handleConfirmDate}
                >
                  <Text className="text-white font-semibold">确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </Screen>
  );
}
