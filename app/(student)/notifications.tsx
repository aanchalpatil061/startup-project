import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { studentApi } from '../../src/api/student';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatRelativeTime } from '../../src/utils/format';
import type { Notification } from '../../src/types/student';

const NOTIF_ICONS: Record<string, string> = {
  evaluation: 'document-text-outline',
  dispute: 'flag-outline',
  announcement: 'megaphone-outline',
  result: 'trophy-outline',
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['student', 'notifications'],
    queryFn: () => studentApi.getNotifications(1),
  });

  const markAllRead = useMutation({
    mutationFn: studentApi.markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] }),
  });

  const notifications = data?.data ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  const renderItem = ({ item }: { item: Notification }) => (
    <Card style={[styles.card, !item.read && styles.unread]} padding={14}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${Colors.info}18` }]}>
          <Ionicons name={(NOTIF_ICONS[item.type] ?? 'notifications-outline') as any} size={18} color={Colors.info} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </View>
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={() => markAllRead.mutate()}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState icon="notifications-outline" title="No notifications" description="You're all caught up!" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  headerTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  markRead: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  loadingList: { paddingHorizontal: 16, gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 8 },
  card: {},
  unread: { borderColor: `${Colors.info}40` },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 3 },
  title: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  unreadTitle: { fontFamily: FontFamily.semibold },
  body: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 19 },
  time: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.info, marginTop: 6 },
});
