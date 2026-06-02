import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../../src/api/admin';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { LoadingOverlay } from '../../../src/components/shared/LoadingOverlay';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatDate, getStatusColor, getStatusLabel } from '../../../src/utils/format';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'student', id],
    queryFn: () => adminApi.getStudent(id),
    enabled: !!id,
  });

  const student = data?.data;
  if (isLoading) return <LoadingOverlay message="Loading student..." />;
  if (!student) return null;

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Detail</Text>
        <Badge label={getStatusLabel(student.status)} color={getStatusColor(student.status)} bgColor={`${getStatusColor(student.status)}18`} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Avatar name={student.name} size={64} />
          <View style={styles.profileInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentEmail}>{student.email}</Text>
            <Text style={styles.enrollDate}>Enrolled {formatDate(student.joinedAt)}</Text>
          </View>
        </View>

        <Card padding={0}>
          <InfoRow label="Roll Number" value={student.rollNumber} />
          <Divider />
          <InfoRow label="Branch" value={student.branch} />
          <Divider />
          <InfoRow label="Year" value={student.year} />
          <Divider />
          <InfoRow label="Section" value={`Section ${student.section}`} />
          <Divider />
          <InfoRow label="Email" value={student.email} />
          <Divider />
          <InfoRow label="Status" value={getStatusLabel(student.status)} />
        </Card>
      </ScrollView>
    </View>
  );
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileInfo: { flex: 1, gap: 3 },
  studentName: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  studentEmail: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  enrollDate: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  infoLabel: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  infoValue: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 16 },
});
