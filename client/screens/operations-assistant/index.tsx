import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface DailyTask {
  id: number;
  storeId: string;
  taskType: string;
  taskTitle: string;
  taskDescription?: string;
  taskDate: string;
  isCompleted: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface WeeklyReview {
  id: number;
  storeId: string;
  weekStart: string;
  weekEnd: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageInteractRate: number;
  insights?: string;
  actionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

const styles = {
  container: {
    flex: 1,
  } as const,
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  } as const,
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  } as const,
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  } as const,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  } as const,
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
  } as const,
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  } as const,
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  } as const,
  content: {
    padding: 24,
  } as const,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  } as const,
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  } as const,
  dateText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
  } as const,
  taskCard: {
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
  taskCardCompleted: {
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#14B8A6',
  } as const,
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  } as const,
  taskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  taskCheckboxCompleted: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  } as const,
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  } as const,
  taskTitleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through' as const,
  } as const,
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    paddingLeft: 40,
  } as const,
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 40,
  } as const,
  taskPriority: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  } as const,
  priorityHigh: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
  } as const,
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  } as const,
  priorityLow: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  } as const,
  taskType: {
    fontSize: 12,
    color: '#6B7280',
  } as const,
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as const,
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  } as const,
  reviewWeek: {
    fontSize: 14,
    color: '#6B7280',
  } as const,
  reviewMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  } as const,
  reviewMetric: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  } as const,
  reviewMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 4,
  } as const,
  reviewMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
  } as const,
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  } as const,
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  } as const,
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center' as const,
  } as const,
  generateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  notesInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
    minHeight: 100,
  } as const,
};

