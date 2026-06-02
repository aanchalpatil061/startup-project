import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { studentApi } from '../../src/api/student';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatScore, formatPercentage, getGradeColor, getStatusColor, getStatusLabel, formatDate } from '../../src/utils/format';
import type { StudentUser } from '../../src/types/auth';

export default function StudentDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user) as StudentUser | null;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: studentApi.getDashboard,
  });

  const d = data?.data;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name} numberOfLines={1}>{user?.name?.split(' ')[0] ?? 'Student'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/(student)/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            {d && d.unreadNotifications > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifCount}>{d.unreadNotifications > 9 ? '9+' : d.unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(student)/profile')}>
            <Avatar name={user?.name} size={36} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info card */}
      {user && (
        <Card style={styles.infoCard} padding={16}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Roll Number</Text>
              <Text style={styles.infoValue}>{(user as StudentUser).rollNumber}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Branch</Text>
              <Text style={styles.infoValue}>{(user as StudentUser).branch}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Section</Text>
              <Text style={styles.infoValue}>{(user as StudentUser).section}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Total Exams"
          value={isLoading ? '–' : String(d?.totalExams ?? 0)}
          icon="document-outline"
          color={Colors.info}
        />
        <StatCard
          label="Avg Score"
          value={isLoading ? '–' : formatPercentage(d?.averageScore ?? 0)}
          icon="analytics-outline"
          color={Colors.success}
        />
        <StatCard
          label="Disputes"
          value={isLoading ? '–' : String(d?.pendingDisputes ?? 0)}
          icon="flag-outline"
          color={Colors.warning}
        />
      </View>

      {/* Recent scripts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scripts</Text>
          <TouchableOpacity onPress={() => router.push('/(student)/scripts')}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : d?.recentScripts.length === 0 ? (
          <Card padding={24} style={styles.emptyCard}>
            <Text style={styles.emptyText}>No scripts yet. Your evaluated exams will appear here.</Text>
          </Card>
        ) : (
          d?.recentScripts.slice(0, 3).map((s) => (
            <TouchableOpacity key={s.id} onPress={() => router.push(`/(student)/scripts/${s.id}`)}>
              <Card style={styles.scriptCard} padding={16}>
                <View style={styles.scriptTop}>
                  <View style={styles.scriptLeft}>
                    <Text style={styles.scriptSubject} numberOfLines={1}>{s.subjectName}</Text>
                    <Text style={styles.scriptCode}>{s.subjectCode}</Text>
                  </View>
                  <Badge
                    label={getStatusLabel(s.status)}
                    color={getStatusColor(s.status)}
                    bgColor={`${getStatusColor(s.status)}18`}
                  />
                </View>
                <View style={styles.scriptBottom}>
                  <View>
                    <Text style={[styles.scriptScore, { color: getGradeColor(s.percentage) }]}>
                      {formatScore(s.marksObtained, s.totalMarks)}
                    </Text>
                    <Text style={styles.scriptPct}>{formatPercentage(s.percentage)}</Text>
                  </View>
                  <Text style={styles.scriptDate}>{formatDate(s.examDate)}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const StatCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({
  label, value, icon, color,
}) => (
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: {},
  greeting: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  name: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative', width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  notifCount: { fontSize: 9, fontFamily: FontFamily.bold, color: '#fff' },
  infoCard: {},
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.text },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'flex-start', gap: 8 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  statLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  emptyCard: { alignItems: 'center' },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  scriptCard: { marginBottom: 0 },
  scriptTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  scriptLeft: { flex: 1, marginRight: 12 },
  scriptSubject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  scriptCode: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  scriptBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  scriptScore: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, letterSpacing: -0.4 },
  scriptPct: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  scriptDate: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
});
