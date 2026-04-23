import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import * as Updates from 'expo-updates';
import { VersionService } from '@/utils/versionService';
import { getBackendBaseUrl } from '@/utils/api';
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
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('1.0.0');

  // 获取当前版本号
  const getCurrentVersion = useCallback(() => {
    if (!__DEV__) {
      const version = VersionService.getCurrentVersion();
      setCurrentVersion(version);
    } else {
      setCurrentVersion('1.0.0 (开发版)');
    }
  }, []);

  // 检查更新
  const checkForUpdate = useCallback(async () => {
    setIsCheckingUpdate(true);
    try {
      const result = await VersionService.checkForUpdate();

      if (result) {
        if (result.needsForceUpdate || result.forceUpdate) {
          // 强制更新
          Alert.alert(
            '需要更新',
            `${result.updateMessage}\n\n当前版本: ${result.currentVersion}\n最新版本: ${result.latestVersion}`,
            [
              {
                text: '立即更新',
                onPress: async () => {
                  const updated = await VersionService.fetchAndInstallUpdate();
                  if (updated) {
                    Alert.alert('更新成功', '应用将重启以应用更新。', [
                      {
                        text: '确定',
                        onPress: () => VersionService.reloadApp(),
                      },
                    ]);
                  }
                },
                style: 'destructive',
              },
            ]
          );
        } else if (result.needsUpdate) {
          // 可选更新
          setUpdateAvailable(true);
          Alert.alert(
            '发现新版本',
            `${result.updateMessage}\n\n当前版本: ${result.currentVersion}\n最新版本: ${result.latestVersion}`,
            [
              { text: '暂不更新', style: 'cancel' },
              {
                text: '立即更新',
                onPress: async () => {
                  const updated = await VersionService.fetchAndInstallUpdate();
                  if (updated) {
                    Alert.alert('更新成功', '应用将重启以应用更新。', [
                      {
                        text: '确定',
                        onPress: () => VersionService.reloadApp(),
                      },
                    ]);
                  }
                },
              },
            ]
          );
        } else {
          // 已是最新版本
          setUpdateAvailable(false);
          Alert.alert('已是最新', '当前应用已是最新版本');
        }
      }
    } catch (error) {
      console.error('检查更新失败:', error);
      Alert.alert('检查失败', '网络错误，请稍后重试');
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  const fetchPublishedContents = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const backendUrl = getBackendBaseUrl();
      const response = await fetch(`${backendUrl}/api/v1/promotion/contents?storeId=${storeId}`);
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

  // 页面加载时获取版本号
  useFocusEffect(
    useCallback(() => {
      getCurrentVersion();
    }, [getCurrentVersion])
  );

  // 页面加载时获取已发布内容
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

      const backendUrl = getBackendBaseUrl();
      const response = await fetch(`${backendUrl}/api/v1/promotion/content`, {
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
              <View style={styles.versionInfo}>
                <Text style={styles.versionText}>v{currentVersion}</Text>
                {updateAvailable && (
                  <View style={styles.updateBadge}>
                    <Text style={styles.updateBadgeText}>有更新</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 内容运营建议 */}
        <View style={styles.functionSection}>
          <View style={styles.functionTitleRow}>
            <View style={styles.functionTitleLeft}>
              <View style={styles.functionIcon}>
                <FontAwesome6 name="lightbulb" size={24} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.functionTitle}>内容运营建议</Text>
                <Text style={styles.functionDesc}>基于数据的内容运营</Text>
              </View>
            </View>
          </View>

          <View style={styles.platformButtons}>
            <TouchableOpacity
              style={styles.platformButton}
              onPress={() => router.push('/content-operation-input', { platform: 'xiaohongshu' })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF2442', '#FF6B6B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.platformButtonGradient}
              >
                <FontAwesome6 name="heart" size={20} color="#FFFFFF" />
                <Text style={styles.platformButtonText}>小红书</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.platformButton}
              onPress={() => router.push('/content-operation-input', { platform: 'douyin' })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000', '#1A1A1A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.platformButtonGradient}
              >
                <FontAwesome6 name="music" size={20} color="#FFFFFF" />
                <Text style={styles.platformButtonText}>抖音</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.publishedSection}>
          <View style={styles.publishedHeader}>
            <Text style={styles.publishedTitle}>已发布内容</Text>
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

        {/* 检查更新按钮 */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={checkForUpdate}
          disabled={isCheckingUpdate}
          activeOpacity={0.8}
        >
          {isCheckingUpdate ? (
            <View style={styles.updateButtonContent}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.updateButtonText}>检查中...</Text>
            </View>
          ) : (
            <View style={styles.updateButtonContent}>
              <FontAwesome6 name="rotate" size={18} color="#6C63FF" />
              <Text style={styles.updateButtonText}>检查更新</Text>
              {updateAvailable && <View style={styles.updateDot} />}
            </View>
          )}
        </TouchableOpacity>

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
