import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
import { formatScore, formatPercentage, formatDate, getGradeColor, getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { QuestionScore } from '../../../src/types/student';

const { width } = Dimensions.get('window');

export default function ScriptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'script', id],
    queryFn: () => studentApi.getScript(id),
    enabled: !!id,
  });

  const script = data?.data;

  if (isLoading) return <LoadingOverlay message="Loading script..." />;
  if (!script) return null;

  const percentage = script.percentage;

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.subject} numberOfLines={1}>{script.subjectName}</Text>
          <Text style={styles.code}>{script.subjectCode}</Text>
        </View>
        <Badge
          label={getStatusLabel(script.status)}
          color={getStatusColor(script.status)}
          bgColor={`${getStatusColor(script.status)}18`}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score summary */}
        <Card padding={20} style={styles.scoreCard}>
          <View style={styles.scoreMain}>
            <Text style={[styles.bigScore, { color: getGradeColor(percentage) }]}>
              {formatScore(script.marksObtained, script.totalMarks)}
            </Text>
            <View style={styles.gradeChip}>
              <Text style={styles.grade}>{script.grade}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: getGradeColor(percentage) }]} />
          </View>
          <Text style={[styles.pct, { color: getGradeColor(percentage) }]}>{formatPercentage(percentage)}</Text>

          <View style={styles.metaRow}>
            <MetaItem icon="calendar-outline" label="Exam Date" value={formatDate(script.examDate)} />
            <MetaItem icon="checkmark-circle-outline" label="Evaluated" value={formatDate(script.evaluatedAt)} />
          </View>

          {script.blockchainHash && (
            <View style={styles.blockchainRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.success} />
              <Text style={styles.blockchainText}>Blockchain Verified</Text>
              <Text style={styles.hashText} numberOfLines={1}>{script.blockchainHash.slice(0, 16)}…</Text>
            </View>
          )}
        </Card>

        {/* Question breakdown */}
        <Text style={styles.sectionTitle}>Question Breakdown</Text>

        {script.questions.map((q, idx) => (
          <QuestionCard key={idx} question={q} scriptId={script.id} />
        ))}
      </ScrollView>
    </View>
  );
}

const QuestionCard: React.FC<{ question: QuestionScore; scriptId: string }> = ({ question, scriptId }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const confidencePct = Math.round(question.confidence * 100);
  const scoreColor = getGradeColor((question.marksAwarded / question.maxMarks) * 100);

  return (
    <Card style={styles.qCard} padding={16}>
      <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.8}>
        <View style={styles.qHeader}>
          <View style={styles.qNumBadge}>
            <Text style={styles.qNum}>Q{question.questionNumber}</Text>
          </View>
          <View style={styles.qInfo}>
            <Text style={styles.qText} numberOfLines={expanded ? undefined : 2}>
              {question.questionText}
            </Text>
          </View>
          <View style={styles.qScore}>
            <Text style={[styles.qMark, { color: scoreColor }]}>
              {question.marksAwarded}/{question.maxMarks}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textMuted}
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.qDetails}>
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>AI Confidence</Text>
            <View style={styles.confBar}>
              <View style={[styles.confFill, { width: `${confidencePct}%` }]} />
            </View>
            <Text style={styles.confPct}>{confidencePct}%</Text>
          </View>

          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackTitle}>Feedback</Text>
            <Text style={styles.feedbackText}>{question.feedback}</Text>
          </View>

          {question.keyPoints.length > 0 && (
            <View style={styles.keyPoints}>
              <Text style={styles.keyPointsTitle}>Key Points</Text>
              {question.keyPoints.map((kp, i) => (
                <View key={i} style={styles.keyPoint}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.keyPointText}>{kp}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.disputeBtn}
            onPress={() =>
              router.push({
                pathname: '/(student)/disputes/new',
                params: { scriptId, questionNumber: String(question.questionNumber) },
              })
            }
          >
            <Ionicons name="flag-outline" size={14} color={Colors.warning} />
            <Text style={styles.disputeBtnText}>File a dispute for this question</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

const MetaItem: React.FC<{ icon: any; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.metaItem}>
    <Ionicons name={icon} size={14} color={Colors.textMuted} />
    <View>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1 },
  subject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  code: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  scoreCard: {},
  scoreMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bigScore: { fontSize: 36, fontFamily: FontFamily.bold, letterSpacing: -1 },
  gradeChip: { backgroundColor: Colors.skeleton, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  grade: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text },
  progressBar: { height: 6, backgroundColor: Colors.skeleton, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  pct: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 20, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  metaValue: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  blockchainRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  blockchainText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.success },
  hashText: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  qCard: {},
  qHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNumBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  qNum: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.text },
  qInfo: { flex: 1 },
  qText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 20 },
  qScore: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qMark: { fontSize: FontSize.base, fontFamily: FontFamily.bold, letterSpacing: -0.2 },
  qDetails: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border, gap: 14 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  confidenceLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted, width: 90 },
  confBar: { flex: 1, height: 4, backgroundColor: Colors.skeleton, borderRadius: 2, overflow: 'hidden' },
  confFill: { height: '100%', backgroundColor: Colors.info, borderRadius: 2 },
  confPct: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textSecondary, width: 36, textAlign: 'right' },
  feedbackBox: { backgroundColor: Colors.skeleton, borderRadius: 10, padding: 12, gap: 6 },
  feedbackTitle: { fontSize: FontSize.xs, fontFamily: FontFamily.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  feedbackText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 20 },
  keyPoints: { gap: 6 },
  keyPointsTitle: { fontSize: FontSize.xs, fontFamily: FontFamily.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  keyPoint: { flexDirection: 'row', gap: 6 },
  bullet: { fontSize: FontSize.base, color: Colors.textMuted },
  keyPointText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 20 },
  disputeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: `${Colors.warning}14`, borderRadius: 8 },
  disputeBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.warning },
});
