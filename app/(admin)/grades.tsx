import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../src/api/admin';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatScore, formatPercentage, getGradeColor } from '../../src/utils/format';
import type { GradeResult } from '../../src/types/admin';

export default function GradesScreen() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'grades'],
    queryFn: () => adminApi.getGrades(undefined, 1),
  });

  const grades = data?.data ?? [];

  const renderItem = ({ item }: { item: GradeResult }) => (
    <Card style={styles.card} padding={14}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.rollNum}>{item.rollNumber}</Text>
          <Text style={styles.subject}>{item.subjectName}</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.score, { color: getGradeColor(item.percentage) }]}>
            {formatScore(item.marksObtained, item.totalMarks)}
          </Text>
          <Text style={styles.pct}>{formatPercentage(item.percentage)}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: `${getGradeColor(item.percentage)}18` }]}>
            <Text style={[styles.gradeText, { color: getGradeColor(item.percentage) }]}>{item.grade}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Grades & Results</Text>
        <Text style={styles.count}>{grades.length} records</Text>
      </View>

      {isLoading ? (
        <View style={styles.list}>{[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={grades}
          renderItem={renderItem}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="ribbon-outline" title="No grades yet" description="Grade records will appear here once evaluations are complete." />}
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
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 8 },
  card: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flex: 1, gap: 2 },
  studentName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  rollNum: { fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted },
  subject: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 3 },
  score: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, letterSpacing: -0.3 },
  pct: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  gradeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  gradeText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold },
});
