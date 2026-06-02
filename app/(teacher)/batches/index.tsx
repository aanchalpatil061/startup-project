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
import { getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { Batch } from '../../../src/types/teacher';

export default function BatchesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['teacher', 'batches'],
    queryFn: () => teacherApi.getBatches(1),
  });

  const batches = data?.data ?? [];

  const renderItem = ({ item }: { item: Batch }) => {
    const pct = Math.round((item.evaluatedCount / item.totalStudents) * 100);
    return (
      <TouchableOpacity onPress={() => router.push(`/(teacher)/batches/${item.id}`)}>
        <Card style={styles.card} padding={16}>
          <View style={styles.top}>
            <View style={styles.left}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.code}>{item.subjectCode}</Text>
              <Text style={styles.meta}>{item.department} · {item.year} · Section {item.section}</Text>
            </View>
            <Badge label={getStatusLabel(item.status)} color={getStatusColor(item.status)} bgColor={`${getStatusColor(item.status)}18`} />
          </View>
          <View style={styles.progress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.evaluatedCount}/{item.totalStudents} · {pct}%</Text>
          </View>
          {item.pendingCount > 0 && (
            <Text style={styles.pending}>{item.pendingCount} pending evaluations</Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Batches</Text>
        <Text style={styles.count}>{batches.length} batches</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>{[1, 2, 3].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={batches}
          renderItem={renderItem}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="layers-outline" title="No batches assigned" description="Your institution admin will assign batches to you." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, gap: 2 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  count: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  loadingList: { paddingHorizontal: 16, gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 10 },
  card: {},
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  left: { flex: 1, marginRight: 12, gap: 3 },
  subject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  code: { fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted },
  meta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  progress: { gap: 6 },
  progressBar: { height: 5, backgroundColor: Colors.skeleton, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 3 },
  progressText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  pending: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.warning, marginTop: 6 },
});
