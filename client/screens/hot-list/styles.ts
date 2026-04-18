import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  platformFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  platformTag: {
    backgroundColor: '#F0F0F3',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  platformTagActive: {
    backgroundColor: 'rgba(108,99,255,0.10)',
    borderColor: '#6C63FF',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
  },
  platformTextActive: {
    color: '#6C63FF',
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  topicList: {
    marginTop: 8,
  },
  topicItem: {
    backgroundColor: '#F0F0F3',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rankText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
    lineHeight: 22,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformBadge: {
    backgroundColor: 'rgba(108,99,255,0.10)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 12,
  },
  platformBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  hotValue: {
    fontSize: 12,
    color: '#636E72',
  },
});
