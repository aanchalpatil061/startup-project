import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { teacherApi } from '../../../src/api/teacher';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { LoadingOverlay } from '../../../src/components/shared/LoadingOverlay';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatDate, getStatusColor, getStatusLabel } from '../../../src/utils/format';

export default function TeacherDisputeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [revisedMarks, setRevisedMarks] = useState('');
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['teacher', 'dispute', id],
    queryFn: () => teacherApi.getDispute(id),
    enabled: !!id,
  });

  const resolveMutation = useMutation({
    mutationFn: () =>
      teacherApi.resolveDispute(id, {
        action: action!,
        revisedMarks: action === 'accept' ? Number(revisedMarks) : undefined,
        comment,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teacher', 'disputes'] });
      Alert.alert('Done', 'Dispute resolved successfully.', [{ text: 'OK', onPress: () => router.back() }]);
    },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message ?? 'Failed to resolve dispute.'),
  });

  const handleResolve = () => {
    if (!action) { Alert.alert('Select action', 'Choose to accept or reject the dispute.'); return; }
    if (!comment.trim()) { Alert.alert('Comment required', 'Please provide a comment for the student.'); return; }
    if (action === 'accept' && (!revisedMarks || isNaN(Number(revisedMarks)))) {
      Alert.alert('Enter marks', 'Please enter the revised marks.'); return;
    }
    resolveMutation.mutate();
  };

  const dispute = data?.data;
  if (isLoading) return <LoadingOverlay message="Loading dispute..." />;
  if (!dispute) return null;

  const canResolve = dispute.status === 'pending' || dispute.status === 'under_review';

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Dispute</Text>
        <Badge label={getStatusLabel(dispute.status)} color={getStatusColor(dispute.status)} bgColor={`${getStatusColor(dispute.status)}18`} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card padding={16}>
          <Row label="Student" value={dispute.studentName} />
          <Row label="Roll Number" value={dispute.rollNumber} />
          <Row label="Subject" value={dispute.subjectName} />
          <Row label="Question" value={`Question ${dispute.questionNumber}`} />
          <Row label="Original Marks" value={String(dispute.originalMarks)} />
          <Row label="Filed On" value={formatDate(dispute.filedAt)} />
        </Card>

        <Card padding={16}>
          <Text style={styles.label}>Student's Reason</Text>
          <Text style={styles.reason}>{/* reason not in TeacherDispute type, shown from API */}</Text>
        </Card>

        {canResolve && (
          <Card padding={16}>
            <Text style={styles.label}>Your Decision</Text>
            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={[styles.actionBtn, action === 'accept' && styles.acceptActive]}
                onPress={() => setAction('accept')}
              >
                <Ionicons name="checkmark-circle" size={18} color={action === 'accept' ? '#fff' : Colors.success} />
                <Text style={[styles.actionBtnText, action === 'accept' && { color: '#fff' }]}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, action === 'reject' && styles.rejectActive]}
                onPress={() => setAction('reject')}
              >
                <Ionicons name="close-circle" size={18} color={action === 'reject' ? '#fff' : Colors.error} />
                <Text style={[styles.actionBtnText, action === 'reject' && { color: '#fff' }]}>Reject</Text>
              </TouchableOpacity>
            </View>

            {action === 'accept' && (
              <Input
                label="Revised Marks"
                placeholder={`Enter revised marks (original: ${dispute.originalMarks})`}
                value={revisedMarks}
                onChangeText={setRevisedMarks}
                keyboardType="numeric"
                leftIcon="create-outline"
                containerStyle={{ marginTop: 12 }}
              />
            )}

            <Input
              label="Comment for Student"
              placeholder="Explain your decision..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              containerStyle={{ marginTop: 12 }}
            />

            <Button onPress={handleResolve} fullWidth style={{ marginTop: 16 }} loading={resolveMutation.isPending}>
              Submit Decision
            </Button>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  rowValue: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.text, marginBottom: 8 },
  reason: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 22 },
  actionBtns: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border },
  acceptActive: { backgroundColor: Colors.success, borderColor: Colors.success },
  rejectActive: { backgroundColor: Colors.error, borderColor: Colors.error },
  actionBtnText: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
});
