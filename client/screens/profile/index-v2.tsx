import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import { styles } from './styles';

type PublishedContent = {
  id: number;
  platform: string;
  title: string;
  link: string;
  publishDate: string;
  adviceCount: number;
};

export default function ProfileScreen() {
  const { storeId, storeName, logout } = useAuth();
  const router = useSafeRouter();
  const [publishedContents, setPublishedContents] = useState<PublishedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContentLink, setNewContentLink] = useState('');

  const fetchPublishedContents = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/promotion/contents?storeId=${storeId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const now = new Date();
        const filtered = result.data.filter((item: PublishedContent) => {
          const publishDate = new Date(item.publishDate);
          const daysDiff = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysDiff <= 15;
        });
        setPublishedContents(filtered);
      }
    } catch (error) {
      console.error('获取已发布内容失败:', error);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useFocusEffect(
    useCallback(() => {
      fetchPublishedContents();
    }, [fetchPublishedContents])
  );

  const handleAddContent = async () => {
    if (!newContentLink.trim()) {
      Alert.alert('提示', '请输入内容链接');
      return;
    }
    try {
      let platform = 'unknown';
      const url = newContentLink.toLowerCase();
      if (url.includes('douyin')) platform = 'douyin';
      else if (url.includes('xiaohongshu') || url.includes('xhslink')) platform = 'xiaohongshu';
      else if (url.includes('zhihu')) platform = 'zhihu';
      else if (url.includes('toutiao') || url.includes('toutiaocdn')) platform = 'toutiao';

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
        Alert.alert('成功', result.data.message);
        setNewContentLink('');
        setShowAddModal(false);
        fetchPublishedContents();
      } else {
        Alert.alert('失败', result.message || '添加内容失败');
      }
    } catch (error) {
      console.error('添加内容失败:', error);
      Alert.alert('失败', '网络错误，请重试');
    }
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient colors={['#6C63FF', '#8B85FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{storeName?.charAt(0) || '店'}</Text>
                </View>
                <View style={styles.userText}>
                  <Text style={styles.userName}>{storeName}</Text>
                  <Text style={styles.userId}>编号: {storeId}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.functionSection}>
          <TouchableOpacity style={styles.functionItem} onPress={() => router.push('/promotion-advice')}>
            <View style={styles.functionIcon}>
              <FontAwesome6 name="lightbulb" size={24} color="#F59E0B" />
            </View>
            <View style={styles.functionText}>
              <Text style={styles.functionTitle}>智能投流建议</Text>
              <Text style={styles.functionDesc}>基于数据的15日投流指导</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.publishedSection}>
          <View style={styles.publishedHeader}>
            <Text style={styles.publishedTitle}>已发布内容</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.addButtonText}>+ 添加</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : publishedContents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无已发布内容</Text>
              <Text style={styles.emptyDesc}>添加发布链接后，系统将提供投流建议</Text>
            </View>
          ) : (
            publishedContents.map((item) => (
              <View key={item.id} style={styles.contentCard}>
                <View style={styles.contentHeader}>
                  <View style={styles.platformTag}>
                    <Text style={styles.platformText}>{item.platform}</Text>
                  </View>
                  <Text style={styles.publishDate}>{item.publishDate}</Text>
                </View>
                <Text style={styles.contentTitle}>{item.title}</Text>
                <Text style={styles.contentLink} numberOfLines={1}>{item.link}</Text>
                <TouchableOpacity style={styles.viewAdviceButton} onPress={() => router.push('/promotion-advice', { publishUrl: item.link, publishDate: item.publishDate })} activeOpacity={0.8}>
                  <Text style={styles.viewAdviceButtonText}>{item.adviceCount > 0 ? '查看最新建议' : '等待投流建议'}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </ScrollView>

      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>添加发布链接</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>内容链接</Text>
              <TextInput style={styles.modalInput} placeholder="请输入发布链接" placeholderTextColor="#B2BEC3" value={newContentLink} onChangeText={setNewContentLink} autoCapitalize="none" autoCorrect={false} />
              <Text style={styles.modalHint}>支持抖音、小红书、知乎、今日头条</Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalButtonTextCancel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleAddContent}>
                <Text style={styles.modalButtonTextConfirm}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}
