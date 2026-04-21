import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { VersionService, VersionCheckResult } from '@/utils/versionService';

export function VersionChecker() {
  const [checking, setChecking] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionCheckResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // 应用启动时检查版本
    checkVersion();
  }, []);

  const checkVersion = async () => {
    // 仅在正式发布的应用中检查更新
    if (!__DEV__) {
      setChecking(true);
      const result = await VersionService.checkForUpdate();
      setChecking(false);

      if (result) {
        setVersionInfo(result);

        // 如果需要强制更新，立即显示提示
        if (result.needsForceUpdate || result.forceUpdate) {
          setShowModal(true);
        }
        // 如果有更新但不是强制的，可以显示Toast（可选）
        else if (result.needsUpdate) {
          console.log('发现新版本:', result.latestVersion);
          // 可以在这里显示一个非阻塞的提示
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!versionInfo) return;

    // 如果需要强制更新，必须更新
    if (versionInfo.needsForceUpdate || versionInfo.forceUpdate) {
      // 强制更新流程
      setDownloading(true);

      try {
        // 方法1: 使用expo-updates进行OTA更新
        const updated = await VersionService.fetchAndInstallUpdate();

        if (updated) {
          Alert.alert(
            '更新已下载',
            '新版本已下载完成，应用将自动重启以应用更新。',
            [
              {
                text: '立即重启',
                onPress: () => VersionService.reloadApp(),
              },
            ]
          );
        } else {
          // 如果OTA更新失败，提示用户下载APK
          if (versionInfo.downloadUrl) {
            Alert.alert(
              '需要更新',
              versionInfo.updateMessage,
              [
                {
                  text: '稍后',
                  onPress: () => {
                    // 如果是强制更新，不允许稍后
                    if (versionInfo.needsForceUpdate || versionInfo.forceUpdate) {
                      Alert.alert('必须更新', '此版本必须更新才能继续使用。');
                      setShowModal(true);
                    }
                  },
                },
                {
                  text: '下载新版本',
                  onPress: () => {
                    // 打开下载链接（需要在web平台上才能工作）
                    if (Platform.OS === 'web' && versionInfo.downloadUrl) {
                      window.open(versionInfo.downloadUrl, '_blank');
                    } else {
                      Alert.alert(
                        '请访问下载链接',
                        `请在浏览器中打开以下链接下载新版本:\n\n${versionInfo.downloadUrl || '请联系管理员获取下载链接'}`,
                        [
                          {
                            text: '确定',
                            onPress: () => {
                              if (versionInfo.needsForceUpdate || versionInfo.forceUpdate) {
                                setShowModal(true);
                              }
                            },
                          },
                        ]
                      );
                    }
                  },
                  style: 'destructive',
                },
              ]
            );
          }
        }
      } catch (error) {
        console.error('更新失败:', error);
        Alert.alert('更新失败', '更新过程中出现错误，请稍后重试。');
      } finally {
        setDownloading(false);
      }
    } else {
      // 非强制更新，允许用户选择
      Alert.alert(
        '发现新版本',
        `${versionInfo.updateMessage}\n\n当前版本: ${versionInfo.currentVersion}\n最新版本: ${versionInfo.latestVersion}`,
        [
          { text: '暂不更新', style: 'cancel' },
          {
            text: '立即更新',
            onPress: async () => {
              setDownloading(true);
              const updated = await VersionService.fetchAndInstallUpdate();
              setDownloading(false);

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
    }
  };

  if (checking) {
    return null; // 检查中不显示任何内容
  }

  if (!versionInfo || !showModal) {
    return null; // 不需要更新或用户已关闭弹窗
  }

  const isForceUpdate = versionInfo.needsForceUpdate || versionInfo.forceUpdate;

  return (
    <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 图标 */}
          <View style={styles.iconContainer}>
            <FontAwesome6 name="mobile-screen" size={64} color="#6C63FF" />
          </View>

          {/* 标题 */}
          <Text style={styles.title}>{isForceUpdate ? '需要更新' : '发现新版本'}</Text>

          {/* 内容 */}
          <ScrollView style={styles.messageContainer}>
            <Text style={styles.message}>{versionInfo.updateMessage}</Text>

            <View style={styles.versionInfo}>
              <Text style={styles.versionLabel}>当前版本：</Text>
              <Text style={styles.versionValue}>{versionInfo.currentVersion}</Text>
            </View>
            <View style={styles.versionInfo}>
              <Text style={styles.versionLabel}>最新版本：</Text>
              <Text style={styles.versionValue}>{versionInfo.latestVersion}</Text>
            </View>

            {versionInfo.releaseNotes && (
              <View style={styles.releaseNotesContainer}>
                <Text style={styles.releaseNotesTitle}>更新内容：</Text>
                <Text style={styles.releaseNotesText}>{versionInfo.releaseNotes}</Text>
              </View>
            )}

            {isForceUpdate && (
              <View style={styles.forceNoticeContainer}>
                <FontAwesome6 name="circle-exclamation" size={14} color="#FF6B6B" />
                <Text style={styles.forceNotice}> 此版本必须更新才能继续使用</Text>
              </View>
            )}
          </ScrollView>

          {/* 按钮 */}
          {downloading ? (
            <View style={styles.downloadingContainer}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.downloadingText}>正在下载更新...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} activeOpacity={0.8}>
              <Text style={styles.updateButtonText}>立即更新</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageContainer: {
    maxHeight: 300,
    marginBottom: 24,
  },
  message: {
    fontSize: 15,
    color: '#636E72',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  versionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  versionLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  versionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginLeft: 4,
  },
  releaseNotesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  releaseNotesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  releaseNotesText: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
  },
  forceNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  forceNotice: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  downloadingText: {
    fontSize: 15,
    color: '#636E72',
    marginLeft: 12,
  },
  updateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
