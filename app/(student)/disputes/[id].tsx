import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { studentApi } from '../../../src/api/student';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { LoadingOverlay } from '../../../src/components/shared/LoadingOverlay';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatDate, getStatusColor, getStatusLabel } from '../../../src/utils/format';

export default function DisputeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'dispute', id],
    queryFn: () => studentApi.getDispute(id),
    enabled: !!id,
  });

  const dispute = data?.data;

  if (isLoading) return <LoadingOverlay message="Loading dispute..." />;
  if (!dispute) return null;

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispute Detail</Text>
        <Badge
          label={getStatusLabel(dispute.status)}
          color={getStatusColor(dispute.status)}
          bgColor={`${getStatusColor(dispute.status)}18`}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card padding={16}>
          <Text style={styles.sectionLabel}>Subject</Text>
          <Text style={styles.value}>{dispute.subjectName}</Text>
          <Text style={styles.sectionLabel}>Question</Text>
          <Text style={styles.value}>Question {dispute.questionNumber}</Text>
          <Text style={styles.sectionLabel}>Filed On</Text>
          <Text style={styles.value}>{formatDate(dispute.filedAt)}</Text>
          {dispute.resolvedAt && (
            <>
              <Text style={styles.sectionLabel}>Resolved On</Text>
              <Text style={styles.value}>{formatDate(dispute.resolvedAt)}</Text>
            </>
          )}
        </Card>

        <Card padding={16}>
          <Text style={styles.sectionLabel}>Your Reason</Text>
          <Text style={styles.reasonText}>{dispute.reason}</Text>
        </Card>

        {dispute.revisedMarks !== undefined && (
          <Card padding={16} style={styles.revisedCard}>
            <Text style={styles.revisedTitle}>Marks Revised</Text>
            <View style={styles.marksRow}>
              <View style={styles.markBox}>
                <Text style={styles.markLabel}>Original</Text>
                <Text style={styles.markValue}>{dispute.originalMarks}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
              <View style={styles.markBox}>
                <Text style={styles.markLabel}>Revised</Text>
                <Text style={[styles.markValue, { color: Colors.success }]}>{dispute.revisedMarks}</Text>
              </View>
            </View>
          </Card>
        )}

        {dispute.teacherComment && (
          <Card padding={16}>
            <Text style={styles.sectionLabel}>Teacher Comment</Text>
            <Text style={styles.reasonText}>{dispute.teacherComment}</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 14 },
  sectionLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 10 },
  value: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.text },
  reasonText: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 24 },
  revisedCard: { backgroundColor: Colors.successLight, borderColor: Colors.success },
  revisedTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.success, marginBottom: 12 },
  marksRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  markBox: { alignItems: 'center', gap: 4 },
  markLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  markValue: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
});
