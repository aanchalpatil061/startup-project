import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { teacherApi } from '../../../src/api/teacher';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { SkeletonCard } from '../../../src/components/ui/Skeleton';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatScore, formatPercentage, getGradeColor, getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { BatchScript } from '../../../src/types/teacher';

type Tab = 'scripts' | 'analytics';

export default function BatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('scripts');

  const { data: batchData } = useQuery({ queryKey: ['teacher', 'batch', id], queryFn: () => teacherApi.getBatch(id), enabled: !!id });
  const { data: scriptsData, isLoading: scriptsLoading } = useQuery({ queryKey: ['teacher', 'batch', id, 'scripts'], queryFn: () => teacherApi.getBatchScripts(id), enabled: !!id && tab === 'scripts' });
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({ queryKey: ['teacher', 'batch', id, 'analytics'], queryFn: () => teacherApi.getBatchAnalytics(id), enabled: !!id && tab === 'analytics' });

  const batch = batchData?.data;
  const scripts = scriptsData?.data ?? [];
  const analytics = analyticsData?.data;

  const renderScript = ({ item }: { item: BatchScript }) => (
    <Card style={styles.scriptCard} padding={14}>
      <View style={styles.scriptTop}>
        <View>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.rollNum}>{item.rollNumber}</Text>
        </View>
        <Badge label={getStatusLabel(item.status)} color={getStatusColor(item.status)} bgColor={`${getStatusColor(item.status)}18`} />
      </View>
      {item.status === 'evaluated' && (
        <View style={styles.scoreRow}>
          <Text style={[styles.scriptScore, { color: getGradeColor(item.percentage) }]}>
            {formatScore(item.marksObtained, item.totalMarks)}
          </Text>
          <Text style={styles.scriptPct}>{formatPercentage(item.percentage)}</Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.subject} numberOfLines={1}>{batch?.subject ?? '...'}</Text>
          <Text style={styles.meta}>{batch ? `${batch.department} · ${batch.year} · Section ${batch.section}` : ''}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['scripts', 'analytics'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.activeTab]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>{t === 'scripts' ? 'Scripts' : 'Analytics'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'scripts' && (
        scriptsLoading ? (
          <View style={styles.list}>{[1, 2, 3].map((k) => <SkeletonCard key={k} />)}</View>
        ) : (
          <FlatList
            data={scripts}
            renderItem={renderScript}
            keyExtractor={(s) => s.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="document-outline" title="No scripts" description="No evaluated scripts in this batch yet." />}
          />
        )
      )}

      {tab === 'analytics' && (
        analyticsLoading ? (
          <SkeletonCard />
        ) : analytics ? (
          <FlatList
            data={analytics.questionAnalytics}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.analyticsHeader}>
                <Card padding={16}>
                  <Text style={styles.analyticsTitle}>Batch Overview</Text>
                  <View style={styles.analyticsGrid}>
                    <AnalyticStat label="Average" value={formatPercentage(analytics.averageScore)} />
                    <AnalyticStat label="Pass Rate" value={formatPercentage(analytics.passPercentage)} />
                    <AnalyticStat label="Top Score" value={String(analytics.topScore)} />
                    <AnalyticStat label="Lowest" value={String(analytics.lowestScore)} />
                  </View>
                </Card>
                <Text style={styles.qHeader}>Question Performance</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Card style={styles.qAnalyticCard} padding={14}>
                <Text style={styles.qLabel}>Q{item.questionNumber}</Text>
                <Text style={styles.qText} numberOfLines={2}>{item.questionText}</Text>
                <View style={styles.qStats}>
                  <Text style={styles.qStatText}>Avg: {formatPercentage(item.averageScore)}</Text>
                  <Text style={styles.qStatText}>Correct: {formatPercentage(item.correctPercentage)}</Text>
                </View>
                {item.conceptGap && (
                  <View style={styles.gapBox}>
                    <Ionicons name="warning-outline" size={13} color={Colors.warning} />
                    <Text style={styles.gapText}>{item.conceptGap}</Text>
                  </View>
                )}
              </Card>
            )}
          />
        ) : null
      )}
    </View>
  );
}

const AnalyticStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.analyticStat}>
    <Text style={styles.analyticValue}>{value}</Text>
    <Text style={styles.analyticLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1 },
  subject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  meta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.skeleton, margin: 16, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: Colors.surface },
  tabText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textMuted },
  activeTabText: { color: Colors.text },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  sep: { height: 0 },
  scriptCard: {},
  scriptTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  studentName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  rollNum: { fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted, marginTop: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  scriptScore: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, letterSpacing: -0.3 },
  scriptPct: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  analyticsHeader: { gap: 16, marginBottom: 12 },
  analyticsTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, marginBottom: 14 },
  analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  analyticStat: { width: '45%' },
  analyticValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  analyticLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  qHeader: { fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  qAnalyticCard: {},
  qLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textMuted, marginBottom: 4 },
  qText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 19, marginBottom: 8 },
  qStats: { flexDirection: 'row', gap: 16 },
  qStatText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  gapBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: Colors.warningLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 },
  gapText: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.warning },
});
