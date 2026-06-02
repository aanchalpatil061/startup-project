import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { teacherApi } from '../../src/api/teacher';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatPercentage } from '../../src/utils/format';
import type { TeacherUser } from '../../src/types/auth';

export default function TeacherDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user) as TeacherUser | null;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['teacher', 'dashboard'],
    queryFn: teacherApi.getDashboard,
  });

  const d = data?.data;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Teacher Console</Text>
          <Text style={styles.name}>{user?.name ?? 'Faculty'}</Text>
          <Text style={styles.dept}>{user?.department}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(teacher)/profile')}>
          <Avatar name={user?.name} size={44} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Active Batches" value={isLoading ? '–' : String(d?.activeBatches ?? 0)} icon="layers-outline" color={Colors.info} />
        <StatCard label="Pending Evals" value={isLoading ? '–' : String(d?.pendingEvaluations ?? 0)} icon="time-outline" color={Colors.warning} />
        <StatCard label="Open Disputes" value={isLoading ? '–' : String(d?.openDisputes ?? 0)} icon="flag-outline" color={Colors.error} />
      </View>

      <Card padding={16} style={styles.totalCard}>
        <View style={styles.totalRow}>
          <View style={styles.totalIcon}>
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.totalValue}>{isLoading ? '–' : (d?.totalStudentsEvaluated ?? 0).toLocaleString('en-IN')}</Text>
            <Text style={styles.totalLabel}>Total students evaluated</Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Batches</Text>
          <TouchableOpacity onPress={() => router.push('/(teacher)/batches')}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : !d?.recentBatches.length ? (
          <Card padding={20} style={styles.emptyCard}>
            <Text style={styles.emptyText}>No batches yet. Batches are assigned by your institution admin.</Text>
          </Card>
        ) : (
          d.recentBatches.slice(0, 3).map((b) => (
            <TouchableOpacity key={b.id} onPress={() => router.push(`/(teacher)/batches/${b.id}`)}>
              <Card style={styles.batchCard} padding={16}>
                <View style={styles.batchTop}>
                  <View style={styles.batchLeft}>
                    <Text style={styles.batchSubject}>{b.subject}</Text>
                    <Text style={styles.batchMeta}>{b.department} · {b.year} · Section {b.section}</Text>
                  </View>
                  <Badge label={`${b.evaluatedCount}/${b.totalStudents}`} color={Colors.text} bgColor={Colors.skeleton} />
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(b.evaluatedCount / b.totalStudents) * 100}%` }]} />
                </View>
                <Text style={styles.batchProgress}>{Math.round((b.evaluatedCount / b.totalStudents) * 100)}% evaluated</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const StatCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon, color }) => (
  <Card style={styles.statCard} padding={14}>
    <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 16, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6, marginTop: 2 },
  dept: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, gap: 8 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  statLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  totalCard: {},
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  totalIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center' },
  totalValue: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  totalLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  emptyCard: { alignItems: 'center' },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  batchCard: { marginBottom: 0 },
  batchTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  batchLeft: { flex: 1, marginRight: 12 },
  batchSubject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  batchMeta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 3 },
  progressBar: { height: 4, backgroundColor: Colors.skeleton, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 2 },
  batchProgress: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
});
