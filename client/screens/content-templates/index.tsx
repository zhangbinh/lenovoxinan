import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { getBackendBaseUrl } from '@/utils/api';

interface ContentTemplate {
  id: number;
  templateName: string;
  platform: string;
  contentType: string;
  titleTemplate: string;
  contentTemplate: string;
  coverTemplate?: string;
  usageTips?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const styles = {
  container: {
    flex: 1,
  } as const,
  header: {
    padding: 24,
  } as const,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  } as const,
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  } as const,
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  } as const,
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  } as const,
  filterButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  } as const,
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  } as const,
  filterButtonTextActive: {
    color: '#FFFFFF',
  } as const,
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  } as const,
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as const,
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  } as const,
  platformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  } as const,
  platformBadgeXiaohongshu: {
    backgroundColor: '#FF2442',
  } as const,
  platformBadgeDouyin: {
    backgroundColor: '#000000',
  } as const,
  platformBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  } as const,
  templateSection: {
    marginBottom: 16,
  } as const,
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  } as const,
  sectionContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  } as const,
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  } as const,
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  } as const,
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  } as const,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  } as const,
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  } as const,
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center' as const,
  } as const,
};

export default function ContentTemplates() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      /**
       * 服务端文件：server/src/routes/operations.ts
       * 接口：GET /api/v1/operations/templates
       * Query 参数：platform?: string, contentType?: string
       */
      const params = new URLSearchParams();
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (selectedContentType !== 'all') params.append('contentType', selectedContentType);

      const backendUrl = getBackendBaseUrl();
      const response = await fetch(
        `${backendUrl}/api/v1/operations/templates?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (error) {
      console.error('获取模板失败:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPlatform, selectedContentType]);

  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, [loadTemplates])
  );

  const getPlatformBadgeStyle = (platform: string) => {
    return platform === 'xiaohongshu'
      ? styles.platformBadgeXiaohongshu
      : styles.platformBadgeDouyin;
  };

  const getPlatformName = (platform: string) => {
    return platform === 'xiaohongshu' ? '小红书' : '抖音';
  };

  const getContentTypeName = (contentType: string) => {
    return contentType === 'copy' ? '文案' : '脚本';
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>爆款文案模板库</Text>
          <Text style={styles.subtitle}>精选高转化文案模板，助力内容创作</Text>

          {/* 平台筛选 */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedPlatform === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPlatform('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPlatform === 'all' && styles.filterButtonTextActive,
                ]}
              >
                全部
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedPlatform === 'xiaohongshu' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPlatform('xiaohongshu')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPlatform === 'xiaohongshu' && styles.filterButtonTextActive,
                ]}
              >
                小红书
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedPlatform === 'douyin' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPlatform('douyin')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPlatform === 'douyin' && styles.filterButtonTextActive,
                ]}
              >
                抖音
              </Text>
            </TouchableOpacity>
          </View>

          {/* 内容类型筛选 */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedContentType === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedContentType('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedContentType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                全部
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedContentType === 'copy' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedContentType('copy')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedContentType === 'copy' && styles.filterButtonTextActive,
                ]}
              >
                文案
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedContentType === 'script' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedContentType('script')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedContentType === 'script' && styles.filterButtonTextActive,
                ]}
              >
                脚本
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 24 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : templates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="file-lines" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>暂无模板</Text>
            </View>
          ) : (
            templates.map((template) => (
              <View key={template.id} style={styles.templateCard}>
                <View style={styles.templateHeader}>
                  <Text style={styles.templateName}>{template.templateName}</Text>
                  <View
                    style={[styles.platformBadge, getPlatformBadgeStyle(template.platform)]}
                  >
                    <Text style={styles.platformBadgeText}>
                      {getPlatformName(template.platform)}
                    </Text>
                  </View>
                </View>

                <View style={styles.templateSection}>
                  <Text style={styles.sectionLabel}>标题模板</Text>
                  <Text style={styles.sectionContent}>{template.titleTemplate}</Text>
                </View>

                <View style={styles.templateSection}>
                  <Text style={styles.sectionLabel}>内容模板</Text>
                  <Text style={styles.sectionContent}>{template.contentTemplate}</Text>
                </View>

                {template.coverTemplate && (
                  <View style={styles.templateSection}>
                    <Text style={styles.sectionLabel}>封面建议</Text>
                    <Text style={styles.sectionContent}>{template.coverTemplate}</Text>
                  </View>
                )}

                {template.usageTips && (
                  <View style={styles.templateSection}>
                    <Text style={styles.sectionLabel}>使用技巧</Text>
                    <Text style={styles.sectionContent}>{template.usageTips}</Text>
                  </View>
                )}

                {template.tags && template.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {template.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
