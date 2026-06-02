import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { studentApi } from '../../../src/api/student';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';

export default function FileDisputeScreen() {
  const { scriptId, questionNumber } = useLocalSearchParams<{ scriptId: string; questionNumber: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: studentApi.fileDispute,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['student', 'disputes'] });
      Alert.alert('Dispute Filed', 'Your dispute has been submitted and will be reviewed by the teacher.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message ?? 'Failed to file dispute.');
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) { setError('Please provide a reason for the dispute'); return; }
    if (reason.trim().length < 20) { setError('Please provide a more detailed reason (at least 20 characters)'); return; }
    setError('');
    mutation.mutate({ scriptId, questionNumber: Number(questionNumber), reason });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>File Dispute</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
          <Text style={styles.infoText}>
            You are disputing <Text style={styles.bold}>Question {questionNumber}</Text>. Provide a clear, specific reason for why you believe the marks are incorrect.
          </Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Reason for Dispute</Text>
            <View style={[styles.textArea, error ? styles.textAreaError : null]}>
              <Input
                placeholder="Describe why you believe the marks are incorrect. Be specific about what was written in your answer and what the expected marks should be..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={styles.textInput}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.charCount}>{reason.length} characters</Text>
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={16} color={Colors.warning} />
            <Text style={styles.warningText}>
              Disputes are reviewed by the teacher. Frivolous disputes may impact your academic record.
            </Text>
          </View>

          <Button onPress={handleSubmit} fullWidth loading={mutation.isPending}>
            Submit Dispute
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 20 },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: Colors.infoLight, borderRadius: 10, padding: 14 },
  infoText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.info, lineHeight: 20 },
  bold: { fontFamily: FontFamily.semibold },
  form: { gap: 16 },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text, marginBottom: 6 },
  textArea: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, backgroundColor: Colors.surface, minHeight: 140, padding: 4 },
  textAreaError: { borderColor: Colors.error },
  textInput: { height: 130 },
  errorText: { fontSize: FontSize.xs, color: Colors.error, fontFamily: FontFamily.regular, marginTop: 4 },
  charCount: { fontSize: FontSize.xs, color: Colors.textMuted, fontFamily: FontFamily.regular, marginTop: 4, textAlign: 'right' },
  warningBox: { flexDirection: 'row', gap: 10, backgroundColor: Colors.warningLight, borderRadius: 10, padding: 14 },
  warningText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.warning, lineHeight: 20 },
});
