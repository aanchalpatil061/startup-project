import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { teacherApi } from '../../src/api/teacher';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatRelativeTime } from '../../src/utils/format';
import type { Notification } from '../../src/types/student';

export default function TeacherNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['teacher', 'notifications'],
    queryFn: () => teacherApi.getNotifications(1),
  });
  const notifications = data?.data ?? [];

  const renderItem = ({ item }: { item: Notification }) => (
    <Card style={[styles.card, !item.read && styles.unread]} padding={14}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="notifications-outline" size={18} color={Colors.info} />
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
      </View>
      {isLoading ? (
        <View style={styles.list}>{[1, 2, 3].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="notifications-outline" title="No notifications" description="You're all caught up!" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16 },
  headerTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {},
  unread: { borderColor: `${Colors.info}40` },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: `${Colors.info}18`, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 3 },
  title: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  unreadTitle: { fontFamily: FontFamily.semibold },
  body: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 19 },
  time: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.info, marginTop: 6 },
});
