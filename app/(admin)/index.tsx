import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../src/api/admin';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import type { AdminUser } from '../../src/types/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user) as AdminUser | null;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboard,
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
          <Text style={styles.eyebrow}>Admin Console</Text>
          <Text style={styles.name}>Academic Management</Text>
          <Text style={styles.subtitle}>{user?.college ?? 'Institution'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(admin)/profile')}>
          <Avatar name={user?.name} size={44} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <BigStat label="Students" value={isLoading ? '–' : d?.totalStudents.toLocaleString('en-IN') ?? '–'} icon="people-outline" color={Colors.info} />
        <BigStat label="Teachers" value={isLoading ? '–' : String(d?.totalTeachers ?? '–')} icon="school-outline" color={Colors.success} />
      </View>
      <View style={styles.statsGrid}>
        <BigStat label="Active Semesters" value={isLoading ? '–' : String(d?.activeSemesters ?? '–')} icon="calendar-outline" color={Colors.warning} />
        <BigStat label="Open Disputes" value={isLoading ? '–' : String(d?.openDisputes ?? '–')} icon="flag-outline" color={Colors.error} />
      </View>

      <Card padding={16}>
        <Text style={styles.sectionTitle}>Evaluation Status</Text>
        <View style={styles.evalRow}>
          <View>
            <Text style={styles.evalValue}>{isLoading ? '–' : (d?.completedEvaluations ?? 0).toLocaleString('en-IN')}</Text>
            <Text style={styles.evalLabel}>Completed</Text>
          </View>
          <View style={styles.evalDivider} />
          <View>
            <Text style={[styles.evalValue, { color: Colors.warning }]}>{isLoading ? '–' : (d?.pendingEvaluations ?? 0).toLocaleString('en-IN')}</Text>
            <Text style={styles.evalLabel}>Pending</Text>
          </View>
          <View style={styles.evalDivider} />
          <View>
            <Text style={[styles.evalValue, { color: Colors.success }]}>{isLoading ? '–' : d?.averageEvaluationTime ?? '–'}</Text>
            <Text style={styles.evalLabel}>Avg Time</Text>
          </View>
        </View>
      </Card>

      {d?.costSaved && (
        <Card padding={16} style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <Ionicons name="trending-down-outline" size={24} color={Colors.success} />
            <View>
              <Text style={styles.savingsValue}>{d.costSaved}</Text>
              <Text style={styles.savingsLabel}>estimated cost saved vs manual evaluation</Text>
            </View>
          </View>
        </Card>
      )}

      <Text style={styles.quickActionsLabel}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <QuickAction icon="calendar-outline" label="Semesters" onPress={() => router.push('/(admin)/semesters')} />
        <QuickAction icon="book-outline" label="Courses" onPress={() => router.push('/(admin)/courses')} />
        <QuickAction icon="people-outline" label="Students" onPress={() => router.push('/(admin)/students')} />
        <QuickAction icon="megaphone-outline" label="Announce" onPress={() => router.push('/(admin)/communications')} />
      </View>
    </ScrollView>
  );
}

const BigStat: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon, color }) => (
  <Card style={styles.bigStat} padding={16}>
    <View style={[styles.bigStatIcon, { backgroundColor: `${color}18` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.bigStatValue}>{value}</Text>
    <Text style={styles.bigStatLabel}>{label}</Text>
  </Card>
);

const QuickAction: React.FC<{ icon: any; label: string; onPress: () => void }> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.qaIcon}>
      <Ionicons name={icon} size={22} color={Colors.text} />
    </View>
    <Text style={styles.qaLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 16, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6, marginTop: 2 },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  bigStat: { flex: 1, gap: 8 },
  bigStatIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  bigStatValue: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  bigStatLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textMuted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  evalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  evalValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  evalLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 3 },
  evalDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  savingsCard: { flexDirection: 'row' },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  savingsValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.success, letterSpacing: -0.4 },
  savingsLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  quickActionsLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  quickActions: { flexDirection: 'row', gap: 12 },
  qaBtn: { flex: 1, alignItems: 'center', gap: 8 },
  qaIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textSecondary },
});
