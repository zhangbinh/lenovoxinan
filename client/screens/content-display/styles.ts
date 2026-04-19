import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F0F0F3',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  placeholder: {
    width: 60,
  },
  topicsSection: {
    backgroundColor: '#F0F0F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  topicsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 8,
  },
  topicTag: {
    backgroundColor: 'rgba(108,99,255,0.10)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  remarkSection: {
    backgroundColor: 'rgba(108,99,255,0.05)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  remarkLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 4,
  },
  remarkText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  contentItem: {
    backgroundColor: '#F0F0F3',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  contentItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contentIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contentIndexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contentItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    flex: 1,
  },
  contentItemText: {
    fontSize: 13,
    color: '#2D3436',
    lineHeight: 20,
    marginBottom: 12,
  },
  publishSection: {
    marginTop: 8,
  },
  publishLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 6,
  },
  publishInput: {
    backgroundColor: '#E8E8EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    minHeight: 44,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? 24 : 12, // 移动端进一步减小 padding
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#F0F0F3',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    width: '100%',
    minHeight: 80,
  },
  footerButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 12, // 移动端减小垂直 padding
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.OS === 'web' ? 48 : 44, // 移动端减小最小高度
    width: 0, // 防止flex子元素溢出
    paddingHorizontal: 8, // 添加水平 padding 防止文字溢出
  },
  footerButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  footerButtonText: {
    fontSize: Platform.OS === 'web' ? 15 : 14, // 移动端减小字号
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
