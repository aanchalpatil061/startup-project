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
import type { AdminUser } from '../../src/types/auth';

export default function AdminProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, clearAuth } = useAuthStore();
  const admin = user as AdminUser | null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Sign out of admin console?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          try { await authApi.logout(); } catch { /* ignore */ }
          await clearAuth();
          router.replace('/');
        },
      },
    ]);
  };

  if (!admin) return null;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Profile</Text>

      <View style={styles.profileCard}>
        <Avatar name={admin.name} size={72} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{admin.name}</Text>
          <Text style={styles.email}>{admin.email}</Text>
          <Text style={styles.role}>Administrator</Text>
          <Text style={styles.college}>{admin.college}</Text>
        </View>
      </View>

      <Card padding={0}>
        <MenuItem icon="calendar-outline" label="Semesters" onPress={() => router.push('/(admin)/semesters')} />
        <Divider />
        <MenuItem icon="book-outline" label="Courses" onPress={() => router.push('/(admin)/courses')} />
        <Divider />
        <MenuItem icon="megaphone-outline" label="Communications" onPress={() => router.push('/(admin)/communications')} />
        <Divider />
        <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/(admin)/settings')} />
        <Divider />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
      </Card>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.version}>Askd v1.0.0 · Admin Console</Text>
    </ScrollView>
  );
}

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
  role: { fontSize: FontSize.xs, fontFamily: FontFamily.semibold, color: Colors.primary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  college: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 48 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: Colors.errorLight, borderRadius: 12 },
  logoutText: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
});
