import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { teacherApi } from '../../src/api/teacher';
import { Card } from '../../src/components/ui/Card';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatPercentage } from '../../src/utils/format';

export default function TeacherAnalyticsScreen() {
  const insets = useSafeAreaInsets();

  const { data: batchesData, isLoading } = useQuery({
    queryKey: ['teacher', 'batches'],
    queryFn: () => teacherApi.getBatches(1),
  });

  const batches = batchesData?.data ?? [];
  const totalStudents = batches.reduce((a, b) => a + b.totalStudents, 0);
  const evaluated = batches.reduce((a, b) => a + b.evaluatedCount, 0);
  const pending = batches.reduce((a, b) => a + b.pendingCount, 0);
  const overallPct = totalStudents > 0 ? (evaluated / totalStudents) * 100 : 0;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Your evaluation overview across all batches</Text>

      <Card padding={20}>
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <View style={styles.bigStatRow}>
          <View>
            <Text style={styles.bigStat}>{evaluated.toLocaleString('en-IN')}</Text>
            <Text style={styles.bigStatLabel}>Scripts evaluated</Text>
          </View>
          <View style={styles.circleWrap}>
            <Text style={styles.circleValue}>{Math.round(overallPct)}%</Text>
            <Text style={styles.circleLabel}>complete</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${overallPct}%` }]} />
        </View>
        <View style={styles.progressLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Evaluated: {evaluated}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.skeleton }]} />
            <Text style={styles.legendText}>Pending: {pending}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard} padding={14}>
          <Ionicons name="layers-outline" size={22} color={Colors.info} />
          <Text style={styles.statValue}>{batches.length}</Text>
          <Text style={styles.statLabel}>Total Batches</Text>
        </Card>
        <Card style={styles.statCard} padding={14}>
          <Ionicons name="people-outline" size={22} color={Colors.warning} />
          <Text style={styles.statValue}>{totalStudents.toLocaleString('en-IN')}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Batch Breakdown</Text>
      {isLoading ? (
        <><SkeletonCard /><SkeletonCard /></>
      ) : (
        batches.map((b) => {
          const pct = b.totalStudents > 0 ? (b.evaluatedCount / b.totalStudents) * 100 : 0;
          return (
            <Card key={b.id} style={styles.batchCard} padding={14}>
              <View style={styles.batchHeader}>
                <Text style={styles.batchName}>{b.subject}</Text>
                <Text style={styles.batchPct}>{Math.round(pct)}%</Text>
              </View>
              <Text style={styles.batchMeta}>{b.department} · {b.year} · Sec {b.section}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.batchNumbers}>{b.evaluatedCount} / {b.totalStudents} students</Text>
            </Card>
          );
        })
      )}

      <Card padding={16} style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
        <Text style={styles.infoText}>
          For detailed question-level analytics, open a specific batch and tap the Analytics tab.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 16, gap: 16 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  cardTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, marginBottom: 16 },
  bigStatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bigStat: { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -1 },
  bigStatLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  circleWrap: { alignItems: 'center', width: 70, height: 70, borderRadius: 35, backgroundColor: Colors.skeleton, justifyContent: 'center' },
  circleValue: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  circleLabel: { fontSize: 9, fontFamily: FontFamily.regular, color: Colors.textMuted },
  progressBar: { height: 6, backgroundColor: Colors.skeleton, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 3 },
  progressLegend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, gap: 8 },
  statValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4, marginTop: 4 },
  statLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  batchCard: {},
  batchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  batchName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  batchPct: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.text },
  batchMeta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginBottom: 10 },
  batchNumbers: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  infoCard: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.info, lineHeight: 20 },
});
