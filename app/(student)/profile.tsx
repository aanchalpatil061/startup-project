import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../src/components/ui/Avatar';
import { Card } from '../../src/components/ui/Card';
import { useAuthStore } from '../../src/store/authStore';
import { authApi } from '../../src/api/auth';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import type { StudentUser } from '../../src/types/auth';

export default function StudentProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, clearAuth } = useAuthStore();
  const student = user as StudentUser | null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try { await authApi.logout(); } catch { /* ignore */ }
          await clearAuth();
          router.replace('/');
        },
      },
    ]);
  };

  if (!student) return null;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Profile</Text>

      <View style={styles.profileCard}>
        <Avatar name={student.name} size={72} uri={student.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.email}>{student.email}</Text>
          <Text style={styles.role}>Student</Text>
        </View>
      </View>

      <Card padding={0}>
        <InfoRow label="Roll Number" value={student.rollNumber} icon="id-card-outline" />
        <Divider />
        <InfoRow label="Branch" value={student.branch} icon="school-outline" />
        <Divider />
        <InfoRow label="Year" value={student.year} icon="calendar-outline" />
        <Divider />
        <InfoRow label="Section" value={`Section ${student.section}`} icon="people-outline" />
        <Divider />
        <InfoRow label="Email" value={student.email} icon="mail-outline" />
      </Card>

      <Card padding={0}>
        <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/(student)/settings')} />
        <Divider />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
        <Divider />
        <MenuItem icon="shield-outline" label="Privacy Policy" onPress={() => {}} />
      </Card>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Askd v1.0.0 · AI Answer Evaluation</Text>
    </ScrollView>
  );
}

const InfoRow: React.FC<{ label: string; value: string; icon: any }> = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={Colors.textMuted} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const MenuItem: React.FC<{ icon: any; label: string; onPress: () => void }> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={20} color={Colors.text} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 16, gap: 20 },
  pageTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileInfo: { flex: 1, gap: 3 },
  name: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  email: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  role: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.text, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 46 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: Colors.errorLight, borderRadius: 12 },
  logoutText: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
});
