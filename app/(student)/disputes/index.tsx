import React from 'react';
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
import { formatDate, getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { Dispute } from '../../../src/types/student';

export default function DisputesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['student', 'disputes'],
    queryFn: () => studentApi.getDisputes(1, 50),
  });

  const disputes = data?.data ?? [];

  const renderItem = ({ item }: { item: Dispute }) => (
    <TouchableOpacity onPress={() => router.push(`/(student)/disputes/${item.id}`)}>
      <Card style={styles.card} padding={16}>
        <View style={styles.top}>
          <View style={styles.left}>
            <Text style={styles.subject} numberOfLines={1}>{item.subjectName}</Text>
            <Text style={styles.qNum}>Question {item.questionNumber}</Text>
          </View>
          <Badge
            label={getStatusLabel(item.status)}
            color={getStatusColor(item.status)}
            bgColor={`${getStatusColor(item.status)}18`}
          />
        </View>
        <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>
        <View style={styles.footer}>
          <Text style={styles.filed}>Filed {formatDate(item.filedAt)}</Text>
          {item.resolvedAt && <Text style={styles.resolved}>Resolved {formatDate(item.resolvedAt)}</Text>}
        </View>
        {item.revisedMarks !== undefined && (
          <View style={styles.revisedRow}>
            <Text style={styles.revisedText}>
              Marks: {item.originalMarks} → {item.revisedMarks}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Disputes</Text>
        <Text style={styles.count}>{disputes.length} filed</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2].map((k) => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={disputes}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="flag-outline"
              title="No disputes"
              description="You haven't filed any disputes yet. You can dispute individual question marks from the script detail screen."
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
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  left: { flex: 1, marginRight: 12 },
  subject: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  qNum: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  reason: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  filed: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  resolved: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.success },
  revisedRow: { marginTop: 10, backgroundColor: Colors.successLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  revisedText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.success },
});
