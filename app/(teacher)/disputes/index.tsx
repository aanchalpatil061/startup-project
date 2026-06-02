import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '../../../src/api/teacher';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../../src/components/ui/Skeleton';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatDate, getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { TeacherDispute } from '../../../src/types/teacher';

export default function TeacherDisputesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['teacher', 'disputes'],
    queryFn: () => teacherApi.getDisputes(1),
  });

  const disputes = data?.data ?? [];
  const pending = disputes.filter((d) => d.status === 'pending').length;

  const renderItem = ({ item }: { item: TeacherDispute }) => (
    <TouchableOpacity onPress={() => router.push(`/(teacher)/disputes/${item.id}`)}>
      <Card style={styles.card} padding={16}>
        <View style={styles.top}>
          <View style={styles.left}>
            <Text style={styles.student}>{item.studentName}</Text>
            <Text style={styles.roll}>{item.rollNumber}</Text>
          </View>
          <Badge label={getStatusLabel(item.status)} color={getStatusColor(item.status)} bgColor={`${getStatusColor(item.status)}18`} />
        </View>
        <Text style={styles.subject}>{item.subjectName} · Q{item.questionNumber}</Text>
        <Text style={styles.filed}>{formatDate(item.filedAt)}</Text>
        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            <Text style={styles.actionText}>Tap to review →</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Disputes</Text>
        {pending > 0 && <Text style={styles.pendingCount}>{pending} pending review</Text>}
      </View>
      {isLoading ? (
        <View style={styles.loadingList}>{[1, 2].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={disputes}
          renderItem={renderItem}
          keyExtractor={(d) => d.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="flag-outline" title="No disputes" description="No student disputes have been filed for your batches." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, gap: 2 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  pendingCount: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.warning },
  loadingList: { paddingHorizontal: 16, gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 10 },
  card: {},
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  left: {},
  student: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  roll: { fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted },
  subject: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginBottom: 6 },
  filed: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  actionRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  actionText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.info },
});
