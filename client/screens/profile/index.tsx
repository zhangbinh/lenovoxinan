import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { styles } from './styles';

interface PublishedContent {
  id: string;
  title: string;
  platform: string;
  link: string;
  publishDate: string;
  adviceCount: number;
}

export default function ProfileScreen() {
  const { storeId, storeName, logout } = useAuth();
  const router = useSafeRouter();
  const [publishedContents, setPublishedContents] = useState<PublishedContent[]>([
    {
      id: '1',
      title: '联想笔记本新品体验',
      platform: '小红书',
      link: 'https://example.com/post/123',
      publishDate: '2024-01-15',
      adviceCount: 3,
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContentLink, setNewContentLink] = useState('');

  const handleAddContent = async () => {
    if (!newContentLink.trim()) {
      Alert.alert('提示', '请输入内容链接');
      return;
    }

    try {
      // 简单判断平台
      let platform = 'unknown';
      const url = newContentLink.toLowerCase();
      if (url.includes('douyin')) {
        platform = 'douyin';
      } else if (url.includes('xiaohongshu') || url.includes('xhslink')) {
        platform = 'xiaohongshu';
      } else if (url.includes('zhihu')) {
        platform = 'zhihu';
      } else if (url.includes('toutiao') || url.includes('toutiaocdn')) {
        platform = 'toutiao';
      }

      // 调用后端API添加内容到定时任务监控
      /**
       * 服务端文件：server/src/routes/promotion.ts
       * 接口：POST /api/v1/promotion/content
       * Body 参数：storeId: string, publishUrl: string, platform: string, publishDate: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          publishUrl: newContentLink,
          platform,
          publishDate: new Date().toISOString().split('T')[0],
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newContent: PublishedContent = {
          id: result.data.contentId,
          title: '新发布内容',
          platform: getPlatformDisplayName(platform),
          link: newContentLink,
          publishDate: new Date().toISOString().split('T')[0],
          adviceCount: 0,
        };

        setPublishedContents([newContent, ...publishedContents]);
        setNewContentLink('');
        setShowAddModal(false);

        Alert.alert('成功', result.data.message);
      } else {
        Alert.alert('失败', result.message || '添加内容失败');
      }
    } catch (error) {
      console.error('添加内容失败:', error);
      Alert.alert('失败', '网络错误，请重试');
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    const platformNames: Record<string, string> = {
      douyin: '抖音',
      xiaohongshu: '小红书',
      zhihu: '知乎',
      toutiao: '今日头条',
    };
    return platformNames[platform] || '未知';
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部用户信息 */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>店</Text>
              </View>
              <View>
                <Text style={styles.storeName}>{storeName || '联想门店'}</Text>
                <Text style={styles.storeId}>编号：{storeId || '未设置'}</Text>
              </View>
            </View>

            {/* 添加内容按钮 */}
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6C63FF', '#896BFF']}
                style={styles.addButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.addButtonText}>+ 添加已发布内容</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 退出登录按钮 */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert('提示', '确定要退出登录吗？', [
                  { text: '取消', style: 'cancel' },
                  { text: '确定', onPress: logout }
                ]);
              }}
              activeOpacity={0.8}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>退出登录</Text>
            </TouchableOpacity>
          </View>

          {/* 已发布内容列表 */}
          <View style={styles.contentListSection}>
            <Text style={styles.sectionTitle}>已发布内容</Text>
            <Text style={styles.sectionDescription}>
              添加内容后，系统将在每天20点提供投流指导建议，连续15日
            </Text>

            {publishedContents.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>暂无已发布内容</Text>
                <Text style={styles.emptyHint}>点击上方按钮添加内容</Text>
              </View>
            ) : (
              publishedContents.map((content) => (
                <View key={content.id} style={styles.contentCard}>
                  <View style={styles.contentHeader}>
                    <View style={styles.platformBadge}>
                      <Text style={styles.platformText}>{content.platform}</Text>
                    </View>
                    <Text style={styles.publishDate}>{content.publishDate}</Text>
                  </View>
                  <Text style={styles.contentTitle}>{content.title}</Text>
                  <Text style={styles.contentLink} numberOfLines={1}>{content.link}</Text>

                  <View style={styles.adviceSection}>
                    <Text style={styles.adviceTitle}>
                      投流指导 ({content.adviceCount}/15)
                    </Text>
                    <Text style={styles.adviceDesc}>
                      每日20点更新投流建议
                    </Text>
                    <TouchableOpacity
                      style={styles.viewAdviceButton}
                      onPress={() => {
                        // 跳转到投流建议页面，传递发布链接和发布日期
                        router.push('/promotion-advice', {
                          publishUrl: content.link,
                          publishDate: content.publishDate,
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewAdviceButtonText}>
                        {content.adviceCount > 0 ? '查看最新建议' : '等待投流建议'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* 添加内容弹窗 */}
        {showAddModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>添加已发布内容</Text>
              <Text style={styles.modalDescription}>
                请输入已发布内容的链接，系统将根据发布时间提供15天投流指导
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="请输入内容链接（如小红书/抖音/知乎链接）"
                placeholderTextColor="#B2BEC3"
                value={newContentLink}
                onChangeText={setNewContentLink}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewContentLink('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonTextCancel}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleAddContent}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonTextConfirm}>确认添加</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
