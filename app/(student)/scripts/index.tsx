import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../../../src/api/student';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../../src/components/ui/Skeleton';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { formatScore, formatPercentage, formatDate, getGradeColor, getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { EvaluatedScript } from '../../../src/types/student';

export default function ScriptsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['student', 'scripts'],
    queryFn: () => studentApi.getScripts(1, 50),
  });

  const scripts = data?.data ?? [];

  const renderItem = ({ item }: { item: EvaluatedScript }) => (
    <TouchableOpacity onPress={() => router.push(`/(student)/scripts/${item.id}`)}>
      <Card style={styles.card} padding={16}>
        <View style={styles.top}>
          <View style={styles.left}>
            <Text style={styles.subject} numberOfLines={1}>{item.subjectName}</Text>
            <Text style={styles.code}>{item.subjectCode} · {formatDate(item.examDate)}</Text>
          </View>
          <Badge
            label={getStatusLabel(item.status)}
            color={getStatusColor(item.status)}
            bgColor={`${getStatusColor(item.status)}18`}
          />
        </View>

        <View style={styles.bottom}>
          <View style={styles.scoreRow}>
            <Text style={[styles.score, { color: getGradeColor(item.percentage) }]}>
              {formatScore(item.marksObtained, item.totalMarks)}
            </Text>
            <Text style={styles.pct}> · {formatPercentage(item.percentage)}</Text>
          </View>
          <View style={styles.gradeChip}>
            <Text style={styles.grade}>{item.grade}</Text>
          </View>
        </View>

        {item.status === 'evaluated' && (
          <View style={styles.footer}>
            <Text style={styles.evalDate}>Evaluated {formatDate(item.evaluatedAt)}</Text>
            {item.blockchainHash && (
              <View style={styles.verifiedRow}>
                <Text style={styles.verified}>✓ Blockchain Verified</Text>
              </View>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Scripts</Text>
        <Text style={styles.count}>{scripts.length} exams</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={scripts}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="document-outline"
              title="No scripts yet"
              description="Your evaluated answer scripts will appear here once they are processed."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, gap: 2 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  count: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  loadingList: { paddingHorizontal: 16, gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 10 },
  card: {},
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  left: { flex: 1, marginRight: 12 },
  subject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, letterSpacing: -0.2 },
  code: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, letterSpacing: -0.4 },
  pct: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  gradeChip: { backgroundColor: Colors.skeleton, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  grade: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  evalDate: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verified: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.success },
});