export default function OperationsAssistant() {
  const router = useSafeRouter();
  const { storeId } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  // 加载每日任务
  const fetchTasks = useCallback(async () => {
    if (!storeId) return;

    setLoadingTasks(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      /**
       * 服务端文件：server/src/routes/operations.ts
       * 接口：GET /api/v1/operations/tasks?storeId=xxx&date=xxx
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/operations/tasks?storeId=${storeId}&date=${dateStr}`
      );
      const result = await response.json();

      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error('获取每日任务失败:', error);
    } finally {
      setLoadingTasks(false);
    }
  }, [storeId, selectedDate]);

  // 加载周度复盘
  const fetchReviews = useCallback(async () => {
    if (!storeId) return;

    setLoadingReviews(true);
    try {
      /**
       * 服务端文件：server/src/routes/operations.ts
       * 接口：GET /api/v1/operations/reviews?storeId=xxx
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/operations/reviews?storeId=${storeId}&limit=3`
      );
      const result = await response.json();

      if (result.success) {
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error('获取周度复盘失败:', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [storeId]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
      fetchReviews();
    }, [fetchTasks, fetchReviews])
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleGenerateTasks = async () => {
    if (!storeId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      /**
       * 服务端文件：server/src/routes/operations.ts
       * 接口：POST /api/v1/operations/tasks/generate
       * Body 参数：storeId: string, date: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/operations/tasks/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId,
            date: dateStr,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setTasks(result.data || []);
        Alert.alert('成功', '任务生成成功');
      } else {
        Alert.alert('失败', result.message || '任务生成失败');
      }
    } catch (error) {
      console.error('生成任务失败:', error);
      Alert.alert('错误', '网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = (task: DailyTask) => {
    setSelectedTask(task);
    setNotes('');
    setShowNotesModal(true);
  };

  const handleConfirmComplete = async () => {
    if (!selectedTask) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      /**
       * 服务端文件：server/src/routes/operations.ts
       * 接口：POST /api/v1/operations/tasks/:taskId/complete
       * Body 参数：notes?: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/operations/tasks/${selectedTask.id}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: notes || undefined }),
        }
      );

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        setShowNotesModal(false);
        Alert.alert('成功', '任务已完成');
      } else {
        Alert.alert('失败', result.message || '完成任务失败');
      }
    } catch (error) {
      console.error('完成任务失败:', error);
      Alert.alert('错误', '网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority: number) => {
    switch (priority) {
      case 1:
        return styles.priorityHigh;
      case 2:
        return styles.priorityMedium;
      case 3:
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return '高';
      case 2:
        return '中';
      case 3:
        return '低';
      default:
        return '低';
    }
  };

  const getTaskTypeText = (taskType: string) => {
    switch (taskType) {
      case 'publish_content':
        return '发布内容';
      case 'interact_comments':
        return '互动评论';
      case 'analyze_data':
        return '数据分析';
      case 'optimize_content':
        return '内容优化';
      default:
        return '任务';
    }
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>运营助手</Text>
          <Text style={styles.headerSubtitle}>提升门店运营效率</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress}%</Text>
              <Text style={styles.statLabel}>今日完成</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{reviews.length}</Text>
              <Text style={styles.statLabel}>周度复盘</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* 每日任务 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>每日任务</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{selectedDate.toISOString().split('T')[0]}</Text>
              <FontAwesome6 name="calendar" size={16} color="#6C63FF" />
            </TouchableOpacity>
          </View>

          {tasks.length === 0 && !loadingTasks ? (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateTasks}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.generateButtonText}>生成今日任务</Text>
              )}
            </TouchableOpacity>
          ) : null}

          {loadingTasks ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>暂无任务，点击上方按钮生成</Text>
            </View>
          ) : (
            tasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  task.isCompleted && styles.taskCardCompleted,
                ]}
              >
                <View style={styles.taskHeader}>
                  <TouchableOpacity
                    style={[
                      styles.taskCheckbox,
                      task.isCompleted && styles.taskCheckboxCompleted,
                    ]}
                    onPress={() => !task.isCompleted && handleCompleteTask(task)}
                    disabled={task.isCompleted}
                  >
                    {task.isCompleted && (
                      <FontAwesome6 name="check" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.isCompleted && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.taskTitle}
                    </Text>
                  </View>
                </View>
                {task.taskDescription && (
                  <Text style={styles.taskDescription}>{task.taskDescription}</Text>
                )}
                <View style={styles.taskFooter}>
                  <View style={styles.taskPriority}>
                    <Text style={[styles.taskPriority, getPriorityStyle(task.priority)]}>
                      {getPriorityText(task.priority)}
                    </Text>
                  </View>
                  <Text style={styles.taskType}>{getTaskTypeText(task.taskType)}</Text>
                </View>
              </View>
            ))
          )}

          {/* 周度复盘 */}
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>周度复盘</Text>
          </View>

          {loadingReviews ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome6 name="chart-line" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>暂无复盘记录</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>
                    {review.weekStart} 至 {review.weekEnd}
                  </Text>
                </View>
                <View style={styles.reviewMetrics}>
                  <View style={styles.reviewMetric}>
                    <Text style={styles.reviewMetricValue}>
                      {review.totalViews.toLocaleString()}
                    </Text>
                    <Text style={styles.reviewMetricLabel}>总播放</Text>
                  </View>
                  <View style={styles.reviewMetric}>
                    <Text style={styles.reviewMetricValue}>
                      {review.totalLikes.toLocaleString()}
                    </Text>
                    <Text style={styles.reviewMetricLabel}>总点赞</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

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
                <Text style={styles.modalTitle}>选择日期</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={{ color: '#6C63FF', fontWeight: '600' }}>取消</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    handleDateChange(selectedDate);
                  }
                }}
                maximumDate={new Date()}
                nativeID="taskDatePicker"
              />

              {Platform.OS === 'web' && (
                <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                    Web平台日期选择器：
                  </Text>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
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
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 备注输入 Modal */}
      <Modal
        visible={showNotesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowNotesModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>完成任务</Text>
                <TouchableOpacity onPress={() => setShowNotesModal(false)}>
                  <Text style={{ color: '#6B7280', fontWeight: '600' }}>取消</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
                任务备注（可选）
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder="记录任务执行情况..."
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleConfirmComplete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>确认完成</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
}
